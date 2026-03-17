"""
Art-OS Media Hub
NLP-based news parsing, sentiment analysis, and price impact prediction
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import httpx
from datetime import datetime
import re
import os

app = FastAPI(title="Art-OS Media Hub", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class NewsArticle(BaseModel):
    title: str
    content: str
    source_url: str
    source_name: str
    published_at: Optional[datetime] = None

class SentimentResult(BaseModel):
    article_id: str
    sentiment_score: float  # -1.0 to 1.0
    sentiment_label: str  # positive, negative, neutral
    confidence: float
    keywords: List[str]
    mentioned_artists: List[str]
    mentioned_artworks: List[str]
    price_impact: float  # predicted price impact %

class MediaImpactAnalysis(BaseModel):
    artwork_id: str
    total_mentions: int
    avg_sentiment: float
    predicted_price_change: float
    confidence: float
    top_articles: List[dict]

# Simple sentiment analyzer (in production, use transformers)
class SimpleSentimentAnalyzer:
    """
    Simple rule-based sentiment analyzer
    In production, use models like:
    - transformers (BERT, RoBERTa)
    - TextBlob
    - VADER
    """
    
    def __init__(self):
        self.positive_words = {
            'excellent', 'amazing', 'beautiful', 'stunning', 'masterpiece',
            'brilliant', 'exceptional', 'outstanding', 'impressive', 'remarkable',
            'sold', 'acquired', 'exhibited', 'prestigious', 'acclaimed',
            'valuable', 'rare', 'unique', 'investment', 'record-breaking'
        }
        
        self.negative_words = {
            'poor', 'disappointing', 'overpriced', 'mediocre', 'derivative',
            'forgery', 'fake', 'fraud', 'scandal', 'controversial',
            'declined', 'fell', 'dropped', 'loss', 'dispute'
        }
        
        self.artist_patterns = [
            r'artist\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        ]
        
        self.artwork_patterns = [
            r'"([^"]+)"',
            r'painting\s+"([^"]+)"',
            r'sculpture\s+"([^"]+)"',
        ]
    
    def analyze(self, text: str) -> dict:
        """Analyze sentiment of text"""
        text_lower = text.lower()
        words = set(re.findall(r'\b\w+\b', text_lower))
        
        # Count sentiment words
        positive_count = len(words & self.positive_words)
        negative_count = len(words & self.negative_words)
        
        # Calculate sentiment score
        total = positive_count + negative_count
        if total == 0:
            sentiment_score = 0.0
            sentiment_label = 'neutral'
            confidence = 0.5
        else:
            sentiment_score = (positive_count - negative_count) / total
            confidence = min(1.0, total / 10)
            
            if sentiment_score > 0.2:
                sentiment_label = 'positive'
            elif sentiment_score < -0.2:
                sentiment_label = 'negative'
            else:
                sentiment_label = 'neutral'
        
        # Extract keywords
        keywords = list((words & (self.positive_words | self.negative_words)))[:10]
        
        # Extract artists and artworks
        artists = []
        for pattern in self.artist_patterns:
            matches = re.findall(pattern, text)
            artists.extend(matches)
        
        artworks = []
        for pattern in self.artwork_patterns:
            matches = re.findall(pattern, text)
            artworks.extend(matches)
        
        # Predict price impact based on sentiment
        price_impact = sentiment_score * 5  # +/- 5% max
        
        return {
            'sentiment_score': round(sentiment_score, 3),
            'sentiment_label': sentiment_label,
            'confidence': round(confidence, 3),
            'keywords': keywords,
            'mentioned_artists': list(set(artists))[:5],
            'mentioned_artworks': list(set(artworks))[:5],
            'price_impact': round(price_impact, 2)
        }

# Initialize analyzer
analyzer = SimpleSentimentAnalyzer()

# Mock news database (in production, use real DB)
news_database = []

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "media-hub"}

@app.post("/api/v1/media/analyze-article", response_model=SentimentResult)
async def analyze_article(article: NewsArticle):
    """
    Analyze sentiment and extract information from news article
    """
    try:
        # Combine title and content
        full_text = f"{article.title} {article.content}"
        
        # Analyze sentiment
        result = analyzer.analyze(full_text)
        
        # Generate article ID
        article_id = f"article-{len(news_database) + 1}"
        
        # Store in database
        article_data = {
            "id": article_id,
            "title": article.title,
            "source": article.source_name,
            "published_at": article.published_at or datetime.now(),
            **result
        }
        news_database.append(article_data)
        
        return SentimentResult(
            article_id=article_id,
            **result
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/media/analyze-impact")
async def analyze_media_impact(artwork_id: str, artist_name: Optional[str] = None):
    """
    Analyze cumulative media impact on artwork pricing
    """
    try:
        # Filter articles mentioning the artwork or artist
        relevant_articles = []
        
        for article in news_database:
            if artist_name and artist_name.lower() in [a.lower() for a in article.get('mentioned_artists', [])]:
                relevant_articles.append(article)
        
        if not relevant_articles:
            # Return default analysis
            return MediaImpactAnalysis(
                artwork_id=artwork_id,
                total_mentions=0,
                avg_sentiment=0.0,
                predicted_price_change=0.0,
                confidence=0.0,
                top_articles=[]
            )
        
        # Calculate aggregated metrics
        total_mentions = len(relevant_articles)
        avg_sentiment = sum(a['sentiment_score'] for a in relevant_articles) / total_mentions
        avg_impact = sum(a['price_impact'] for a in relevant_articles) / total_mentions
        
        # Weight by recency (more recent = higher weight)
        now = datetime.now()
        weighted_impact = 0
        total_weight = 0
        
        for article in relevant_articles:
            pub_date = article['published_at']
            if isinstance(pub_date, str):
                pub_date = datetime.fromisoformat(pub_date)
            
            days_ago = (now - pub_date).days
            weight = 1.0 / (1 + days_ago / 30)  # Decay over 30 days
            
            weighted_impact += article['price_impact'] * weight
            total_weight += weight
        
        predicted_change = weighted_impact / total_weight if total_weight > 0 else 0
        confidence = min(1.0, total_mentions / 10)
        
        # Sort by recency
        top_articles = sorted(
            relevant_articles,
            key=lambda x: x['published_at'],
            reverse=True
        )[:5]
        
        return MediaImpactAnalysis(
            artwork_id=artwork_id,
            total_mentions=total_mentions,
            avg_sentiment=round(avg_sentiment, 3),
            predicted_price_change=round(predicted_change, 2),
            confidence=round(confidence, 3),
            top_articles=[
                {
                    "id": a['id'],
                    "title": a['title'],
                    "sentiment": a['sentiment_label'],
                    "impact": a['price_impact']
                }
                for a in top_articles
            ]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/media/articles")
async def get_recent_articles(limit: int = 10):
    """
    Get recent analyzed articles
    """
    recent = sorted(
        news_database,
        key=lambda x: x['published_at'],
        reverse=True
    )[:limit]
    
    return {"articles": recent, "total": len(news_database)}

@app.post("/api/v1/media/fetch-news")
async def fetch_news_from_sources(query: str, sources: Optional[List[str]] = None):
    """
    Fetch and analyze news from external sources
    In production: integrate with NewsAPI, Google News, etc.
    """
    # Mock implementation
    mock_articles = [
        {
            "title": f"Art Market Trends: {query} Shows Strong Performance",
            "content": f"Recent sales of {query} have exceeded expectations, with collectors showing increased interest. The artwork has been exhibited at prestigious galleries, and experts predict continued growth in value.",
            "source_url": "https://example.com/art-news/1",
            "source_name": "Art Market News",
            "published_at": datetime.now().isoformat()
        },
        {
            "title": f"Exhibition Featuring {query} Opens to Acclaim",
            "content": f"A new exhibition showcasing {query} has opened, attracting significant attention from collectors and critics alike. The beautiful presentation highlights the exceptional quality of the work.",
            "source_url": "https://example.com/art-news/2",
            "source_name": "Gallery Times",
            "published_at": datetime.now().isoformat()
        }
    ]
    
    results = []
    for article_data in mock_articles:
        article = NewsArticle(**article_data)
        result = await analyze_article(article)
        results.append(result)
    
    return {
        "query": query,
        "articles_analyzed": len(results),
        "results": results
    }

@app.post("/api/v1/media/create-neo4j-relationships")
async def create_neo4j_relationships(article_id: str):
    """
    Create Neo4j MENTIONS relationships
    Connects MediaItem nodes to Asset and Person nodes
    """
    try:
        # Find article
        article = next((a for a in news_database if a['id'] == article_id), None)
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        # Generate Cypher queries
        cypher_statements = []
        
        # Create MediaItem node
        cypher_statements.append(f"""
