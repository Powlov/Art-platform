import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, Share2, ShoppingCart, TrendingUp } from 'lucide-react';
import { useLocation } from 'wouter';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

interface ArtworkDetailProps {
  params?: { id: string };
}

export default function ArtworkDetail({ params }: ArtworkDetailProps) {
  const artworkId = params?.id;
  const [, setLocation] = useLocation();
  const [artwork, setArtwork] = useState<any>(null);
  const [artist, setArtist] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);

  useEffect(() => {
    // Mock artwork data
    const mockArtwork = {
      id: 1,
      title: 'Sunset Dreams',
      artist: 'John Smith',
      artistUsername: 'artist_john',
      description: 'A stunning abstract piece capturing the essence of a sunset over the ocean.',
      image: '🎨',
      dimensions: '120 x 80 cm',
      genre: 'Abstract',
      year: 2023,
      technique: 'Oil on Canvas',
      basePrice: 5000,
      currentPrice: 7500,
      priceHistory: [
        { date: '2023-01', price: 5000 },
        { date: '2023-06', price: 5500 },
        { date: '2024-01', price: 6500 },
        { date: '2024-11', price: 7500 },
      ],
      blockchainVerified: true,
      blockchainHash: '0x7f3e4a1b2c9d5e8f',
      provenance: [
        { date: '2023-01-15', owner: 'John Smith (Artist)', action: 'Created' },
        { date: '2023-06-20', owner: 'Gallery XYZ', action: 'Acquired' },
        { date: '2024-01-10', owner: 'Jane Collector', action: 'Purchased' },
      ],
      mlFactors: {
        artistReputation: 85,
        marketDemand: 90,
        rarity: 88,
        condition: 95,
        provenance: 92,
        size: 78,
        technique: 82,
        yearCreated: 80,
        genrePopularity: 87,
      },
      cascadeEffect: {
        description: 'Price increase driven by artist reputation growth and market demand',
        impact: '+50%',
      },
    };

    const mockArtist = {
      id: 1,
      name: 'John Smith',
      username: 'artist_john',
      avatar: '👨‍🎨',
      bio: 'Contemporary artist focusing on abstract art',
      followers: 1250,
      totalWorks: 45,
      totalSales: 32,
      totalRevenue: 125000,
      priceGrowth: '+45%',
    };

    const mockNews = [
      { id: 1, title: 'Artist John Smith wins international award', date: new Date(Date.now() - 86400000) },
      { id: 2, title: 'Abstract art market surges 30% this year', date: new Date(Date.now() - 172800000) },
      { id: 3, title: 'Collector Jane acquires rare masterpiece', date: new Date(Date.now() - 259200000) },
    ];

    setArtwork(mockArtwork);
    setArtist(mockArtist);
    setRelatedNews(mockNews);
  }, [artworkId]);

  const handleBuy = () => {
    toast.success('Added to cart');
  };

  const handleAddToWishlist = () => {
    toast.success('Added to wishlist');
  };

  if (!artwork) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading artwork...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back
        </Button>
        <h1 className="text-2xl font-bold flex-1">Artwork Details</h1>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Image */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-9xl mb-4">{artwork.image}</div>
                <p className="text-sm text-gray-500 mb-4">ID: {artwork.id}</p>

                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 border rounded-lg">
                    <QRCode
                      value={`https://artbank.market/artwork/${artwork.id}`}
                      size={120}
                      level="H"
                    />
                    <p className="text-center text-xs text-gray-500 mt-2">Scan to view</p>
                  </div>
                </div>

                {/* Blockchain Verification */}
                {artwork.blockchainVerified && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                    <p className="font-bold text-green-700">✓ Blockchain Verified</p>
                    <p className="text-xs text-green-600 mt-1 break-all">{artwork.blockchainHash}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="space-y-4">
            {/* Title & Artist */}
            <Card>
              <CardContent className="pt-6">
                <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
                <p
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => setLocation(`/user/${artist.username}`)}
                >
                  by {artwork.artist}
                </p>
                <p className="text-gray-600 mt-4">{artwork.description}</p>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                  <div>
                    <p className="text-gray-500">Dimensions</p>
                    <p className="font-bold">{artwork.dimensions}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Genre</p>
                    <p
                      className="font-bold text-blue-600 cursor-pointer hover:underline"
                      onClick={() => setLocation(`/genre/${artwork.genre}`)}
                    >
                      {artwork.genre}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Year</p>
                    <p className="font-bold">{artwork.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Technique</p>
                    <p className="font-bold">{artwork.technique}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm">Current Price</p>
                <p className="text-4xl font-bold text-blue-600">${artwork.currentPrice.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">Base Price: ${artwork.basePrice.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">
                  ↑ {(((artwork.currentPrice - artwork.basePrice) / artwork.basePrice) * 100).toFixed(1)}% increase
                </p>

                {/* Buttons */}
                <div className="flex gap-2 mt-6">
                  <Button onClick={handleBuy} className="flex-1 flex items-center justify-center gap-2">
                    <ShoppingCart size={18} />
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddToWishlist}
                    className="flex items-center justify-center gap-2"
                  >
                    <Heart size={18} />
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <Share2 size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Artist Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About the Artist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <div className="text-5xl">{artist.avatar}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{artist.name}</h3>
                <p className="text-gray-500">@{artist.username}</p>
                <p className="text-gray-700 mt-2">{artist.bio}</p>
                <div className="flex gap-6 mt-4 text-sm">
                  <div>
                    <span className="font-bold">{artist.followers}</span>
                    <span className="text-gray-500"> Followers</span>
                  </div>
                  <div>
                    <span className="font-bold">{artist.totalWorks}</span>
                    <span className="text-gray-500"> Works</span>
                  </div>
                  <div>
                    <span className="font-bold">{artist.priceGrowth}</span>
                    <span className="text-gray-500"> Growth</span>
                  </div>
                </div>
                <Button
                  className="mt-4"
                  onClick={() => setLocation(`/user/${artist.username}`)}
                >
                  View Artist Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price History */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Price History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {artwork.priceHistory.map((point: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{point.date}</span>
                  <span className="font-bold">${point.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ML Pricing Factors */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ML Pricing Factors (9 Factors)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(artwork.mlFactors).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 capitalize">{String(key).replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-2xl font-bold text-blue-600">{String(value)}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${String(value)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cascade Effect */}
        <Card className="mb-6 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle>Cascade Effect</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{artwork.cascadeEffect.description}</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">{artwork.cascadeEffect.impact}</p>
          </CardContent>
        </Card>

        {/* Provenance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Provenance (Ownership History)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {artwork.provenance.map((entry: any, idx: number) => (
                <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="text-sm text-gray-500 min-w-fit">{entry.date}</div>
                  <div>
                    <p className="font-bold">{entry.owner}</p>
                    <p className="text-sm text-gray-600">{entry.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related News */}
        <Card>
          <CardHeader>
            <CardTitle>Related News</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {relatedNews.map((news) => (
              <Card key={news.id}>
                <CardContent className="pt-6">
                  <h3 className="font-bold">{news.title}</h3>
                  <p className="text-xs text-gray-400 mt-2">
                    {news.date.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
