import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useAuthStatus from "../hooks/useAuthStatus";

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { loggedIn, checkingStatus, user } = useAuthStatus();

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
    return <div className="p-6 text-center text-lg">Loading...</div>;
  }

  if (!loggedIn) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to BloodMate ❤️</h1>
      <p className="text-lg mb-4">
        {user.displayName ? `Hello, ${user.displayName}` : "Logged In"} <br />
        {user.email}
      </p>
      <div className="flex gap-4 justify-center mt-6">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/donor-form")}
        >
          Add Donor
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/profile")}
        >
          View Profile
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => navigate("/qr/1")}
        > 
          View QR Code  
        </button>
                <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => navigate("/signup")}
        > 
         Sign Up 
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;