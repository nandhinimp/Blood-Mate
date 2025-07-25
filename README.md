🩸 BloodMate — Smart Blood Donation Portal
BloodMate is a beginner-friendly full-stack web application designed to simplify and streamline the process of blood donation. It connects blood donors with recipients and hospitals, offering an organized and user-friendly platform to register, search, and manage donations.

💡 Project Overview
This project was created with the intention of using technology to support a critical real-world cause — saving lives through blood donation. BloodMate enables users to register as donors and allows anyone to search for donors by blood group and location.

✅ Completed Features (as of now)
🔐 Firebase Authentication

Email & Password Signup/Login

Google OAuth Login

Redirects and UI feedback upon authentication

📝 Donor Registration Form

Fields: Name, Age, Blood Group, City

Data stored securely in a MySQL database via Express API

Error handling for invalid or missing input

⚙️ Backend Setup

Express.js server with REST APIs

MySQL database integration

API Endpoints:

POST /api/donor/add — Add a new donor

GET /api/donor/all — Get all donors

GET /api/donor/search — Filter donors by blood group and city

🌐 Responsive Frontend

Built using React + Vite

Clean UI design for login, signup, and form pages

Navigation and routing implemented with React Router

🎯 Upcoming Features
📄 File Upload with OCR using Tesseract.js

🔍 Unsafe keyword detection in uploaded reports

📎 QR Code generation for donor identity

🧠 Awareness cards with medical tips and donor education

✨ UI polish and subtle animations

🧪 Test cases and error boundary handling

🙌 Purpose
BloodMate was developed as a socially impactful, beginner-friendly project idea for internships and academic showcases. It reflects the ability to build a real-world full-stack project with proper authentication, backend integration, and meaningful user workflows.