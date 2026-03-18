package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
	amqp "github.com/rabbitmq/amqp091-go"
)

// Transaction represents a transaction
type Transaction struct {
	ID          string                 `json:"id"`
	ArtworkID   string                 `json:"artwork_id"`
	SellerID    string                 `json:"seller_id"`
	BuyerID     string                 `json:"buyer_id"`
	Amount      float64                `json:"amount"`
	Currency    string                 `json:"currency"`
	Type        string                 `json:"transaction_type"`
	Status      string                 `json:"status"`
	SagaID      string                 `json:"saga_id"`
	CreatedAt   time.Time              `json:"created_at"`
	CompletedAt *time.Time             `json:"completed_at,omitempty"`
}

// SagaStep represents a step in the Saga
type SagaStep struct {
	ID              string                 `json:"id"`
	TransactionID   string                 `json:"transaction_id"`
	StepName        string                 `json:"step_name"`
	Status          string                 `json:"step_status"`
	StartedAt       *time.Time             `json:"started_at,omitempty"`
	CompletedAt     *time.Time             `json:"completed_at,omitempty"`
	ErrorMessage    string                 `json:"error_message,omitempty"`
	CompensationData map[string]interface{} `json:"compensation_data,omitempty"`
}

// TransactionHub handles distributed transactions
type TransactionHub struct {
	db             *sql.DB
	rabbitConn     *amqp.Connection
	rabbitChannel  *amqp.Channel
}

