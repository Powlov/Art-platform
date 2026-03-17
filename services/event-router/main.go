package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/sony/gobreaker"
	amqp "github.com/rabbitmq/amqp091-go"
)

// Event represents a system event
type Event struct {
	ID          string                 `json:"id"`
	Type        string                 `json:"type"`
	Source      string                 `json:"source"`
	Payload     map[string]interface{} `json:"payload"`
	Timestamp   time.Time              `json:"timestamp"`
	RetryCount  int                    `json:"retry_count"`
}

// EventRouter handles event routing with Circuit Breaker pattern
type EventRouter struct {
	rabbitConn    *amqp.Connection
	channel       *amqp.Channel
	analyticsBreaker *gobreaker.CircuitBreaker
	transactionBreaker *gobreaker.CircuitBreaker
	mediaBreaker *gobreaker.CircuitBreaker
}

// JWT Claims
type Claims struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

// NewEventRouter creates new router instance
func NewEventRouter() (*EventRouter, error) {
	// Connect to RabbitMQ
	rabbitURL := getEnv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
	conn, err := amqp.Dial(rabbitURL)
	if err != nil {
		return nil, err
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	// Declare exchanges
	exchanges := []string{"analytics", "transactions", "media"}
	for _, exchange := range exchanges {
		err = ch.ExchangeDeclare(
			exchange, "topic", true, false, false, false, nil,
		)
		if err != nil {
			return nil, err
		}
	}

	// Create circuit breakers
	cbSettings := gobreaker.Settings{
		Name:        "default",
		MaxRequests: 3,
		Interval:    time.Second * 10,
		Timeout:     time.Second * 60,
		ReadyToTrip: func(counts gobreaker.Counts) bool {
			return counts.ConsecutiveFailures > 3
		},
	}

	return &EventRouter{
		rabbitConn:         conn,
		channel:            ch,
		analyticsBreaker:   gobreaker.NewCircuitBreaker(cbSettings),
		transactionBreaker: gobreaker.NewCircuitBreaker(cbSettings),
		mediaBreaker:       gobreaker.NewCircuitBreaker(cbSettings),
	}, nil
}

// Close cleanup resources
func (er *EventRouter) Close() {
	er.channel.Close()
	er.rabbitConn.Close()
}

// PublishEvent publishes event to appropriate exchange
func (er *EventRouter) PublishEvent(event Event) error {
	body, err := json.Marshal(event)
	if err != nil {
		return err
	}

	var exchange string
	switch event.Type {
	case "artwork.created", "artwork.updated", "price.changed":
		exchange = "analytics"
	case "transaction.created", "transaction.completed", "auction.bid":
		exchange = "transactions"
	case "media.published", "news.sentiment":
		exchange = "media"
	default:
		exchange = "analytics"
	}

	return er.channel.Publish(
		exchange,
		event.Type,
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
}

// RouteEvent routes event through circuit breakers
func (er *EventRouter) RouteEvent(event Event) error {
	switch event.Source {
	case "analytics":
		_, err := er.analyticsBreaker.Execute(func() (interface{}, error) {
			return nil, er.PublishEvent(event)
		})
		return err
	case "transaction_hub":
		_, err := er.transactionBreaker.Execute(func() (interface{}, error) {
			return nil, er.PublishEvent(event)
		})
		return err
	case "media_hub":
		_, err := er.mediaBreaker.Execute(func() (interface{}, error) {
			return nil, er.PublishEvent(event)
		})
		return err
	default:
		return er.PublishEvent(event)
	}
}

// Middleware: JWT Authentication
func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Add claims to context
		ctx := context.WithValue(r.Context(), "claims", claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// API Handlers
func (er *EventRouter) handlePublishEvent(w http.ResponseWriter, r *http.Request) {
	var event Event
	if err := json.NewDecoder(r.Body).Decode(&event); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	event.Timestamp = time.Now()
	if err := er.RouteEvent(event); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{"status": "accepted"})
}

func (er *EventRouter) handleHealth(w http.ResponseWriter, r *http.Request) {
	health := map[string]interface{}{
		"status": "healthy",
		"services": map[string]string{
			"analytics":    er.analyticsBreaker.State().String(),
			"transactions": er.transactionBreaker.State().String(),
			"media":        er.mediaBreaker.State().String(),
		},
	}
	json.NewEncoder(w).Encode(health)
}

// GetEnv helper
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func main() {
	// Initialize router
	router, err := NewEventRouter()
	if err != nil {
		log.Fatal("Failed to initialize router:", err)
	}
	defer router.Close()

	// Setup HTTP server
	r := mux.NewRouter()
	
	// Public endpoints
	r.HandleFunc("/health", router.handleHealth).Methods("GET")
	
	// Protected endpoints
	protected := r.PathPrefix("/api/v1").Subrouter()
	protected.Use(authMiddleware)
	protected.HandleFunc("/events", router.handlePublishEvent).Methods("POST")

	// HTTP Server
	port := getEnv("PORT", "8080")
	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	go func() {
		log.Printf("Event Router listening on :%s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Server error:", err)
		}
	}()

	// Wait for interrupt
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	srv.Shutdown(ctx)
}
