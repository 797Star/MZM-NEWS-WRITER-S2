import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './services/firebaseConfig';

// Initialize Firebase (no need to assign to a variable if unused)
initializeApp(firebaseConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
