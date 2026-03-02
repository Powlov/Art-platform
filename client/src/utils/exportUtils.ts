/**
 * Export utilities for CSV and JSON formats
 * Lightweight implementation without external dependencies
 */

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV(data: Record<string, any>[], headers?: string[]): string {
  if (data.length === 0) return '';

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = csvHeaders.map(escapeCSVValue).join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header];
      return escapeCSVValue(value);
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Escape CSV values (handle commas, quotes, newlines)
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) return '';
  
  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Download string as file
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data as CSV file
 */
export function exportToCSV(
  data: Record<string, any>[],
  filename: string,
  headers?: string[]
) {
  const csv = convertToCSV(data, headers);
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Export data as JSON file
 */
export function exportToJSON(
  data: any,
  filename: string
) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json;charset=utf-8;');
}

/**
 * Format date for filenames (YYYY-MM-DD_HH-mm-ss)
 */
export function getTimestampForFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * Format currency for export
 */
export function formatCurrencyForExport(value: number, currency: string = 'RUB'): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format date for export
 */
export function formatDateForExport(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Prepare fraud alerts for CSV export
 */
export function prepareFraudAlertsForExport(alerts: any[]) {
  return alerts.map(alert => ({
    'Alert ID': alert.id,
    'Type': alert.type,
    'Severity': alert.severity,
    'Status': alert.status,
    'Artwork ID': alert.artworkId,
    'Artwork Title': alert.artworkTitle,
    'Description': alert.description,
    'Confidence': alert.confidence ? `${alert.confidence}%` : 'N/A',
    'Timestamp': formatDateForExport(alert.timestamp),
  }));
}

/**
 * Prepare banking loans for CSV export
 */
export function prepareBankingLoansForExport(loans: any[]) {
  return loans.map(loan => ({
    'Loan ID': loan.loanId,
    'Bank': loan.bankName,
    'Artwork': loan.artworkTitle,
    'Artwork Value': formatCurrencyForExport(loan.artworkValue),
    'Loan Amount': formatCurrencyForExport(loan.loanAmount),
    'Current LTV': `${loan.currentLTV.toFixed(1)}%`,
    'Interest Rate': `${loan.interestRate}%`,
    'Term (months)': loan.term,
    'Status': loan.status,
    'Risk Level': loan.riskLevel,
    'Margin Call Threshold': `${loan.marginCallThreshold}%`,
    'Last Valuation': formatDateForExport(loan.lastValuation),
    'Next Valuation': formatDateForExport(loan.nextValuation),
  }));
}

/**
 * Prepare banking integrations for CSV export
 */
export function prepareBankingIntegrationsForExport(integrations: any[]) {
  return integrations.map(bank => ({
    'Bank ID': bank.bankId,
    'Bank Name': bank.bankName,
    'Status': bank.status,
    'Loan Volume': formatCurrencyForExport(bank.loanVolume),
    'Average LTV': `${bank.avgLTV.toFixed(1)}%`,
    'Active Loans': bank.activeLoans,
    'Last Sync': formatDateForExport(bank.lastSync),
  }));
}

/**
 * Prepare graph nodes for CSV export
 */
export function prepareGraphNodesForExport(nodes: any[]) {
  return nodes.map(node => ({
    'Node ID': node.id,
    'Name': node.name,
    'Type': node.type,
    'Trust Score': `${node.trustScore.toFixed(1)}%`,
    'Verified': node.verified ? 'Yes' : 'No',
    'Connections': node.connections || 0,
    'Digital ID': node.digitalId || 'N/A',
    'Created At': node.createdAt ? formatDateForExport(node.createdAt) : 'N/A',
  }));
}
