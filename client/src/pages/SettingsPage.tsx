import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Bell, Lock, User, Mail, Eye, Shield,
  Globe, Palette, Moon, Sun, Monitor, Check, Save,
  Smartphone, Volume2, VolumeX, Database, Download
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: true,
    auctionAlerts: true,
    bidNotifications: true,
    moderationUpdates: true,
    marketingEmails: false,

    // Privacy
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true,
    allowMessages: true,

    // Display
    theme: 'system',
    language: 'en',
    timezone: 'UTC',

    // Account
    twoFactorAuth: false,
    loginAlerts: true,
  });

  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'display' | 'account'>('notifications');

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSave = () => {
    // TODO: Save to backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'account', label: 'Account', icon: Shield },
  ];

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account preferences</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
                    <p className="text-gray-600 mb-6">Choose how you want to be notified about updates</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive updates via email</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={settings.emailNotifications}
                        onChange={() => handleToggle('emailNotifications')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Push Notifications</p>
                          <p className="text-sm text-gray-600">Browser notifications for real-time updates</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={settings.pushNotifications}
                        onChange={() => handleToggle('pushNotifications')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {settings.soundNotifications ? (
                          <Volume2 className="w-5 h-5 text-gray-600" />
                        ) : (
                          <VolumeX className="w-5 h-5 text-gray-600" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">Sound Notifications</p>
                          <p className="text-sm text-gray-600">Play sound for new notifications</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={settings.soundNotifications}
                        onChange={() => handleToggle('soundNotifications')}
                      />
                    </div>

                    <hr className="my-6" />

                    <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Types</h3>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">Auction Alerts</p>
                        <p className="text-sm text-gray-600">When auctions you're watching are about to end</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.auctionAlerts}
                        onChange={() => handleToggle('auctionAlerts')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">Bid Notifications</p>
                        <p className="text-sm text-gray-600">When someone outbids you</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.bidNotifications}
                        onChange={() => handleToggle('bidNotifications')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">Moderation Updates</p>
                        <p className="text-sm text-gray-600">When your artworks are reviewed</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.moderationUpdates}
                        onChange={() => handleToggle('moderationUpdates')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">Marketing Emails</p>
                        <p className="text-sm text-gray-600">News, tips, and featured artworks</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.marketingEmails}
                        onChange={() => handleToggle('marketingEmails')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Settings</h2>
                    <p className="text-gray-600 mb-6">Control who can see your information</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block font-semibold text-gray-900 mb-2">Profile Visibility</label>
                      <select
                        value={settings.profileVisibility}
                        onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="public">Public - Anyone can see</option>
                        <option value="members">Members Only</option>
                        <option value="private">Private - Only me</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Show Email Address</p>
                          <p className="text-sm text-gray-600">Display your email on your profile</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={settings.showEmail}
                        onChange={() => handleToggle('showEmail')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Show Activity</p>
                          <p className="text-sm text-gray-600">Display your recent activity publicly</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={settings.showActivity}
                        onChange={() => handleToggle('showActivity')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Allow Direct Messages</p>
                          <p className="text-sm text-gray-600">Let other users message you</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={settings.allowMessages}
                        onChange={() => handleToggle('allowMessages')}
                      />
                    </div>

                    <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                      <h3 className="font-bold text-red-900 mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-700 mb-4">Irreversible actions</p>
                      <div className="space-y-2">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Delete All My Data
                        </button>
                        <button className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          Deactivate Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Display Tab */}
              {activeTab === 'display' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Display Settings</h2>
                    <p className="text-gray-600 mb-6">Customize how the platform looks</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block font-semibold text-gray-900 mb-3">Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'light', icon: Sun, label: 'Light' },
                          { value: 'dark', icon: Moon, label: 'Dark' },
                          { value: 'system', icon: Monitor, label: 'System' },
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => setSettings({ ...settings, theme: theme.value })}
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                              settings.theme === theme.value
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <theme.icon className="w-6 h-6" />
                            <span className="text-sm font-medium">{theme.label}</span>
                            {settings.theme === theme.value && (
                              <Check className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block font-semibold text-gray-900 mb-2">Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block font-semibold text-gray-900 mb-2">Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Moscow">Moscow (MSK)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Security</h2>
                    <p className="text-gray-600 mb-6">Keep your account safe and secure</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Add an extra layer of security</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={settings.twoFactorAuth}
                        onChange={() => handleToggle('twoFactorAuth')}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Login Alerts</p>
                          <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={settings.loginAlerts}
                        onChange={() => handleToggle('loginAlerts')}
                      />
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Change Password</h3>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Update Password
                      </button>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Active Sessions</h3>
                      <p className="text-sm text-gray-600 mb-4">Manage devices where you're logged in</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Current Session</p>
                            <p className="text-sm text-gray-500">Chrome on Windows • Active now</p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <Database className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">Export Your Data</h3>
                      </div>
                      <p className="text-sm text-blue-700 mb-4">
                        Download a copy of your information
                      </p>
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="w-4 h-4" />
                        Request Data Export
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Changes will be saved across all your devices
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
