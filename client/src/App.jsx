import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Remove this unused import: import axios from "axios";
import Home from "./pages/Home"; 
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DonorForm from "./components/DonorForm";
import ProtectedRoute from "./components/ProtectedRoute";
import QrPage from './pages/QrPage';
import Profile from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/donor-form" element={<ProtectedRoute><DonorForm /></ProtectedRoute>} />
        <Route path="/qr/:id" element={<QrPage />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;