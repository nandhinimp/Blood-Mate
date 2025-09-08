import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useAuthStatus from "../hooks/useAuthStatus";
import { useEffect } from "react";
import { 
  Heart, 
  User, 
  UserPlus, 
  QrCode, 
  LogOut,
  Bell,
  Settings,
  Droplets,
  Activity,
  Users,
  Shield,
  Zap,
  Calendar,
  MapPin,
  Gift,
  Award
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { loggedIn, checkingStatus, user } = useAuthStatus();

  // Fix the navigation issue by using useEffect
  useEffect(() => {
    if (!checkingStatus && !loggedIn) {
      navigate("/login");
    }
  }, [loggedIn, checkingStatus, navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };

  if (checkingStatus) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading BloodMate...</p>
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return null; // Let useEffect handle navigation
  }

  return (
    <div className="min-h-screen bg-white" style={{ boxSizing: 'border-box' }}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-500 via-red-600 to-pink-600 relative overflow-hidden w-full" style={{ boxSizing: 'border-box' }}>
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative w-full px-2 sm:px-4 md:px-6 lg:px-8" style={{ boxSizing: 'border-box' }}>
          <div className="flex items-center justify-between h-16 sm:h-20" style={{ boxSizing: 'border-box' }}>
            <div className="flex items-center space-x-2 text-white">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-xl sm:text-2xl font-bold">BloodMate</span>
            </div>
            <div className="flex space-x-1 sm:space-x-2">
              <button className="p-1.5 sm:p-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-colors" style={{ boxSizing: 'border-box' }}>
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button className="p-1.5 sm:p-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-colors" style={{ boxSizing: 'border-box' }}>
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-1 sm:px-2 md:px-4 lg:px-6" style={{ boxSizing: 'border-box' }}>
        {/* Welcome Section */}
        <div className="bg-white shadow-sm w-full" style={{ boxSizing: 'border-box' }}>
          <div className="text-center py-6 sm:py-8 md:py-10 px-1 sm:px-2" style={{ boxSizing: 'border-box' }}>
            <div className="mb-4 sm:mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg hover:scale-110 transition-transform duration-300" style={{ boxSizing: 'border-box' }}>
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Welcome to BloodMate
              </h1>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl text-gray-700">
                  {user.displayName ? `Hello, ${user.displayName}!` : "Welcome, Blood Hero!"}
                </p>
                <p className="text-gray-500 text-sm sm:text-base lg:text-lg">{user.email}</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mt-6 sm:mt-8 w-full" style={{ boxSizing: 'border-box' }}>
              <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group" style={{ boxSizing: 'border-box' }}>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ boxSizing: 'border-box' }}>
                    <Droplets className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Ready to Save Lives</h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">Your blood can help up to 3 people</p>
              </div>
              
              <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group" style={{ boxSizing: 'border-box' }}>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ boxSizing: 'border-box' }}>
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Community Impact</h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">Join thousands of donors</p>
              </div>
              
              <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group md:col-span-2 lg:col-span-1" style={{ boxSizing: 'border-box' }}>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ boxSizing: 'border-box' }}>
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Safe & Secure</h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">Your data is protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="py-4 sm:py-6 md:py-8" style={{ boxSizing: 'border-box' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6" style={{ boxSizing: 'border-box' }}>
            {/* Add Donor Card */}
            <div className="group bg-white rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 sm:col-span-2 lg:col-span-1" style={{ boxSizing: 'border-box' }}>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" style={{ boxSizing: 'border-box' }}>
                  <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">Register as Donor</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">Join our community and start saving lives</p>
                <button
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl text-sm sm:text-base"
                  onClick={() => navigate("/donor-form")}
                  style={{ boxSizing: 'border-box' }}
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Add Donor Profile
                </button>
              </div>
            </div>

            {/* View Profile Card */}
            <div className="group bg-white rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2" style={{ boxSizing: 'border-box' }}>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" style={{ boxSizing: 'border-box' }}>
                  <User className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">My Profile</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">View and manage your donor information</p>
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl text-sm sm:text-base"
                  onClick={() => navigate("/profile")}
                  style={{ boxSizing: 'border-box' }}
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  View Profile
                </button>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="group bg-white rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2" style={{ boxSizing: 'border-box' }}>
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" style={{ boxSizing: 'border-box' }}>
                  <QrCode className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">Emergency QR</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">Quick access to your donor information</p>
                <button
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl text-sm sm:text-base"
                  onClick={() => navigate("/qr/1")}
                  style={{ boxSizing: 'border-box' }}
                >
                  <QrCode className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  View QR Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 mb-4 sm:mb-6 md:mb-8" style={{ boxSizing: 'border-box' }}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-6 lg:mb-8 text-center">Why Choose BloodMate?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6" style={{ boxSizing: 'border-box' }}>
            <div className="text-center group" style={{ boxSizing: 'border-box' }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" style={{ boxSizing: 'border-box' }}>
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">Emergency Response</h3>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">Quick response for urgent blood needs</p>
            </div>
            
            <div className="text-center group" style={{ boxSizing: 'border-box' }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" style={{ boxSizing: 'border-box' }}>
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">Track Donations</h3>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">Monitor your donation history and impact</p>
            </div>
            
            <div className="text-center group" style={{ boxSizing: 'border-box' }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" style={{ boxSizing: 'border-box' }}>
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">Find Centers</h3>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">Locate nearby blood donation centers</p>
            </div>
            
            <div className="text-center group" style={{ boxSizing: 'border-box' }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" style={{ boxSizing: 'border-box' }}>
                <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">Recognition</h3>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">Get recognized for your life-saving contributions</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-white rounded-3xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8" style={{ boxSizing: 'border-box' }}>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-3 lg:gap-6" style={{ boxSizing: 'border-box' }}>
            <div className="text-center lg:text-left">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl mb-1 sm:mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Our support team is here to assist you</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4 w-full sm:w-auto" style={{ boxSizing: 'border-box' }}>
              <button
                className="px-3 sm:px-4 py-2 sm:py-3 md:px-6 md:py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl text-sm sm:text-base"
                onClick={() => navigate("/signup")}
                style={{ boxSizing: 'border-box' }}
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Sign Up
              </button>
              <button
                className="px-3 sm:px-4 py-2 sm:py-3 md:px-6 md:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl text-sm sm:text-base"
                onClick={handleLogout}
                style={{ boxSizing: 'border-box' }}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;