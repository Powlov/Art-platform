import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Settings, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useLocation } from 'wouter';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

interface UserProfileProps {
  params?: { username: string };
}

export default function UserProfile({ params }: UserProfileProps) {
  const username = params?.username;
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    showName: true,
    showAvatar: true,
    showBio: true,
    showCollection: true,
    showBlog: true,
    allowMessages: true,
  });

  useEffect(() => {
    // Mock user data
    const mockUser = {
      id: 1,
      username: username || 'artist_john',
      name: 'John Smith',
      avatar: '👨‍🎨',
      bio: 'Contemporary artist focusing on abstract art',
      role: 'artist',
      followers: 1250,
      collection: [
        { id: 1, title: 'Sunset Dreams', price: 5000, image: '🎨' },
        { id: 2, title: 'Urban Landscape', price: 3500, image: '🏙️' },
        { id: 3, title: 'Nature\'s Whisper', price: 4200, image: '🌿' },
      ],
      blogPosts: [
        { id: 1, title: 'My Creative Journey', content: 'Started painting at age 5...', date: new Date() },
        { id: 2, title: 'Inspiration from Nature', content: 'Nature has always been...', date: new Date() },
      ],
      stats: {
        totalWorks: 45,
        totalSales: 32,
        totalRevenue: 125000,
        priceGrowth: '+45%',
      },
    };

    setUser(mockUser);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    setIsOwnProfile(currentUser.username === username);
  }, [username]);

  const handleSendMessage = () => {
    setLocation(`/messenger?user=${user?.username}`);
  };

  const handleSavePrivacySettings = () => {
    toast.success('Privacy settings saved');
    setShowPrivacySettings(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
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
        <h1 className="text-2xl font-bold flex-1">Profile</h1>
        {isOwnProfile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPrivacySettings(!showPrivacySettings)}
            className="flex items-center gap-2"
          >
            <Settings size={18} />
            Privacy
          </Button>
        )}
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Privacy Settings Modal */}
        {showPrivacySettings && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'showName', label: 'Show Name' },
                { key: 'showAvatar', label: 'Show Avatar' },
                { key: 'showBio', label: 'Show Bio' },
                { key: 'showCollection', label: 'Show Collection' },
                { key: 'showBlog', label: 'Show Blog' },
                { key: 'allowMessages', label: 'Allow Messages' },
              ].map((setting) => (
                <label key={setting.key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings[setting.key as keyof typeof privacySettings]}
                    onChange={(e) =>
                      setPrivacySettings({
                        ...privacySettings,
                        [setting.key]: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span>{setting.label}</span>
                </label>
              ))}
              <Button
                onClick={handleSavePrivacySettings}
                className="w-full mt-4"
              >
                Save Settings
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="text-6xl">{user.avatar}</div>
              <div className="flex-1">
                {privacySettings.showName && (
                  <>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-gray-500">@{user.username}</p>
                  </>
                )}
                {privacySettings.showBio && (
                  <p className="text-gray-700 mt-2">{user.bio}</p>
                )}
                <div className="flex gap-4 mt-4 text-sm">
                  <div>
                    <span className="font-bold">{user.followers}</span>
                    <span className="text-gray-500"> Followers</span>
                  </div>
                  <div>
                    <span className="font-bold">{user.stats.totalWorks}</span>
                    <span className="text-gray-500"> Works</span>
                  </div>
                  <div>
                    <span className="font-bold">{user.stats.totalSales}</span>
                    <span className="text-gray-500"> Sales</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!privacySettings.allowMessages}
                  className="flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  Message
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Heart size={18} />
                  Follow
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 size={18} />
                </Button>
              </div>
            </div>

            {/* QR Code */}
            <div className="mt-6 flex justify-center">
              <div className="bg-white p-4 border rounded-lg">
                <QRCode
                  value={`https://artbank.market/user/${user.username}`}
                  size={150}
                  level="H"
                />
                <p className="text-center text-xs text-gray-500 mt-2">Scan to view profile</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {privacySettings.showCollection && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Collection Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">${user.stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user.stats.priceGrowth}</p>
                  <p className="text-sm text-gray-500">Price Growth</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user.stats.totalWorks}</p>
                  <p className="text-sm text-gray-500">Total Works</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user.stats.totalSales}</p>
                  <p className="text-sm text-gray-500">Sold</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Collection */}
        {privacySettings.showCollection && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {user.collection.map((artwork: any) => (
                  <Card key={artwork.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="text-4xl text-center mb-4">{artwork.image}</div>
                      <h3 className="font-bold">{artwork.title}</h3>
                      <p className="text-sm text-gray-500">${artwork.price.toLocaleString()}</p>
                      <Button className="w-full mt-4" size="sm">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blog Posts */}
        {privacySettings.showBlog && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.blogPosts.map((post: any) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <p className="text-gray-600 mt-2">{post.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {post.date.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
