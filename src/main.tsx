import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './services/firebaseConfig';
// Optionally, import getAnalytics if you plan to use it.
// import { getAnalytics } from "firebase/analytics";

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Optional: Enable if needed

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
