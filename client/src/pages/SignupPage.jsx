import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";

const getPasswordStrength = (password) => {
  if (password.length < 6) return "Weak";
  if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return "Strong";
  return "Medium";
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!agreed) {
      setErrorMsg("You must agree to the Terms and Privacy Policy.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/donor-form");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="signup-bg">
      <form className="signup-box" onSubmit={handleSignup}>
        <div className="logo-row">
          <img src="/logo.png" alt="BloodMate Logo" className="logo" />
          <span className="brand">Blood-Mate</span>
        </div>
        <h1 className="title">Create Account</h1>
        <p className="subtitle">Join and save lives</p>
        <div className="input-group">
          <label className="label">Full Name</label>
          <div className="input-icon">
            <FiUser className="icon" />
            <input
              type="text"
              placeholder="Full name"
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="input-group">
          <label className="label">Email Address</label>
          <div className="input-icon">
            <FiMail className="icon" />
            <input
              type="email"
              placeholder="Email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="input-group">
          <label className="label">Phone Number</label>
          <div className="input-icon">
            <FiPhone className="icon" />
            <input
              type="tel"
              placeholder="Phone number"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="input-group">
          <label className="label">Password</label>
          <div className="input-icon">
            <FiLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
            Password strength: {passwordStrength}
          </div>
        </div>
        <div className="input-group">
          <label className="label">Confirm Password</label>
          <div className="input-icon">
            <FiLock className="icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="input pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              title={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={() => setAgreed((prev) => !prev)}
            className="checkbox"
            required
          />
          <label htmlFor="terms" className="checkbox-label">
            I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="link">Terms</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" className="link">Privacy Policy</a>
          </label>
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <button type="submit" className="submit-btn">
          Create Account
        </button>
        <div className="footer">
          Already have an account?{" "}
          <Link to="/login" className="footer-link">Login</Link>
        </div>
      </form>
      <style>{`
        .signup-bg {
          min-height: 70vh;
          width: 100vw;
          // background: linear-gradient(135deg, #ffe5e5 0%, #fff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .signup-box {
          width: 100%;
          max-width: 450px;
          background: #fff;
          border-radius: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          box-shadow: 0 4px 24px 0 #00000010;
          padding: 2rem 1.5rem 1.5rem 1.5rem;
          animation: popIn 0.7s cubic-bezier(.39,.575,.565,1) both;
        }
        .logo-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 0.5rem;
          animation: 
        }
        .logo {
          width: 70px;
          height: 70px;
        }
        .brand {
          font-size: 1.3rem;
          font-weight: 600;
          color: #b91c1c;
          letter-spacing: -0.5px;
        }
        .title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #991b1b;
          margin-bottom: 0.1rem;
          letter-spacing: -0.5px;
          text-align: center;
          animation: fadeInUp 0.7s;
        }
        .subtitle {
          color: #6b7280;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          text-align: center;
          animation: fadeInUp 1s;
        }
        .input-group {
          margin-bottom: 0.25rem;
          animation: fadeInUp 0.8s;
        }
        .label {
          display: block;
          color: #374151;
          font-size: 0.95rem;
          margin-bottom: 0.2rem;
          font-weight: 500;
        }
        .input-icon {
          position: relative;
        }
        .icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #f87171;
          font-size: 1rem;
        }
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem 0.5rem 2.25rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          outline: none;
          font-size: 0.95rem;
          transition: box-shadow 0.2s;
          background: #fff;
        }
        .input:focus {
          box-shadow: 0 0 0 2px #fecaca;
          border-color: #fecaca;
        }
        .toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          cursor: pointer;
          user-select: none;
          font-size: 1rem;
        }
        .password-strength {
          font-size: 0.85rem;
          margin-top: 0.2rem;
          font-weight: 500;
        }
        .password-strength.strong {
          color: #16a34a;
        }
        .password-strength.medium {
          color: #ca8a04;
        }
        .password-strength.weak {
          color: #dc2626;
        }
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .checkbox {
          accent-color: #ef4444;
        }
        .checkbox-label {
          font-size: 0.85rem;
          color: #4b5563;
        }
        .link {
          color: #ef4444;
          text-decoration: underline;
        }
        .error {
          color: #dc2626;
          font-size: 0.85rem;
          margin-top: 0.2rem;
        }
        .submit-btn {
          width: 100%;
          background: #ef4444;
          color: #fff;
          padding: 0.5rem 0;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
          font-weight: 500;
          font-size: 1rem;
          transition: background 0.2s, transform 0.1s;
          box-shadow: 0 1px 2px 0 #0000000d;
          border: none;
          cursor: pointer;
          animation: fadeInUp 1.1s;
        }
        .submit-btn:hover {
          background: #dc2626;
        }
        .submit-btn:active {
          transform: scale(0.97);
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 0.85rem;
          margin-top: 1rem;
          animation: fadeInUp 1.2s;
        }
        .footer-link {
          color: #ef4444;
          font-weight: 500;
          text-decoration: underline;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.7);}
          100% { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
};

export default SignupPage;