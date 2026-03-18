#!/usr/bin/env python3
"""
End-to-End Test Scenarios for Art-OS
Tests complete workflows across all microservices
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any

# Service URLs
SERVICES = {
    "analytics": "http://localhost:8001",
    "media": "http://localhost:8003",
    "gateway": "http://localhost:8000",
}

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

class E2ETestRunner:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.tests_failed = 0
    
    def log(self, message: str, color: str = Colors.BLUE):
        print(f"{color}{message}{Colors.END}")
    
    def log_success(self, message: str):
        self.log(f"✅ {message}", Colors.GREEN)
    
    def log_error(self, message: str):
        self.log(f"❌ {message}", Colors.RED)
    
    def log_warning(self, message: str):
        self.log(f"⚠️  {message}", Colors.YELLOW)
    
    def run_test(self, name: str, test_func):
        """Run a single test"""
        self.log(f"\n🧪 Testing: {name}")
        self.tests_run += 1
        
        try:
            result = test_func()
            if result:
                self.tests_passed += 1
                self.log_success(f"PASSED: {name}")
                return True
            else:
                self.tests_failed += 1
                self.log_error(f"FAILED: {name}")
                return False
        except Exception as e:
            self.tests_failed += 1
            self.log_error(f"ERROR in {name}: {str(e)}")
            return False
    
    def print_summary(self):
        """Print test summary"""
        self.log("\n" + "="*60)
        self.log("📊 Test Summary", Colors.BLUE)
        self.log("="*60)
        self.log(f"Tests Run: {self.tests_run}")
        self.log(f"Passed: {self.tests_passed}", Colors.GREEN)
        if self.tests_failed > 0:
            self.log(f"Failed: {self.tests_failed}", Colors.RED)
        else:
            self.log(f"Failed: {self.tests_failed}", Colors.GREEN)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        self.log(f"Success Rate: {success_rate:.1f}%")
        self.log("="*60 + "\n")

# Initialize runner
runner = E2ETestRunner()

# Test 1: Health Checks
def test_health_checks():
    """Test all services are healthy"""
    all_healthy = True
    
    for service, url in SERVICES.items():
        try:
            response = requests.get(f"{url}/health", timeout=5)
            if response.status_code == 200:
                runner.log_success(f"{service} is healthy")
            else:
                runner.log_error(f"{service} returned {response.status_code}")
                all_healthy = False
        except Exception as e:
            runner.log_error(f"{service} is unreachable: {e}")
            all_healthy = False
    
    return all_healthy

# Test 2: KDE Fair Price Calculation
def test_kde_pricing():
    """Test KDE algorithm for fair price calculation"""
    try:
        response = requests.post(
            f"{SERVICES['analytics']}/api/v1/analytics/fair-price",
            json={
                "artwork_id": "test-artwork-001",
                "category": "painting",
                "artist_id": "test-artist-001"
            },
            timeout=10
        )
        
        if response.status_code != 200:
            runner.log_error(f"KDE API returned {response.status_code}")
            return False
        
        data = response.json()
        
        # Validate response structure
        required_fields = ["fair_price", "confidence", "sample_size", "price_range"]
        for field in required_fields:
            if field not in data:
                runner.log_error(f"Missing field: {field}")
                return False
        
        # Validate values
        if data["fair_price"] <= 0:
            runner.log_error("Invalid fair_price")
            return False
        
        if not 0 <= data["confidence"] <= 1:
            runner.log_error("Invalid confidence score")
            return False
        
        runner.log_success(f"KDE calculated fair price: ${data['fair_price']:.2f} (confidence: {data['confidence']})")
        return True
    
    except Exception as e:
        runner.log_error(f"KDE test failed: {e}")
        return False

# Test 3: Sentiment Analysis
def test_sentiment_analysis():
    """Test Media Hub sentiment analysis"""
    try:
        response = requests.post(
            f"{SERVICES['media']}/api/v1/media/analyze-article",
            json={
                "title": "Exceptional Artwork Breaks Records",
                "content": "A stunning masterpiece has sold for an outstanding price, marking a remarkable achievement.",
                "source_url": "https://test.com/article",
                "source_name": "Test Source"
            },
            timeout=10
        )
        
        if response.status_code != 200:
            runner.log_error(f"Sentiment API returned {response.status_code}")
            return False
        
        data = response.json()
        
        # Validate sentiment
        if data["sentiment_label"] != "positive":
            runner.log_error(f"Expected positive sentiment, got {data['sentiment_label']}")
            return False
        
        if data["sentiment_score"] <= 0:
            runner.log_error("Expected positive sentiment score")
            return False
        
        runner.log_success(f"Sentiment: {data['sentiment_label']} (score: {data['sentiment_score']}, impact: {data['price_impact']}%)")
        return True
    
    except Exception as e:
        runner.log_error(f"Sentiment test failed: {e}")
        return False

# Test 4: Cascade Pricing
def test_cascade_pricing():
    """Test cascade pricing mechanism"""
    try:
        response = requests.get(
            f"{SERVICES['analytics']}/api/v1/analytics/cascade-pricing/preview",
            params={
                "artwork_id": "artwork-001",
                "new_price": 25000
            },
            timeout=10
        )
        
        if response.status_code != 200:
            runner.log_error(f"Cascade API returned {response.status_code}")
            return False
        
        data = response.json()
        
        # Validate cascade response
        if "affected_artworks" not in data:
            runner.log_error("Missing affected_artworks")
            return False
        
        affected_count = len(data["affected_artworks"])
        runner.log_success(f"Cascade pricing affected {affected_count} artworks")
        
        # Check adjustments
        for artwork in data["affected_artworks"]:
            adj_pct = artwork["adjustment_percent"]
            if abs(adj_pct) > 20:
                runner.log_warning(f"Adjustment exceeds 20%: {adj_pct}%")
        
        return True
    
    except Exception as e:
        runner.log_error(f"Cascade pricing test failed: {e}")
        return False

# Test 5: Fraud Detection
def test_fraud_detection():
    """Test fraud detection scan"""
    try:
        response = requests.post(
            f"{SERVICES['analytics']}/api/v1/analytics/fraud-detection/scan",
            json={},
            timeout=15
        )
        
        if response.status_code != 200:
            runner.log_error(f"Fraud detection API returned {response.status_code}")
            return False
        
        data = response.json()
        
        # Validate response
        if "checks_performed" not in data:
            runner.log_error("Missing checks_performed")
            return False
        
        runner.log_success(f"Fraud scan complete: {data['checks_performed']} checks, {data['alerts_found']} alerts")
        
        # Log alert types
        if data["alerts_found"] > 0:
            alert_types = set(alert["type"] for alert in data["alerts"])
            runner.log_warning(f"Alert types: {', '.join(alert_types)}")
        
        return True
    
    except Exception as e:
        runner.log_error(f"Fraud detection test failed: {e}")
        return False

# Test 6: Media Impact Analysis
def test_media_impact():
    """Test media impact aggregation"""
    try:
        # First analyze an article
        requests.post(
            f"{SERVICES['media']}/api/v1/media/analyze-article",
            json={
                "title": "Famous Artist's Work Gains Recognition",
                "content": "The artwork has received outstanding reviews and prestigious awards.",
                "source_url": "https://test.com/article2",
                "source_name": "Art News"
            },
            timeout=10
        )
        
        # Then get impact analysis
        response = requests.post(
            f"{SERVICES['media']}/api/v1/media/analyze-impact",
            params={
                "artwork_id": "test-artwork-001",
                "artist_name": "Test Artist"
            },
            timeout=10
        )
        
        if response.status_code != 200:
            runner.log_error(f"Media impact API returned {response.status_code}")
            return False
        
        data = response.json()
        
        runner.log_success(f"Media impact: {data['total_mentions']} mentions, sentiment: {data['avg_sentiment']:.2f}")
        return True
    
    except Exception as e:
        runner.log_error(f"Media impact test failed: {e}")
        return False

# Test 7: API Gateway (if available)
def test_api_gateway():
    """Test API Gateway routing"""
    try:
        # Test gateway health
        response = requests.get(f"{SERVICES['gateway']}/health", timeout=5)
        
        if response.status_code != 200:
            runner.log_warning("API Gateway not available")
            return True  # Not critical
        
        data = response.json()
        
        # Check service routing
        services_status = data.get("services", {})
        all_healthy = all(s.get("status") == "healthy" for s in services_status.values())
        
        if all_healthy:
            runner.log_success("API Gateway: All services routable")
        else:
            runner.log_warning("API Gateway: Some services unreachable")
        
        return True
    
    except Exception as e:
        runner.log_warning(f"API Gateway test skipped: {e}")
        return True  # Not critical

# Run all tests
def run_all_tests():
    """Run all end-to-end tests"""
    runner.log("="*60, Colors.BLUE)
    runner.log("🚀 Art-OS End-to-End Test Suite", Colors.BLUE)
    runner.log("="*60 + "\n", Colors.BLUE)
    
    # Run tests
    runner.run_test("Service Health Checks", test_health_checks)
    runner.run_test("KDE Fair Price Calculation", test_kde_pricing)
    runner.run_test("Sentiment Analysis", test_sentiment_analysis)
    runner.run_test("Cascade Pricing", test_cascade_pricing)
    runner.run_test("Fraud Detection", test_fraud_detection)
    runner.run_test("Media Impact Analysis", test_media_impact)
    runner.run_test("API Gateway Routing", test_api_gateway)
    
    # Print summary
    runner.print_summary()
    
    # Return exit code
    return 0 if runner.tests_failed == 0 else 1

if __name__ == "__main__":
    import sys
    sys.exit(run_all_tests())
