import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Edit, ArrowLeft, User, MapPin, Droplets } from 'lucide-react';

export default function DonorForm() {
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

  // file states
  const [medicalFile, setMedicalFile] = useState(null);
  const [medicalPreview, setMedicalPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  const [isReviewing, setIsReviewing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [alreadyDonor, setAlreadyDonor] = useState(false);

  // sync firebase user and prefill firebase_uid
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData(prev => ({ ...prev, firebase_uid: currentUser.uid }));
        // optional: check if user already has donor record (your backend route)
        fetch(`http://localhost:5000/api/donors/by-uid/${currentUser.uid}`)
          .then(r => r.json())
          .then(data => {
            if (data && data.id) {
              setAlreadyDonor(true);
              navigate(`/qr/${data.id}`);
            }
          })
          .catch(() => {});
      } else {
        setUser(null);
        setFormData(prev => ({ ...prev, firebase_uid: "" }));
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  // file input handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // validate file type and size
    const allowed = ['image/png','image/jpeg','image/jpg','application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowed.includes(file.type)) {
      setValidationErrors([`File type not allowed. Accept PNG/JPG/PDF only.`]);
      e.target.value = null;
      return;
    }
    if (file.size > maxSize) {
      setValidationErrors([`File too large. Max 5MB allowed.`]);
      e.target.value = null;
      return;
    }

    setValidationErrors([]);
    setMedicalFile(file);
    // create preview only for image types
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setMedicalPreview(url);
    } else {
      setMedicalPreview(null);
    }
  };

  const handleReview = (e) => {
    e.preventDefault();
    const errors = [];
    if (!formData.name.trim()) errors.push("Name is required.");
    if (!formData.age.trim() || +formData.age < 18) errors.push("Age is required and must be at least 18.");
    if (!formData.bloodgroup.trim()) errors.push("Blood Group is required.");
    if (!formData.city.trim()) errors.push("City is required.");

    if (errors.length) setValidationErrors(errors);
    else {
      setValidationErrors([]);
      setIsReviewing(true);
    }
  };

  // Confirm & submit -> sends multipart/form-data
  const handleConfirm = async () => {
    try {
      // Build FormData (multipart)
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('age', formData.age);
      fd.append('bloodgroup', formData.bloodgroup);
      fd.append('city', formData.city);
      if (formData.firebase_uid) fd.append('firebase_uid', formData.firebase_uid);
      fd.append('status', formData.status || 'Available');
      if (medicalFile) fd.append('medicalReport', medicalFile); // <--- key must match server upload.single('medicalReport')

      // Use fetch (browser handles Content-Type)
      // send multipart/form-data to backend
      const res = await fetch('http://localhost:5000/api/donors/add-with-file', {
        method: 'POST',
        body: fd
      });

      // fetch doesn't provide upload progress in browsers; use XHR if you need it.
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Donor registered successfully!");
        setFormData({
          name: "",
          age: "",
          bloodgroup: "",
          city: "",
          firebase_uid: user ? user.uid : "",
          status: "Available"
        });
        setMedicalFile(null);
        setMedicalPreview(null);

        // redirect to qr page for newly created donor
        if (data && data.id) {
          setTimeout(() => navigate(`/qr/${data.id}`), 1200);
        }
      } else {
        alert(data.message || "Error registering donor");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Server or network error during upload.");
    } finally {
      setIsReviewing(false);
      setUploadProgress(null);
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
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl"
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">BloodMate — Donor Registration</h1>
          <p className="text-lg text-gray-600">Upload a medical report (optional) for faster verification</p>
        </div>

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
            <p className="text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

        {!isReviewing && validationErrors.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            {validationErrors.map((err, i) => (<p key={i} className="text-red-700">{err}</p>))}
          </div>
        )}

        {isReviewing ? (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Review Your Details</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-red-500 mr-3" />
                <div><span className="text-sm text-gray-500">Name</span><p className="font-semibold">{formData.name}</p></div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <span className="w-5 h-5 mr-3 text-lg">🎂</span>
                <div><span className="text-sm text-gray-500">Age</span><p className="font-semibold">{formData.age} years</p></div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <Droplets className="w-5 h-5 text-red-500 mr-3" />
                <div><span className="text-sm text-gray-500">Blood Group</span><p className="font-semibold">{formData.bloodgroup}</p></div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-red-500 mr-3" />
                <div><span className="text-sm text-gray-500">City</span><p className="font-semibold">{formData.city}</p></div>
              </div>

              {medicalFile && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-500">Uploaded file:</span>
                  <p className="font-medium mt-2">{medicalFile.name} ({Math.round(medicalFile.size/1024)} KB)</p>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button onClick={() => { setIsReviewing(false); setValidationErrors([]); }} className="flex-1 bg-gray-100 px-6 py-3 rounded-xl">Edit</button>
              <button onClick={handleConfirm} className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl">Confirm & Submit</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReview} className="bg-white rounded-3xl shadow-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-red-500" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e)=> setFormData(prev=> ({ ...prev, [e.target.name]: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <span className="w-4 h-4 mr-2 text-red-500">🎂</span> Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={(e)=> setFormData(prev=> ({ ...prev, [e.target.name]: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500"
                  min="18" max="65"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 mr-2 text-red-500" /> Blood Group
                </label>
                <select
                  name="bloodgroup"
                  value={formData.bloodgroup}
                  onChange={(e)=> setFormData(prev=> ({ ...prev, [e.target.name]: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 bg-white"
                >
                  <option value="">-- Select Blood Group --</option>
                  <option value="A+">A+</option><option value="A-">A-</option>
                  <option value="B+">B+</option><option value="B-">B-</option>
                  <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  <option value="O+">O+</option><option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" /> City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={(e)=> setFormData(prev=> ({ ...prev, [e.target.name]: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500"
                />
              </div>

              {/* File upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Upload Medical Report (optional)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {medicalPreview && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <img src={medicalPreview} alt="preview" className="max-w-full h-auto rounded" />
                  </div>
                )}
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl">Review Details</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


// export default DonorForm;

