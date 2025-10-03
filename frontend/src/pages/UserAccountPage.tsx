// pages/UserAccountPage.tsx
import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

const UserAccountPage = () => {
  const { user, updateUserProfile } = useAuthContext();
  
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
    { label: 'Document Storage', used: 42, total: 100, unit: 'GB' },
    { label: 'Pages Processed', used: 1850, total: 5000, unit: '' },
    { label: 'Questions Asked', used: 234, total: 1000, unit: '' },
  ];

  const recentDocuments = [
    { id: '1', name: 'Contract_2024.pdf', uploaded: '2023-10-12' },
    { id: '2', name: 'Invoice_Jan.pdf', uploaded: '2023-10-10' },
    { id: '3', name: 'Report_01.pdf', uploaded: '2023-10-08' },
    { id: '4', name: 'Financial_Report_Q3.pdf', uploaded: '2023-10-05' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'border-b-2 text-gray-800'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'profile' ? { borderColor: '#2c3e50' } : {}}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'security'
                ? 'border-b-2 text-gray-800'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'security' ? { borderColor: '#2c3e50' } : {}}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'usage'
                ? 'border-b-2 text-gray-800'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={activeTab === 'usage' ? { borderColor: '#2c3e50' } : {}}
          >
            Usage & Billing
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: '#ecf0f1', color: '#2c3e50' }}>
                    {formData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{formData.name}</h3>
                    <p className="text-gray-600 text-sm">{formData.email}</p>
                    <p className="text-gray-500 text-xs mt-1">{user?.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3498db';
                        e.target.style.boxShadow = '0 0 0 2px rgba(52, 152, 219, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3498db';
                        e.target.style.boxShadow = '0 0 0 2px rgba(52, 152, 219, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleProfileUpdate}
                  className="text-white px-6 py-2 rounded-lg transition-colors font-medium"
                  style={{ backgroundColor: '#2c3e50' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34495e'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2c3e50'}
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Documents</h2>
              <div className="space-y-2">
                {recentDocuments.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-gray-800">{doc.name}</span>
                    <span className="text-sm text-gray-500">{doc.uploaded}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-800">Jan 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents</span>
                  <span className="font-medium text-gray-800">142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Queries Made</span>
                  <span className="font-medium text-gray-800">234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  placeholder="Enter current password"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3498db';
                    e.target.style.boxShadow = '0 0 0 2px rgba(52, 152, 219, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  placeholder="Enter new password"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3498db';
                    e.target.style.boxShadow = '0 0 0 2px rgba(52, 152, 219, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  placeholder="Confirm new password"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3498db';
                    e.target.style.boxShadow = '0 0 0 2px rgba(52, 152, 219, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                onClick={handlePasswordChange}
                className="text-white px-6 py-2 rounded-lg transition-colors font-medium"
                style={{ backgroundColor: '#2c3e50' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34495e'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2c3e50'}
              >
                Update Password
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Two-Factor Authentication</h2>
            <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
            <button className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              Enable 2FA
            </button>
          </div>
        </div>
      )}
      {activeTab === 'usage' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Usage Statistics</h2>
              
              <div className="space-y-6">
                {usageData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">{item.label}</span>
                      <span className="text-gray-600">
                        {item.used.toLocaleString()} / {item.total.toLocaleString()}{item.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: '#2c3e50',
                          width: `${(item.used / item.total) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((item.used / item.total) * 100)}% used
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Billing Information</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">Pro Plan</h3>
                    <p className="text-sm text-gray-600">$29/month • Next billing: Nov 15, 2023</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs font-bold">••••</span>
                      </div>
                      <span className="text-gray-600">Ending in 4242</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expires
                      </label>
                      <span className="text-gray-600">12/2024</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <span className="text-gray-600">•••</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button className="text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    style={{ backgroundColor: '#2c3e50' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#34495e'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2c3e50'}>
                    Update Payment Method
                  </button>
                  <button className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Plan Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Plan</span>
                  <span className="font-medium text-gray-800">Pro</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Cost</span>
                  <span className="font-medium text-gray-800">$29.00</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Billing Cycle</span>
                  <span className="font-medium text-gray-800">Monthly</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Next Billing</span>
                  <span className="font-medium text-gray-800">Nov 15, 2023</span>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Billing History</h2>
              
              <div className="space-y-3">
                {[
                  { date: 'Oct 15, 2023', amount: '$29.00', status: 'Paid' },
                  { date: 'Sep 15, 2023', amount: '$29.00', status: 'Paid' },
                  { date: 'Aug 15, 2023', amount: '$29.00', status: 'Paid' }
                ].map((invoice, index) => (
                  <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <span className="text-gray-800 block">{invoice.date}</span>
                      <span className="text-sm text-gray-500">{invoice.amount}</span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      {invoice.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccountPage;