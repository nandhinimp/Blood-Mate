import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  User, 
  Edit3, 
  Shield, 
  Clock,
  Droplets,
  Star,
  CheckCircle,
  AlertCircle,
  Gift,
  QrCode,
  Share2,
  Download,
  Eye,
  EyeOff,
  Bell,
  Settings,
  Zap,
  Activity,
  Users,
  Copy
} from 'lucide-react';

export default function BloodMateProfile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrPrivacy, setQrPrivacy] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  // Fetch real donor data
  useEffect(() => {
    const fetchDonor = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      try {
        const res = await fetch(`http://localhost:5000/api/donors/by-uid/${user.uid}`);
        const data = await res.json();
        console.log('Fetched donor data:', data);
        setDonor(data);
        // Initialize edit data with current donor data
        setEditData({
          name: data.name || '',
          age: data.age || '',
          bloodgroup: data.bloodgroup || '',
          city: data.city || ''
        });
      } catch (err) {
        console.error("Failed to fetch donor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonor();
  }, []);

  // Default data structure with real data when available
  const donorData = donor ? {
    id: donor.id || "BM2024-001",
    name: donor.name || "Unknown",
    bloodType: donor.bloodgroup || "Unknown",
    profileImage: "/api/placeholder/150/150",
    location: donor.city || "Unknown",
    phone: "+1 (555) 123-4567",
    email: "donor@email.com",
    dateOfBirth: "1990-03-15",
    weight: "65 kg",
    height: "5'6\"",
    lastDonation: "2024-06-15",
    totalDonations: 12,
    joinDate: "2020-01-15",
    verified: true,
    emergencyAvailable: true,
    qrGenerated: true,
    uniqueQRCode: `https://bloodmate.app/emergency/${donor.id}`,
    emergencyContacts: [
      { name: "Emergency Contact 1", phone: "+1 (555) 987-6543", relationship: "Family", priority: 1 },
      { name: "Emergency Contact 2", phone: "+1 (555) 456-7890", relationship: "Friend", priority: 2 }
    ],
    medicalInfo: {
      allergies: ["None"],
      medications: ["None"],
      conditions: ["None"],
      lastCheckup: "2024-05-20",
      bloodPressure: "120/80",
      hemoglobin: "14.5 g/dL"
    },
    preferences: {
      maxDistance: "25 km",
      availableHours: "9 AM - 6 PM",
      preferredDonationType: ["Whole Blood", "Platelets"],
      emergencyOnly: false
    },
    stats: {
      emergencyResponses: 3,
      livesImpacted: 36,
      responseTime: "< 2 hours",
      reliability: 98
    }
  } : null;

  const emergencyRequests = [
    { 
      id: "ER-001", 
      date: "2024-07-28", 
      location: "Local Hospital", 
      urgency: "Critical", 
      status: "Responded",
      distance: "3.2 km"
    },
    { 
      id: "ER-002", 
      date: "2024-06-15", 
      location: "City Medical Center", 
      urgency: "High", 
      status: "Donated",
      distance: "5.1 km"
    }
  ];

  const recentActivity = [
    { type: "donation", message: "Donated 450ml whole blood at Central Blood Bank", date: "2024-06-15" },
    { type: "emergency", message: "Responded to emergency request", date: "2024-07-28" },
    { type: "profile", message: "Updated emergency contact information", date: "2024-07-20" },
    { type: "qr", message: "QR code accessed 2 times this month", date: "2024-07-15" }
  ];

  const calculateDaysUntilEligible = () => {
    const lastDonation = new Date(donorData?.lastDonation || Date.now());
    const nextEligible = new Date(lastDonation.getTime() + (56 * 24 * 60 * 60 * 1000));
    const today = new Date();
    const diffTime = nextEligible - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) return;

      const response = await fetch(`http://localhost:5000/api/donors/${donor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        // Update local donor data
        setDonor(prev => ({
          ...prev,
          ...editData
        }));
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    // Reset edit data to original values
    setEditData({
      name: donor.name || '',
      age: donor.age || '',
      bloodgroup: donor.bloodgroup || '',
      city: donor.city || ''
    });
    setIsEditing(false);
  };

  const QRCodeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-mx-4 relative">
        <button 
          onClick={() => setShowQRModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Emergency QR Code</h3>
          <div className="bg-gray-100 p-6 rounded-xl mb-4">
            <div className="w-48 h-48 bg-white mx-auto rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <QrCode className="w-32 h-32 text-gray-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Scan this QR code to access your emergency donor information instantly
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate(`/qr/${donorData?.id}`)}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              View QR Code
            </button>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Emergency Donor Information',
                    text: `Emergency donor info for ${donorData?.name}`,
                    url: `${window.location.origin}/qr/${donorData?.id}`
                  });
                } else {
                  navigator.clipboard.writeText(`${window.location.origin}/qr/${donorData?.id}`);
                  alert('Emergency link copied to clipboard!');
                }
              }}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Emergency Link
            </button>
          </div>
          <div className="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">QR Privacy Mode</span>
            <button 
              onClick={() => setQrPrivacy(!qrPrivacy)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                qrPrivacy ? 'bg-red-500' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                qrPrivacy ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, color = "text-red-500", bgColor = "bg-red-50" }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, isActive, onClick, icon: Icon }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-2 font-medium rounded-lg transition-colors ${
        isActive 
          ? 'bg-red-500 text-white shadow-md' 
          : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
      }`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <p className="text-red-700 text-lg">Loading donor profile...</p>
      </div>
    );
  }

  if (!donorData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-center">
          <p className="text-red-700 text-lg mb-4">No donor information found</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="relative">
            {/* BloodMate Brand Header */}
            <div className="h-40 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 rounded-t-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <div className="absolute top-4 left-6">
                <div className="flex items-center space-x-2 text-white">
                  <Heart className="w-6 h-6" />
                  <span className="text-xl font-bold">BloodMate</span>
                </div>
              </div>
              <div className="absolute top-4 right-6 flex space-x-2">
                <button className="p-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Profile Content */}
            <div className="relative px-8 pb-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-8 -mt-20">
                {/* Profile Picture & QR */}
                <div className="flex space-x-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg">
                      <div className="w-full h-full rounded-xl bg-gray-200 flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    </div>
                    {donorData.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Emergency QR Button */}
                  <div className="mt-auto">
                    <button 
                      onClick={() => setShowQRModal(true)}
                      className="w-24 h-24 bg-red-500 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <QrCode className="w-8 h-8 mb-1" />
                      <span className="text-xs font-medium">Emergency</span>
                    </button>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 mt-6 lg:mt-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                          {isEditing ? editData.name || donorData.name : donorData.name}
                        </h1>
                        <p className="text-gray-600 font-mono text-sm">ID: {donorData.id}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          <Droplets className="w-4 h-4 mr-1" />
                          {isEditing ? editData.bloodgroup || donorData.bloodType : donorData.bloodType}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          calculateDaysUntilEligible() === 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <Activity className="w-4 h-4 mr-1" />
                          {calculateDaysUntilEligible() === 0 ? 'Available' : `Eligible in ${calculateDaysUntilEligible()}d`}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          <Zap className="w-4 h-4 mr-1" />
                          Emergency Ready
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {isEditing ? editData.city || donorData.location : donorData.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {donorData.stats.reliability}% Reliability
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Avg Response: {donorData.stats.responseTime}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 flex space-x-3">
                      <button 
                        onClick={() => navigate('/')}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Go Home
                      </button>
                      {!isEditing ? (
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button 
                            onClick={handleSaveEdit}
                            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Save
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Droplets}
            label="Total Donations"
            value={donorData.totalDonations}
          />
          <StatCard
            icon={Zap}
            label="Emergency Responses"
            value={donorData.stats.emergencyResponses}
            color="text-orange-500"
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={Heart}
            label="Lives Impacted"
            value={donorData.stats.livesImpacted}
            color="text-pink-500"
            bgColor="bg-pink-50"
          />
          <StatCard
            icon={QrCode}
            label="QR Scans This Month"
            value="14"
            color="text-blue-500"
            bgColor="bg-blue-50"
          />
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <TabButton id="overview" label="Overview" icon={User} isActive={activeTab === 'overview'} onClick={setActiveTab} />
          <TabButton id="emergency" label="Emergency Info" icon={Zap} isActive={activeTab === 'emergency'} onClick={setActiveTab} />
          <TabButton id="history" label="Donation History" icon={Clock} isActive={activeTab === 'history'} onClick={setActiveTab} />
          <TabButton id="medical" label="Medical Data" icon={Shield} isActive={activeTab === 'medical'} onClick={setActiveTab} />
          <TabButton id="activity" label="Recent Activity" icon={Activity} isActive={activeTab === 'activity'} onClick={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-2 text-red-500" />
                  Personal Information
                  {isEditing && (
                    <span className="ml-4 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Edit Mode
                    </span>
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {/* Name Field */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Full Name</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => handleEditChange('name', e.target.value)}
                            className="font-medium text-gray-900 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        ) : (
                          <p className="font-medium text-gray-900">{donorData.name}</p>
                        )}
                      </div>
                    </div>

                    {/* Age Field */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Age</p>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.age}
                            onChange={(e) => handleEditChange('age', e.target.value)}
                            className="font-medium text-gray-900 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                            min="18"
                            max="65"
                          />
                        ) : (
                          <p className="font-medium text-gray-900">{donor?.age} years old</p>
                        )}
                      </div>
                    </div>

                    {/* Blood Group Field */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Droplets className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Blood Group</p>
                        {isEditing ? (
                          <select
                            value={editData.bloodgroup}
                            onChange={(e) => handleEditChange('bloodgroup', e.target.value)}
                            className="font-medium text-gray-900 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        ) : (
                          <p className="font-medium text-gray-900">{donorData.bloodType}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {/* City Field */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">City</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.city}
                            onChange={(e) => handleEditChange('city', e.target.value)}
                            className="font-medium text-gray-900 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        ) : (
                          <p className="font-medium text-gray-900">{donorData.location}</p>
                        )}
                      </div>
                    </div>

                    {/* Non-editable fields */}
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-medium text-gray-900">{donorData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium text-gray-900">{donorData.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> You can edit your name, age, blood group, and city. 
                      Email and phone number changes require additional verification.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-orange-500" />
                  Emergency Response System
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* QR Code Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <QrCode className="w-5 h-5 mr-2 text-blue-500" />
                      Emergency QR Code
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-600 text-sm">
                        Your unique QR code provides instant access to your donor information during emergencies.
                      </p>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-50">
                        <span className="text-sm font-medium text-gray-700">QR Code Status</span>
                        <span className="text-green-600 text-sm font-semibold">Active</span>
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => setShowQRModal(true)}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          View QR Code
                        </button>
                        <button 
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: 'Emergency Donor Information',
                                text: `Emergency donor info for ${donorData?.name}`,
                                url: `${window.location.origin}/qr/${donorData?.id}`
                              });
                            } else {
                              navigator.clipboard.writeText(`${window.location.origin}/qr/${donorData?.id}`);
                              alert('Emergency link copied to clipboard!');
                            }
                          }}
                          className="px-4 py-2 bg-white text-blue-500 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors text-sm"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contacts */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-green-500" />
                      Emergency Contacts
                    </h3>
                    {donorData.emergencyContacts.map((contact, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.relationship}</p>
                            <p className="text-sm text-gray-600">{contact.phone}</p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Priority {contact.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Emergency Requests */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Emergency Requests</h3>
                  <div className="space-y-3">
                    {emergencyRequests.map((request, index) => (
                      <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-100 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            request.urgency === 'Critical' ? 'bg-red-400' : 'bg-orange-400'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-800">{request.location}</p>
                            <p className="text-sm text-gray-600">{request.distance} away • {request.urgency} urgency</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{new Date(request.date).toLocaleDateString()}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            request.status === 'Donated' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-green-500" />
                Medical Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Health Metrics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Latest Health Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Blood Pressure</span>
                      <span className="font-semibold text-green-600">{donorData.medicalInfo.bloodPressure}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Hemoglobin Level</span>
                      <span className="font-semibold text-green-600">{donorData.medicalInfo.hemoglobin}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Last Medical Checkup</span>
                      <span className="font-medium text-gray-900">
                        {new Date(donorData.medicalInfo.lastCheckup).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-700 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                        Allergies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {donorData.medicalInfo.allergies.map((allergy, index) => (
                          <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-2 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-blue-500" />
                        Current Medications
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {donorData.medicalInfo.medications.map((medication, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                            {medication}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-purple-500" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'donation' ? 'bg-red-100' :
                      activity.type === 'emergency' ? 'bg-orange-100' :
                      activity.type === 'qr' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {activity.type === 'donation' && <Droplets className="w-4 h-4 text-red-500" />}
                      {activity.type === 'emergency' && <Zap className="w-4 h-4 text-orange-500" />}
                      {activity.type === 'qr' && <QrCode className="w-4 h-4 text-blue-500" />}
                      {activity.type === 'profile' && <User className="w-4 h-4 text-gray-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.message}</p>
                      <p className="text-sm text-gray-600">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showQRModal && <QRCodeModal />}
      </div>
    </div>
  );
}
