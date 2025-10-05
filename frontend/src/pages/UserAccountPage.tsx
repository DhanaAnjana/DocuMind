// src/pages/UserAccountPage.tsx
import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Mail, Lock, Check, Upload, Shield, CreditCard } from 'lucide-react';

const UserAccountPage = () => {
  const { user, updateUserProfile } = useAuthContext();
  const { currentTheme } = useTheme();
  const isDarkMode = currentTheme.id === 'dark';
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = () => {
    updateUserProfile({ name: formData.name, email: formData.email });
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handlePasswordChange = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters!' });
      return;
    }

    setMessage({ type: 'success', text: 'Password changed successfully!' });
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const usageData = [
    { label: 'Document Storage', used: 42, total: 100, unit: 'GB', color: 'from-primary to-secondary' },
    { label: 'Pages Processed', used: 1850, total: 5000, unit: '', color: 'from-secondary to-accent' },
    { label: 'Questions Asked', used: 234, total: 1000, unit: '', color: 'from-accent to-secondary' },
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-text-primary'}`}>
            Account Settings
          </h1>
          <p className="text-text-muted mt-1">Manage your profile and preferences</p>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-medium shadow-soft">
          {user?.role} Plan
        </div>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`p-4 rounded-xl border-2 flex items-center space-x-3 animate-in slide-in-from-top-2 duration-300 ${
          message.type === 'success' 
            ? 'bg-success/10 border-success/30 text-success' 
            : 'bg-error/10 border-error/30 text-error'
        }`}>
          {message.type === 'success' && <Check className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className={`rounded-2xl shadow-soft border p-2 ${
        isDarkMode ? 'bg-surface border-surface-muted' : 'bg-white border-border'
      }`}>
        <div className="flex space-x-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-medium'
                    : isDarkMode
                      ? 'text-text-muted hover:bg-surface-muted/30 hover:text-white'
                      : 'text-text-secondary hover:bg-surface-muted/50 hover:text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className={`rounded-2xl shadow-soft border p-8 ${
              isDarkMode ? 'bg-surface border-surface-muted' : 'bg-white border-border'
            }`}>
              <h2 className={`text-xl font-semibold mb-6 ${
                isDarkMode ? 'text-white' : 'text-text-primary'
              }`}>Profile Information</h2>
              
              {/* Avatar Section */}
              <div className={`flex items-center space-x-6 mb-8 pb-8 border-b ${
                isDarkMode ? 'border-surface-muted' : 'border-border'
              }`}>
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-3xl font-bold shadow-medium group-hover:shadow-large transition-all duration-200">
                    {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-text-primary'
                  }`}>{formData.name}</h3>
                  <p className="text-sm text-text-muted">{formData.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-accent/10 text-accent rounded-lg text-xs font-medium">
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div>
                  <label className={`flex items-center space-x-2 text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-text-primary'
                  }`}>
                    <User className="w-4 h-4" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    title="Full Name"
                    className={`w-full px-4 py-3 border border-transparent rounded-xl 
                             focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 
                             transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-surface-muted/30 text-white placeholder:text-text-muted focus:bg-surface-muted'
                        : 'bg-surface-muted/30 text-text-primary placeholder:text-text-muted focus:bg-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`flex items-center space-x-2 text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-text-primary'
                  }`}>
                    <Mail className="w-4 h-4" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    title="Email Address"
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3 border border-transparent rounded-xl 
                             focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 
                             transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-surface-muted/30 text-white placeholder:text-text-muted focus:bg-surface-muted'
                        : 'bg-surface-muted/30 text-text-primary placeholder:text-text-muted focus:bg-white'
                    }`}
                  />
                </div>

                <button
                  onClick={handleProfileUpdate}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl 
                           font-medium shadow-medium hover:shadow-large transition-all duration-200 hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Statistics Card */}
            <div className={`rounded-2xl shadow-soft border p-8 ${
              isDarkMode ? 'bg-surface border-surface-muted' : 'bg-white border-border'
            }`}>
              <h2 className={`text-xl font-semibold mb-6 ${
                isDarkMode ? 'text-white' : 'text-text-primary'
              }`}>Account Statistics</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-text-muted">Member Since</p>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-text-primary'
                  }`}>Jan 2024</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-text-muted">Total Documents</p>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-text-primary'
                  }`}>142</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-text-muted">Questions Asked</p>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-text-primary'
                  }`}>234</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-text-muted">Storage Used</p>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-text-primary'
                  }`}>4.2 GB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className={`rounded-2xl p-6 border ${
              isDarkMode 
                ? 'bg-surface-muted/20 border-surface-muted' 
                : 'bg-gradient-to-br from-accent/10 to-secondary/10 border-accent/20'
            }`}>
              <h3 className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-text-primary'
              }`}>Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    isDarkMode ? 'text-text-muted' : 'text-text-secondary'
                  }`}>Active Sessions</span>
                  <span className="font-bold text-primary">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    isDarkMode ? 'text-text-muted' : 'text-text-secondary'
                  }`}>Last Login</span>
                  <span className="font-bold text-primary">Today</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    isDarkMode ? 'text-text-muted' : 'text-text-secondary'
                  }`}>Account Status</span>
                  <span className="px-2 py-1 bg-success/10 text-success rounded-lg text-xs font-semibold">Active</span>
                </div>
              </div>
            </div>

            {/* Upgrade Card */}
            <div className="bg-gradient-to-br from-secondary to-accent rounded-2xl p-6 text-white shadow-large">
              <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
              <p className="text-sm text-white/80 mb-4">Unlock unlimited documents and advanced features</p>
              <button className="w-full bg-white text-primary px-4 py-2.5 rounded-xl font-semibold hover:bg-white/90 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="max-w-2xl">
          <div className={`rounded-2xl shadow-soft border p-8 ${
            isDarkMode ? 'bg-surface border-surface-muted' : 'bg-white border-border'
          }`}>
            <h2 className={`text-xl font-semibold mb-6 ${
              isDarkMode ? 'text-white' : 'text-text-primary'
            }`}>Change Password</h2>
            
            <div className="space-y-5">
              <div>
                <label className={`flex items-center space-x-2 text-sm font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-text-primary'
                }`}>
                  <Lock className="w-4 h-4" />
                  <span>Current Password</span>
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border border-transparent rounded-xl 
                           focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 
                           transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-surface-muted/30 text-white placeholder:text-text-muted focus:bg-surface-muted'
                      : 'bg-surface-muted/30 text-text-primary placeholder:text-text-muted focus:bg-white'
                  }`}
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className={`flex items-center space-x-2 text-sm font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-text-primary'
                }`}>
                  <Lock className="w-4 h-4" />
                  <span>New Password</span>
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border border-transparent rounded-xl 
                           focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 
                           transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-surface-muted/30 text-white placeholder:text-text-muted focus:bg-surface-muted'
                      : 'bg-surface-muted/30 text-text-primary placeholder:text-text-muted focus:bg-white'
                  }`}
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className={`flex items-center space-x-2 text-sm font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-text-primary'
                }`}>
                  <Lock className="w-4 h-4" />
                  <span>Confirm New Password</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border border-transparent rounded-xl 
                           focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 
                           transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-surface-muted/30 text-white placeholder:text-text-muted focus:bg-surface-muted'
                      : 'bg-surface-muted/30 text-text-primary placeholder:text-text-muted focus:bg-white'
                  }`}
                  placeholder="Confirm new password"
                />
              </div>

              <button
                onClick={handlePasswordChange}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl 
                         font-medium shadow-medium hover:shadow-large transition-all duration-200 hover:scale-105"
              >
                Update Password
              </button>
            </div>
          </div>

          <div className={`rounded-2xl shadow-soft border p-8 mt-6 ${
            isDarkMode ? 'bg-surface border-surface-muted' : 'bg-white border-border'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-text-primary'
            }`}>Two-Factor Authentication</h2>
            <p className="text-text-muted mb-6">Add an extra layer of security to your account</p>
            <button className={`px-6 py-3 rounded-xl font-medium transition-colors border ${
              isDarkMode
                ? 'bg-surface-muted/50 text-white hover:bg-surface-muted border-surface-muted'
                : 'bg-surface-muted/50 text-text-primary hover:bg-surface-muted border-border'
            }`}>
              Enable 2FA
            </button>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className={`rounded-2xl shadow-soft border p-8 ${
              isDarkMode ? 'bg-surface border-surface-muted' : 'bg-white border-border'
            }`}>
              <h2 className={`text-xl font-semibold mb-6 ${
                isDarkMode ? 'text-white' : 'text-text-primary'
              }`}>Usage Statistics</h2>
              
              <div className="space-y-6">
                {usageData.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-text-primary'
                      }`}>{item.label}</span>
                      <span className="text-sm text-text-muted">
                        {item.used} / {item.total} {item.unit}
                      </span>
                    </div>
                    <div className={`relative w-full rounded-full h-3 overflow-hidden ${
                      isDarkMode ? 'bg-surface-muted/50' : 'bg-surface-muted/50'
                    }`}>
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500 shadow-soft`}
                        style={{ width: `${(item.used / item.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-muted">
                      {((item.used / item.total) * 100).toFixed(0)}% used
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className={`rounded-2xl shadow-soft border p-6 ${
              isDarkMode ? 'bg-surface border-surface-muted' : 'bg-white border-border'
            }`}>
              <h2 className={`text-lg font-semibold mb-6 ${
                isDarkMode ? 'text-white' : 'text-text-primary'
              }`}>Current Plan</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Plan</span>
                  <span className="font-bold text-primary">Pro</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Billing</span>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-text-primary'
                  }`}>Monthly</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Next Renewal</span>
                  <span className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-text-primary'
                  }`}>Nov 15</span>
                </div>

                <div className={`pt-4 border-t ${
                  isDarkMode ? 'border-surface-muted' : 'border-border'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-text-primary'
                    }`}>Total</span>
                    <span className="text-2xl font-bold text-primary">
                      $29<span className="text-sm text-text-muted">/mo</span>
                    </span>
                  </div>
                </div>
                
                <button className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium shadow-medium hover:shadow-large transition-all duration-200 hover:scale-105">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccountPage;