import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function DonorForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    blood_group: "",
    city: ""
  });

  const [isReviewing, setIsReviewing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

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

      console.log("Response status:", response.status);

      if (response.ok) {
        setSuccessMessage("✅ Donor registered successfully!");

        setFormData({
          name: "",
          age: "",
          blood_group: "",
          city: ""
        });

        // Hide message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        alert("Error registering donor");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to server.");
    } finally {
      setIsReviewing(false);
    }
  };

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
