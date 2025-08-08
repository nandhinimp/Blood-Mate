import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4aUGS_eb9CYbiX32te4sBtIx0yvezQtA",
  authDomain: "blood-mate-bf969.firebaseapp.com",
  projectId: "blood-mate-bf969",
  storageBucket: "blood-mate-bf969.appspot.com",
  messagingSenderId: "223279685296",
  appId: "1:223279685296:web:a1755d5a971f2dec93e575"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();

// Optional: Configure Google Auth Provider
provider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, provider };
export default app;