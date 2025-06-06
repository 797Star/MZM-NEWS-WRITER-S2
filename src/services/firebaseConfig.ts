// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// These values will be replaced by Vite during the build process
// with the actual values from your .env files.
// Make sure to prefix your environment variables with VITE_

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Optional
};

// Basic validation to ensure variables are loaded (optional but good practice)
if (!firebaseConfig.apiKey) {
  console.error("Firebase API Key is missing. Make sure VITE_FIREBASE_API_KEY is set in your .env file.");
}
