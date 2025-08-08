import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import QRCode from "qrcode";

const QrPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDonor = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.log('No authenticated user found');
          setLoading(false);
          return;
        }

        // Fetch donor data by current user's Firebase UID to ensure we get the right donor
        const res = await fetch(`http://localhost:5000/api/donors/by-uid/${user.uid}?t=${Date.now()}`);
        const data = await res.json();
        console.log('Fetched donor data for QR:', data); // Debug log
        setDonor(data);

        // Generate QR code as data URL
        const qrText = `${window.location.origin}/qr/${data.id}`;
        QRCode.toDataURL(qrText, { width: 200 }, (err, url) => {
          if (!err) setQrUrl(url);
        });
      } catch (error) {
        console.error("Failed to fetch donor data:", error);
      } finally {
        setLoading(false);
      }
    };

    getDonor();
  }, []); // Remove id dependency since we're using Firebase UID

  const refreshData = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.log('No authenticated user found');
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:5000/api/donors/by-uid/${user.uid}?t=${Date.now()}`);
      const data = await res.json();
      console.log('Refreshed donor data:', data);
      setDonor(data);

      // Regenerate QR code
      const qrText = `${window.location.origin}/qr/${data.id}`;
      QRCode.toDataURL(qrText, { width: 200 }, (err, url) => {
        if (!err) setQrUrl(url);
      });
    } catch (error) {
      console.error("Failed to refresh donor data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <p className="text-red-700 text-lg">Loading donor details...</p>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-center">
          <p className="text-red-700 text-lg mb-4">No donor information found</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-50">
      <div className="bg-white rounded-xl shadow-md border border-red-200 p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Emergency Donor Info</h2>
        
        <div className="flex gap-2 mb-4">
          <button 
            onClick={refreshData}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Go to Home
          </button>
        </div>

        <div className="text-left space-y-2 mb-4">
          <p><span className="font-medium text-red-800">Name:</span> {donor.name}</p>
          <p><span className="font-medium text-red-800">Blood Group:</span> {donor.bloodgroup}</p>
          <p><span className="font-medium text-red-800">City:</span> {donor.city}</p>
          <p><span className="font-medium text-red-800">Status:</span> {donor.status || "Available"}</p>
        </div>

        <div className="inline-block p-4 bg-white border border-red-300 rounded-lg mb-4">
          {qrUrl && <img src={qrUrl} alt="QR Code" width={200} height={200} />}
          <p className="text-sm text-gray-500 mt-2">Scan this code in emergencies</p>
        </div>
      </div>
    </div>
  );
};

export default QrPage;