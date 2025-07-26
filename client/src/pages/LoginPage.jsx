import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
await signInWithEmailAndPassword(auth, email, password);
navigate("/donor-form");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="login-bg">
      <form className="login-box" onSubmit={handleLogin}>
        <div className="logo-row">
          <img src="/logo.png" alt="BloodMate Logo" className="logo" />
          <span className="brand">Blood-Mate</span>
        </div>
        <h1 className="title">Login</h1>
        <p className="subtitle">Sign in to your account</p>
        <div className="input-group">
          <label className="label">Email Address</label>
          <div className="input-icon">
            <FiMail className="icon" />
            <input
              type="email"
              placeholder="Enter your email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter your password"
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
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <button type="submit" className="submit-btn">
        Login
        </button>
        <div className="divider">
          <div className="line"></div>
          <span className="or">or</span>
          <div className="line"></div>
        </div>
        <button type="button" onClick={handleGoogleSignIn} className="google-btn">
          <FcGoogle className="google-icon" />
          Continue with Google
        </button>
        <div className="footer">
          Don't have an account?{" "}
          <Link to="/signup" className="footer-link">Sign up</Link>
        </div>
      </form>
      <style>{`
        .login-bg {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #ffe5e5 0%, #fff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-box {
          width: 100%;
          max-width: 400px;
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
          animation: fadeInDown 0.7s;
        }
        .logo {
          width: 60px;
          height: 60px;
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
        .divider {
          display: flex;
          align-items: center;
          margin: 1rem 0 0.5rem 0;
        }
        .line {
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }
        .or {
          margin: 0 0.75rem;
          color: #9ca3af;
          font-size: 0.95rem;
        }
        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid #93c5fd;
          border-radius: 0.5rem;
          padding: 0.5rem 0;
          background: #fff;
          color: #374151;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: border 0.2s;
        }
        .google-btn:hover {
          border: 1.5px solid #2563eb;
        }
        .google-icon {
          font-size: 1.3rem;
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

export default LoginPage;