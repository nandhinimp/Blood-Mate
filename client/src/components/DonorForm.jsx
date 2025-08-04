import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import '../index.css';

function DonorForm() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    blood_group: "",
    city: "",
    firebase_uid: user ? user.uid : ""
  });

  const [isReviewing, setIsReviewing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [alreadyDonor, setAlreadyDonor] = useState(false);

  // Check if donor already exists for this user
  useEffect(() => {
    if (user && user.uid) {
      fetch(`http://localhost:5000/api/donors/by-uid/${user.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            setAlreadyDonor(true);
            // Optionally redirect to QR page:
            navigate(`/qr/${data.id}`);
          }
        });
    }
  }, [user, navigate]);

  const handleReview = (e) => {
    e.preventDefault();

    const errors = [];
    if (!formData.name.trim())
      errors.push("Name is required.");
    if (!formData.age.trim() || +formData.age < 18)
      errors.push("Age is required and must be at least 18.");
    if (!formData.blood_group.trim())
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
        setSuccessMessage("✅ Donor registered successfully!");
        setFormData({
          name: "",
          age: "",
          blood_group: "",
          city: "",
          firebase_uid: user ? user.uid : ""
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
      <div className="container">
        <h2>You have already registered as a donor.</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => navigate('/')}
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <h1>🩸 Blood_Mate - Donor Registration</h1>

      {successMessage && (
        <div
          style={{
            background: "#e0ffe0",
            borderLeft: "4px solid #2e7d32",
            padding: "10px",
            marginBottom: "20px",
            color: "#2e7d32",
            borderRadius: "4px",
            fontWeight: "bold"
          }}
        >
          {successMessage}
        </div>
      )}

      {!isReviewing && validationErrors.length > 0 && (
        <div className="container">
          {validationErrors.map((err, i) => (
            <p key={i} style={{ color: "red" }}>❗ {err}</p>
          ))}
        </div>
      )}

      {isReviewing ? (
        <div className="container">
          <h2>Please review your details:</h2>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Age:</strong> {formData.age}</p>
          <p><strong>Blood Group:</strong> {formData.blood_group}</p>
          <p><strong>City:</strong> {formData.city}</p>
          <button onClick={() => { setIsReviewing(false); setValidationErrors([]); }}>
            Edit
          </button>
          <button onClick={handleConfirm}>Confirm & Submit</button>
        </div>
      ) : (
        <form className="container" onSubmit={handleReview}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              className="inputField"
              onChange={(event) => {
                const { name, value } = event.target;
                setFormData((prevData) => ({
                  ...prevData,
                  [name]: value
                }));
              }}
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={formData.age}
              className="inputField"
              onChange={(event) => {
                const { name, value } = event.target;
                setFormData((prevData) => ({
                  ...prevData,
                  [name]: value
                }));
              }}
            />
          </label>
          <label>
            Blood Group:
            <select
              name="blood_group"
              value={formData.blood_group}
              className="inputField"
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
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={formData.city}
              className="inputField"
              onChange={(event) => {
                const { name, value } = event.target;
                setFormData((prevData) => ({
                  ...prevData,
                  [name]: value
                }));
              }}
            />
          </label>
          <button type="submit">Review your Details</button>
        </form>
      )}
    </>
  );
}

export default DonorForm;