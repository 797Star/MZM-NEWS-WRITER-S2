// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6tl8QCQL7NGix9Pb_yMUYdwGO1cXonQg",
  authDomain: "news-writer2.firebaseapp.com",
  projectId: "news-writer2",
  storageBucket: "news-writer2.firebasestorage.app",
  messagingSenderId: "628188927017",
  appId: "1:628188927017:web:0d879d0e6cd47c2d2cf838",
  measurementId: "G-TYJ8XQCY1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
