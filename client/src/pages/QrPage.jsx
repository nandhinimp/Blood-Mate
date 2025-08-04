import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";

const QrPage = () => {
  const { id } = useParams();
  const [donor, setDonor] = useState(null);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const getDonor = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/donors/${id}`);
        const data = await res.json();
        setDonor(data);

        // Generate QR code as data URL
        const qrText = `${window.location.origin}/qr/${data.id}`;
        QRCode.toDataURL(qrText, { width: 200 }, (err, url) => {
          if (!err) setQrUrl(url);
        });
      } catch (error) {
        console.error("Failed to fetch donor data:", error);
      }
    };

    getDonor();
  }, [id]);

  if (!donor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <p className="text-red-700 text-lg">Loading donor details...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-50">
      <div className="bg-white rounded-xl shadow-md border border-red-200 p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Emergency Donor Info</h2>

        <div className="text-left space-y-2 mb-4">
          <p><span className="font-medium text-red-800">Name:</span> {donor.name}</p>
          <p><span className="font-medium text-red-800">Blood Group:</span> {donor.blood_group}</p>
          <p><span className="font-medium text-red-800">City:</span> {donor.city}</p>
          <p><span className="font-medium text-red-800">Status:</span> {donor.available === undefined ? "N/A" : donor.available ? "✅ Available" : "❌ Not Available"}</p>
        </div>

        <div className="inline-block p-4 bg-white border border-red-300 rounded-lg">
          {qrUrl && <img src={qrUrl} alt="QR Code" width={200} height={200} />}
          <p className="text-sm text-gray-500 mt-2">Scan this code in emergencies</p>
        </div>
      </div>
    </div>
  );
};

export default QrPage;