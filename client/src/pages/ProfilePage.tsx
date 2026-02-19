import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Lock, User, Heart, TrendingUp, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import QRCode from 'react-qr-code';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    messageNotifications: true,
    auctionNotifications: true,
    newsNotifications: true,
    priceAlerts: true,
  });
  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    showCollection: true,
    showActivity: true,
    allowMessages: true,
    allowFollowing: true,
  });

  useEffect(() => {
    // Load user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const mockUserData = {
      ...storedUser,
      avatar: '👨‍🎨',
      bio: 'Contemporary artist focusing on abstract art',
      followers: 1250,
      following: 342,
      collection: [
        { id: 1, title: 'Sunset Dreams', price: 5000 },
        { id: 2, title: 'Urban Landscape', price: 3500 },
        { id: 3, title: 'Nature\'s Whisper', price: 4200 },
      ],
      stats: {
        totalWorks: 45,
        totalSales: 32,
        totalRevenue: 125000,
        priceGrowth: '+45%',
        joinDate: '2023-01-15',
      },
      activity: [
        { id: 1, action: 'Sold artwork', item: 'Sunset Dreams', date: new Date(Date.now() - 86400000) },
        { id: 2, action: 'Listed artwork', item: 'Urban Landscape', date: new Date(Date.now() - 172800000) },
        { id: 3, action: 'Gained follower', item: 'Jane Collector', date: new Date(Date.now() - 259200000) },
      ],
    };

    setUser(mockUserData);
    setEditData(mockUserData);
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('user', JSON.stringify(editData));
    setUser(editData);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleEditChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleNotificationChange = (key: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key as keyof typeof notificationSettings],
    });
    toast.success('Notification settings updated');
  };

  const handlePrivacyChange = (key: string) => {
    setPrivacySettings({
      ...privacySettings,
      [key]: !privacySettings[key as keyof typeof privacySettings],
    });
    toast.success('Privacy settings updated');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6 mb-6">
              <div className="text-6xl">{user.avatar}</div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Full Name</label>
                      <Input
                        value={editData.name}
                        onChange={(e) => handleEditChange('name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Username</label>
                      <Input
                        value={editData.username}
                        onChange={(e) => handleEditChange('username', e.target.value)}
                        className="mt-1"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Bio</label>
                      <Input
                        value={editData.bio}
                        onChange={(e) => handleEditChange('bio', e.target.value)}
                        className="mt-1"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                        <Save size={18} />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditData(user);
                        }}
                        className="flex items-center gap-2"
                      >
                        <X size={18} />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        <p className="text-gray-500">@{user.username}</p>
                        <p className="text-gray-600 text-sm mt-2">{user.bio}</p>
                      </div>
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit2 size={18} />
                        Edit Profile
                      </Button>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="font-bold">{user.followers}</span>
                        <span className="text-gray-500"> Followers</span>
                      </div>
                      <div>
                        <span className="font-bold">{user.following}</span>
                        <span className="text-gray-500"> Following</span>
                      </div>
                      <div>
                        <span className="font-bold capitalize">{user.role}</span>
                        <span className="text-gray-500"> Role</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="bg-white p-3 border rounded-lg">
                  <QRCode
                    value={`https://artbank.market/user/${user.username}`}
                    size={120}
                    level="H"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Scan to view profile</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold">{user.stats.totalWorks}</p>
                <p className="text-sm text-gray-500">Total Works</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{user.stats.totalSales}</p>
                <p className="text-sm text-gray-500">Sold</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">${(user.stats.totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-gray-500">Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{user.stats.priceGrowth}</p>
                <p className="text-sm text-gray-500">Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="collection" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* Collection Tab */}
          <TabsContent value="collection">
            <Card>
              <CardHeader>
                <CardTitle>My Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {user.collection.map((artwork: any) => (
                    <Card key={artwork.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="text-4xl text-center mb-4">🎨</div>
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
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.activity.map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.item}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {activity.date.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell size={20} />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'messageNotifications', label: 'Message Notifications', desc: 'Get notified of new messages' },
                  { key: 'auctionNotifications', label: 'Auction Notifications', desc: 'Updates on auction activities' },
                  { key: 'newsNotifications', label: 'News Notifications', desc: 'Latest art market news' },
                  { key: 'priceAlerts', label: 'Price Alerts', desc: 'Alerts when artwork prices change' },
                ].map((setting) => (
                  <label key={setting.key} className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                      onChange={() => handleNotificationChange(setting.key)}
                      className="w-4 h-4 mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{setting.label}</p>
                      <p className="text-xs text-gray-500">{setting.desc}</p>
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock size={20} />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'showProfile', label: 'Show Profile', desc: 'Make your profile visible to others' },
                  { key: 'showCollection', label: 'Show Collection', desc: 'Display your artwork collection' },
                  { key: 'showActivity', label: 'Show Activity', desc: 'Show your recent activity' },
                  { key: 'allowMessages', label: 'Allow Messages', desc: 'Let others send you messages' },
                  { key: 'allowFollowing', label: 'Allow Following', desc: 'Allow others to follow you' },
                ].map((setting) => (
                  <label key={setting.key} className="flex items-start gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={privacySettings[setting.key as keyof typeof privacySettings]}
                      onChange={() => handlePrivacyChange(setting.key)}
                      className="w-4 h-4 mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{setting.label}</p>
                      <p className="text-xs text-gray-500">{setting.desc}</p>
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