CREATE (m:MediaItem {{
  id: '{article_id}',
  title: '{article['title']}',
  source: '{article['source']}',
  published_at: datetime('{article['published_at'].isoformat()}'),
  sentiment_score: {article['sentiment_score']},
  price_impact: {article['price_impact']}
}});
""")
        
        # Create MENTIONS relationships to artists
        for artist in article.get('mentioned_artists', []):
            cypher_statements.append(f"""
MATCH (m:MediaItem {{id: '{article_id}'}}), (p:Person {{full_name: '{artist}'}})
CREATE (m)-[:MENTIONS {{context: 'artist', sentiment: '{article['sentiment_label']}'}}]->(p);
""")
        
        # Create MENTIONS relationships to artworks
        for artwork in article.get('mentioned_artworks', []):
            cypher_statements.append(f"""
MATCH (m:MediaItem {{id: '{article_id}'}}), (a:Asset {{title: '{artwork}'}})
CREATE (m)-[:MENTIONS {{context: 'artwork', sentiment: '{article['sentiment_label']}'}}]->(a);
""")
        
        return {
            "article_id": article_id,
            "cypher_statements": cypher_statements,
            "relationships_created": len(cypher_statements) - 1
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8003))
    uvicorn.run(app, host="0.0.0.0", port=port)
