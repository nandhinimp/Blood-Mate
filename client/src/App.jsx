import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home"; 
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DonorForm from "./components/DonorForm";
import ProtectedRoute from "./components/ProtectedRoute";
// ✅ THIS FIXES YOUR ERROR

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/donor-form" element={< ProtectedRoute><DonorForm /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;