import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Heart, User, MapPin, Droplets, CheckCircle, Edit, ArrowLeft } from 'lucide-react';

function DonorForm() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bloodgroup: "",
    city: "",
    firebase_uid: "",
    status: "Available"
  });

  const [isReviewing, setIsReviewing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [alreadyDonor, setAlreadyDonor] = useState(false);

  // Check if donor already exists for this user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData(prev => ({
          ...prev,
          firebase_uid: currentUser.uid
        }));

        // Check if user already registered as a donor
        fetch(`http://localhost:5000/api/donors/by-uid/${currentUser.uid}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.id) {
              setAlreadyDonor(true);
              navigate(`/qr/${data.id}`);
            }
          })
          .catch(error => {
            console.error("Error checking existing donor:", error);
          });
      } else {
        setUser(null);
        setFormData(prev => ({
          ...prev,
          firebase_uid: ""
        }));
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleReview = (e) => {
    e.preventDefault();

    const errors = [];
    if (!formData.name.trim())
      errors.push("Name is required.");
    if (!formData.age.trim() || +formData.age < 18)
      errors.push("Age is required and must be at least 18.");
    if (!formData.bloodgroup.trim())
      errors.push("Blood Group is required.");
    if (!formData.city.trim())
      errors.push("City is required.");

    if (errors.length) {
      setValidationErrors(errors);
    } else {
      setValidationErrors([]);
      setIsReviewing(true);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/donors/add", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Donor registered successfully!");
        setFormData({
          name: "",
          age: "",
          bloodgroup: "",
          city: "",
          firebase_uid: user ? user.uid : "",
          status: "Available"
        });

        // Redirect to QR page after 2 seconds
        setTimeout(() => {
          navigate(`/qr/${data.id}`);
        }, 2000);
      } else {
        alert(data.message || "Error registering donor");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to server.");
    } finally {
      setIsReviewing(false);
    }
  };

  if (alreadyDonor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Already Registered!</h2>
          <p className="text-gray-600 mb-6">You have already registered as a donor.</p>
          <button
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
            BloodMate
          </h1>
          <p className="text-lg text-gray-600">Donor Registration</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Validation Errors */}
        {!isReviewing && validationErrors.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="space-y-2">
              {validationErrors.map((err, i) => (
                <p key={i} className="text-red-700">{err}</p>
              ))}
            </div>
          </div>
        )}

        {/* Review Section */}
        {isReviewing ? (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Review Your Details</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-red-500 mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Name</span>
                  <p className="font-semibold text-gray-900">{formData.name}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <span className="w-5 h-5 text-red-500 mr-3 text-lg font-bold">🎂</span>
                <div>
                  <span className="text-sm text-gray-500">Age</span>
                  <p className="font-semibold text-gray-900">{formData.age} years</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <Droplets className="w-5 h-5 text-red-500 mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Blood Group</span>
                  <p className="font-semibold text-gray-900">{formData.bloodgroup}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-red-500 mr-3" />
                <div>
                  <span className="text-sm text-gray-500">City</span>
                  <p className="font-semibold text-gray-900">{formData.city}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => { setIsReviewing(false); setValidationErrors([]); }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Details
              </button>
              <button 
                onClick={handleConfirm}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm & Submit
              </button>
            </div>
          </div>
        ) : (
          /* Form Section */
          <form onSubmit={handleReview} className="bg-white rounded-3xl shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-red-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-300 text-lg"
                  placeholder="Enter your full name"
                  onChange={(event) => {
                    const { name, value } = event.target;
                    setFormData((prevData) => ({
                      ...prevData,
                      [name]: value
                    }));
                  }}
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <span className="w-4 h-4 mr-2 text-red-500 text-sm">🎂</span>
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-300 text-lg"
                  placeholder="Enter your age"
                  min="18"
                  max="65"
                  onChange={(event) => {
                    const { name, value } = event.target;
                    setFormData((prevData) => ({
                      ...prevData,
                      [name]: value
                    }));
                  }}
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 mr-2 text-red-500" />
                  Blood Group
                </label>
                <select
                  name="bloodgroup"
                  value={formData.bloodgroup}
                  className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-300 text-lg bg-white"
                  onChange={(event) => {
                    const { name, value } = event.target;
                    setFormData((prevData) => ({
                      ...prevData,
                      [name]: value
                    }));
                  }}
                >
                  <option value="">-- Select Blood Group --</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-300 text-lg"
                  placeholder="Enter your city"
                  onChange={(event) => {
                    const { name, value } = event.target;
                    setFormData((prevData) => ({
                      ...prevData,
                      [name]: value
                    }));
                  }}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-xl font-medium text-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl mt-8"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Review Details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default DonorForm;

