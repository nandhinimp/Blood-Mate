import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";
import "../index.css"; // Import your CSS file

const LoginPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path fill="#ef4444" d="M12 2.75c.41 0 .81.19 1.07.52l4.5 5.25a4.75 4.75 0 0 1-7.14 6.26l-.01-.01a4.75 4.75 0 0 1-7.13-6.25l4.5-5.25c.26-.33.66-.52 1.07-.52Zm0 1.5-4.5 5.25a3.25 3.25 0 0 0 4.89 4.28l.01-.01a3.25 3.25 0 0 0 4.89-4.27L12 4.25Z"></path></svg>
        </div>
        <h1 className="login-title">BloodMate</h1>
        <p className="login-subtitle">Sign in to your account</p>
        <form onSubmit={handleLogin} className="login-form">
          <label>Email Address</label>
          <div className="login-input-wrapper">
            <FiMail className="login-icon" />
            <input
              type="email"
              placeholder="Enter your email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <label>Password</label>
          <div className="login-input-wrapper">
            <FiLock className="login-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="login-eye"
              onClick={() => setShowPassword((prev) => !prev)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {errorMsg && <p className="login-error">{errorMsg}</p>}
          <button type="submit" className="login-btn">Sign In</button>
        </form>
        <div className="login-divider">
          <span>or</span>
        </div>
        <button onClick={handleGoogleSignIn} className="login-google-btn">
          <FcGoogle className="login-google-icon" />
          Continue with Google
        </button>
        <p className="login-bottom-text">
          Don't have an account?{" "}
          <Link to="/signup" className="login-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;