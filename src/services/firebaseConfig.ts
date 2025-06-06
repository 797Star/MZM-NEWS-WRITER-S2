import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6tl8QCQL7NGix9Pb_yMUYdwGO1cXonQg",
  authDomain: "news-writer2.firebaseapp.com",
  projectId: "news-writer2",
  storageBucket: "news-writer2.firebasestorage.app",
  messagingSenderId: "628188927017",
  appId: "1:628188927017:web:0d879d0e6cd47c2d2cf838",
  measurementId: "G-TYJ8XQCY1M"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth and export it
export const auth = getAuth(app);
export default app;
