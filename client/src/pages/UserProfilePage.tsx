import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, MapPin, Calendar, Award, Package,
  Heart, Eye, Edit2, Save, X, Camera, ExternalLink,
  Instagram, Twitter, Globe, Star, TrendingUp
} from 'lucide-react';
import { useAuth } from '../_core/hooks/useAuth';
import { trpc } from '../lib/trpc';

export default function UserProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    instagram: user?.socialMedia?.instagram || '',
    twitter: user?.socialMedia?.twitter || '',
  });

  // Fetch user's artworks
  const { data: artworks = [] } = trpc.artwork.getMyArtworks.useQuery({});

  // Calculate stats
  const totalArtworks = artworks.length;
  const soldArtworks = artworks.filter((a: any) => a.status === 'sold').length;
  const totalViews = artworks.reduce((sum: number, a: any) => sum + (a.views || 0), 0);
  const totalLikes = artworks.reduce((sum: number, a: any) => sum + (a.likes || 0), 0);

  const handleSave = async () => {
    // TODO: Call API to update profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      instagram: user?.socialMedia?.instagram || '',
      twitter: user?.socialMedia?.twitter || '',
    });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Artworks', value: totalArtworks, icon: Package, color: 'from-blue-500 to-indigo-500' },
    { label: 'Sold', value: soldArtworks, icon: Star, color: 'from-green-500 to-emerald-500' },
    { label: 'Views', value: totalViews, icon: Eye, color: 'from-purple-500 to-pink-500' },
    { label: 'Likes', value: totalLikes, icon: Heart, color: 'from-red-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} />
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start gap-6 -mt-20 relative">
              {/* Avatar */}
              <div className="relative">
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-xl border-4 border-white">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-2 right-2 p-2 bg-white rounded-lg shadow-lg"
                  >
                    <Camera className="w-5 h-5 text-gray-700" />
                  </motion.button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 mt-6 md:mt-16">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {user?.email}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSave}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                        >
                          <Save className="w-5 h-5" />
                          Save
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600"
                        >
                          <X className="w-5 h-5" />
                          Cancel
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                      >
                        <Edit2 className="w-5 h-5" />
                        Edit Profile
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-600">
                      {user?.bio || 'No bio yet. Click Edit Profile to add one!'}
                    </p>
                  )}
                </div>

                {/* Location & Website */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  {isEditing ? (
                    <>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="Location"
                          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="Website"
                          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {user?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {user.location}
                        </span>
                      )}
                      {user?.website && (
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                        >
                          <Globe className="w-4 h-4" />
                          Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4 mt-4">
                  {isEditing ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Instagram className="w-5 h-5 text-pink-600" />
                        <input
                          type="text"
                          value={formData.instagram}
                          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                          placeholder="Instagram username"
                          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Twitter className="w-5 h-5 text-blue-400" />
                        <input
                          type="text"
                          value={formData.twitter}
                          onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                          placeholder="Twitter handle"
                          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {user?.socialMedia?.instagram && (
                        <a
                          href={`https://instagram.com/${user.socialMedia.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-pink-600 hover:text-pink-700"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                      {user?.socialMedia?.twitter && (
                        <a
                          href={`https://twitter.com/${user.socialMedia.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-500"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-700 font-semibold">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {[
              { action: 'Submitted', item: 'Abstract Composition', time: '2 hours ago', icon: Package },
              { action: 'Liked', item: 'Sunset Landscape', time: '5 hours ago', icon: Heart },
              { action: 'Sold', item: 'Modern Portrait', time: '1 day ago', icon: TrendingUp },
              { action: 'Updated', item: 'Gallery Collection', time: '2 days ago', icon: Edit2 },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-100">
                  <activity.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">
                    <span className="font-semibold">{activity.action}</span> {activity.item}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