// NewTransactionHub creates new transaction hub
func NewTransactionHub(dbPath string, rabbitURL string) (*TransactionHub, error) {
	// Open database
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	// Connect to RabbitMQ
	conn, err := amqp.Dial(rabbitURL)
	if err != nil {
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	// Declare exchange
	err = ch.ExchangeDeclare(
		"transactions", "topic", true, false, false, false, nil,
	)
	if err != nil {
		return nil, err
	}

	return &TransactionHub{
		db:             db,
		rabbitConn:     conn,
		rabbitChannel:  ch,
	}, nil
}

// Close cleanup resources
func (th *TransactionHub) Close() {
	th.rabbitChannel.Close()
	th.rabbitConn.Close()
	th.db.Close()
}

// CreateTransaction starts a new Saga transaction
func (th *TransactionHub) CreateTransaction(ctx context.Context, tx Transaction) (*Transaction, error) {
	// Generate IDs
	tx.ID = uuid.New().String()
	tx.SagaID = uuid.New().String()
	tx.Status = "pending"
	tx.CreatedAt = time.Now()

	// Insert transaction
	_, err := th.db.ExecContext(ctx, `
		INSERT INTO transactions 
		(id, artwork_id, seller_id, buyer_id, amount, currency, transaction_type, status, saga_id, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, tx.ID, tx.ArtworkID, tx.SellerID, tx.BuyerID, tx.Amount, tx.Currency, tx.Type, tx.Status, tx.SagaID, tx.CreatedAt)
	
	if err != nil {
		return nil, err
	}

	// Start Saga
	go th.executeSaga(tx)

	return &tx, nil
}

// executeSaga executes Saga pattern steps
func (th *TransactionHub) executeSaga(tx Transaction) {
	ctx := context.Background()
	
	steps := []struct {
		name string
		fn   func(context.Context, Transaction) error
		compensate func(context.Context, Transaction) error
	}{
		{
			name: "validate_ownership",
			fn:   th.validateOwnership,
			compensate: th.compensateNothing,
		},
		{
			name: "reserve_artwork",
			fn:   th.reserveArtwork,
			compensate: th.unreserveArtwork,
		},
		{
			name: "process_payment",
			fn:   th.processPayment,
			compensate: th.refundPayment,
		},
		{
			name: "transfer_ownership",
			fn:   th.transferOwnership,
			compensate: th.revertOwnership,
		},
		{
			name: "update_price_history",
			fn:   th.updatePriceHistory,
			compensate: th.compensateNothing,
		},
		{
			name: "cascade_pricing",
			fn:   th.triggerCascadePricing,
			compensate: th.compensateNothing,
		},
	}

	executedSteps := []int{}

	// Execute steps
	for i, step := range steps {
		stepID := uuid.New().String()
		now := time.Now()

		// Create step record
		_, err := th.db.ExecContext(ctx, `
			INSERT INTO transaction_steps (id, transaction_id, step_name, step_status, started_at)
			VALUES (?, ?, ?, ?, ?)
		`, stepID, tx.ID, step.name, "executing", now)

		if err != nil {
			log.Printf("Failed to create step record: %v", err)
			th.compensateSaga(ctx, tx, steps, executedSteps)
			return
		}

		// Execute step
		err = step.fn(ctx, tx)
		
		if err != nil {
			// Mark step as failed
			th.db.ExecContext(ctx, `
				UPDATE transaction_steps 
				SET step_status = 'failed', error_message = ?
				WHERE id = ?
			`, err.Error(), stepID)

			// Mark transaction as failed
			th.db.ExecContext(ctx, `
				UPDATE transactions SET status = 'failed' WHERE id = ?
			`, tx.ID)

			// Compensate
			log.Printf("Step %s failed: %v. Starting compensation...", step.name, err)
			th.compensateSaga(ctx, tx, steps, executedSteps)
			return
		}

		// Mark step as completed
		completedAt := time.Now()
		th.db.ExecContext(ctx, `
			UPDATE transaction_steps 
			SET step_status = 'completed', completed_at = ?
			WHERE id = ?
		`, completedAt, stepID)

		executedSteps = append(executedSteps, i)
	}

	// All steps successful
	completedAt := time.Now()
	th.db.ExecContext(ctx, `
		UPDATE transactions 
		SET status = 'completed', completed_at = ?
		WHERE id = ?
	`, completedAt, tx.ID)

	// Publish success event
	th.publishEvent("transaction.completed", tx)

	log.Printf("Transaction %s completed successfully", tx.ID)
}

// compensateSaga executes compensation for failed saga
func (th *TransactionHub) compensateSaga(ctx context.Context, tx Transaction, steps []struct{
	name string
	fn func(context.Context, Transaction) error
	compensate func(context.Context, Transaction) error
}, executedSteps []int) {
	
	th.db.ExecContext(ctx, `
		UPDATE transactions SET status = 'compensating' WHERE id = ?
	`, tx.ID)

	// Compensate in reverse order
	for i := len(executedSteps) - 1; i >= 0; i-- {
		stepIdx := executedSteps[i]
		step := steps[stepIdx]

		stepID := uuid.New().String()
		now := time.Now()

		// Create compensation step
		th.db.ExecContext(ctx, `
			INSERT INTO transaction_steps (id, transaction_id, step_name, step_status, started_at)
			VALUES (?, ?, ?, ?, ?)
		`, stepID, tx.ID, "compensate_"+step.name, "compensating", now)

		// Execute compensation
		err := step.compensate(ctx, tx)
		
		if err != nil {
			log.Printf("Compensation failed for %s: %v", step.name, err)
			th.db.ExecContext(ctx, `
				UPDATE transaction_steps 
				SET step_status = 'compensation_failed', error_message = ?
				WHERE id = ?
			`, err.Error(), stepID)
		} else {
			completedAt := time.Now()
			th.db.ExecContext(ctx, `
				UPDATE transaction_steps 
				SET step_status = 'compensated', completed_at = ?
				WHERE id = ?
			`, completedAt, stepID)
		}
	}

	th.db.ExecContext(ctx, `
		UPDATE transactions SET status = 'compensated' WHERE id = ?
	`, tx.ID)

	log.Printf("Transaction %s compensated", tx.ID)
}

// Saga step implementations
func (th *TransactionHub) validateOwnership(ctx context.Context, tx Transaction) error {
	var ownerID string
	err := th.db.QueryRowContext(ctx, `
		SELECT owner_id FROM ownership_link 
		WHERE artwork_id = ? AND is_active = 1
	`, tx.ArtworkID).Scan(&ownerID)
	
	if err != nil {
		return fmt.Errorf("artwork not found or no active owner")
	}
	
	if ownerID != tx.SellerID {
		return fmt.Errorf("seller is not the owner")
	}
	
	return nil
}

func (th *TransactionHub) reserveArtwork(ctx context.Context, tx Transaction) error {
	result, err := th.db.ExecContext(ctx, `
		UPDATE artworks SET status = 'reserved' WHERE id = ? AND status = 'available'
	`, tx.ArtworkID)
	
	if err != nil {
		return err
	}
	
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("artwork not available for reservation")
	}
	
	return nil
}

func (th *TransactionHub) unreserveArtwork(ctx context.Context, tx Transaction) error {
	_, err := th.db.ExecContext(ctx, `
		UPDATE artworks SET status = 'available' WHERE id = ?
	`, tx.ArtworkID)
	return err
}

func (th *TransactionHub) processPayment(ctx context.Context, tx Transaction) error {
	// Mock payment processing
	// In production: integrate with Stripe, etc.
	time.Sleep(100 * time.Millisecond)
	return nil
}

func (th *TransactionHub) refundPayment(ctx context.Context, tx Transaction) error {
	// Mock refund
	time.Sleep(50 * time.Millisecond)
	return nil
}

func (th *TransactionHub) transferOwnership(ctx context.Context, tx Transaction) error {
	// Deactivate old ownership
	_, err := th.db.ExecContext(ctx, `
		UPDATE ownership_link 
		SET is_active = 0, ended_at = ?
		WHERE artwork_id = ? AND is_active = 1
	`, time.Now(), tx.ArtworkID)
	
	if err != nil {
		return err
	}

	// Create new ownership
	newOwnershipID := uuid.New().String()
	_, err = th.db.ExecContext(ctx, `
		INSERT INTO ownership_link 
		(id, artwork_id, owner_id, acquired_at, acquired_price, is_active)
		VALUES (?, ?, ?, ?, ?, 1)
	`, newOwnershipID, tx.ArtworkID, tx.BuyerID, time.Now(), tx.Amount)

	return err
}

func (th *TransactionHub) revertOwnership(ctx context.Context, tx Transaction) error {
	// Remove buyer's ownership
	_, err := th.db.ExecContext(ctx, `
		DELETE FROM ownership_link 
		WHERE artwork_id = ? AND owner_id = ?
	`, tx.ArtworkID, tx.BuyerID)
	
	if err != nil {
		return err
	}

	// Reactivate seller's ownership
	_, err = th.db.ExecContext(ctx, `
		UPDATE ownership_link 
		SET is_active = 1, ended_at = NULL
		WHERE artwork_id = ? AND owner_id = ?
	`, tx.ArtworkID, tx.SellerID)

	return err
}

func (th *TransactionHub) updatePriceHistory(ctx context.Context, tx Transaction) error {
	priceID := uuid.New().String()
	_, err := th.db.ExecContext(ctx, `
		INSERT INTO price_history 
		(id, artwork_id, price, currency, changed_reason, changed_by, transaction_id)
		VALUES (?, ?, ?, ?, 'sale', 'transaction', ?)
	`, priceID, tx.ArtworkID, tx.Amount, tx.Currency, tx.ID)
	
	return err
}

func (th *TransactionHub) triggerCascadePricing(ctx context.Context, tx Transaction) error {
	// Publish event for Analytics Service to recalculate prices
	event := map[string]interface{}{
		"type":        "price.cascade",
		"artwork_id":  tx.ArtworkID,
		"new_price":   tx.Amount,
		"transaction": tx.ID,
	}
	
	body, _ := json.Marshal(event)
	return th.rabbitChannel.Publish(
		"analytics", "price.cascade", false, false,
		amqp.Publishing{ContentType: "application/json", Body: body},
	)
}

func (th *TransactionHub) compensateNothing(ctx context.Context, tx Transaction) error {
	return nil
}

func (th *TransactionHub) publishEvent(eventType string, tx Transaction) {
	event := map[string]interface{}{
		"type":        eventType,
		"transaction": tx,
		"timestamp":   time.Now(),
	}
	
	body, _ := json.Marshal(event)
	th.rabbitChannel.Publish(
		"transactions", eventType, false, false,
		amqp.Publishing{ContentType: "application/json", Body: body},
	)
}

// HTTP Handlers
func (th *TransactionHub) handleCreateTransaction(w http.ResponseWriter, r *http.Request) {
	var req Transaction
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	tx, err := th.CreateTransaction(r.Context(), req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tx)
}

func (th *TransactionHub) handleGetTransaction(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	txID := vars["id"]

	var tx Transaction
	err := th.db.QueryRowContext(r.Context(), `
		SELECT id, artwork_id, seller_id, buyer_id, amount, currency, 
		       transaction_type, status, saga_id, created_at
		FROM transactions WHERE id = ?
	`, txID).Scan(
		&tx.ID, &tx.ArtworkID, &tx.SellerID, &tx.BuyerID,
		&tx.Amount, &tx.Currency, &tx.Type, &tx.Status, &tx.SagaID, &tx.CreatedAt,
	)

	if err != nil {
		http.Error(w, "Transaction not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tx)
}

func (th *TransactionHub) handleGetSagaSteps(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	txID := vars["id"]

	rows, err := th.db.QueryContext(r.Context(), `
		SELECT id, transaction_id, step_name, step_status, started_at, completed_at, error_message
		FROM transaction_steps WHERE transaction_id = ?
		ORDER BY started_at
	`, txID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var steps []SagaStep
	for rows.Next() {
		var step SagaStep
		var startedAt, completedAt sql.NullTime
		var errorMsg sql.NullString

		rows.Scan(&step.ID, &step.TransactionID, &step.StepName, &step.Status, 
			&startedAt, &completedAt, &errorMsg)

		if startedAt.Valid {
			step.StartedAt = &startedAt.Time
		}
		if completedAt.Valid {
			step.CompletedAt = &completedAt.Time
		}
		if errorMsg.Valid {
			step.ErrorMessage = errorMsg.String
		}

		steps = append(steps, step)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(steps)
}

func (th *TransactionHub) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "healthy",
		"service": "transaction-hub",
	})
}

func main() {
	dbPath := getEnv("DB_PATH", "/home/user/webapp/Art-platform/artbank-postgres.db")
	rabbitURL := getEnv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
	port := getEnv("PORT", "8002")

	hub, err := NewTransactionHub(dbPath, rabbitURL)
	if err != nil {
		log.Fatal("Failed to initialize transaction hub:", err)
	}
	defer hub.Close()

	r := mux.NewRouter()
	
	r.HandleFunc("/health", hub.handleHealth).Methods("GET")
	r.HandleFunc("/api/v1/transactions", hub.handleCreateTransaction).Methods("POST")
	r.HandleFunc("/api/v1/transactions/{id}", hub.handleGetTransaction).Methods("GET")
	r.HandleFunc("/api/v1/transactions/{id}/saga-steps", hub.handleGetSagaSteps).Methods("GET")

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	log.Printf("Transaction Hub listening on :%s", port)
	log.Fatal(srv.ListenAndServe())
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
