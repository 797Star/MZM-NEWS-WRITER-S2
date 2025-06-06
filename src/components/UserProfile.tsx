import React from 'react';
import { getAuth, signOut, User as FirebaseUser } from 'firebase/auth';

interface UserProfileProps {
  user: FirebaseUser;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Sign out success will be handled by onAuthStateChanged in App.tsx
    } catch (error) {
      console.error("Error signing out: ", error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 my-8 rounded-none shadow-lg border border-neutral-300 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-neutral-800">User Profile</h2>
      <p className="text-neutral-700 mb-1">
        <span className="font-medium">Email:</span> {user.email}
      </p>
      <p className="text-neutral-700 mb-6">
        <span className="font-medium">UID:</span> {user.uid}
      </p>
      <button
        onClick={handleSignOut}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-sm shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Sign Out
      </button>
    </div>
  );
};

export default UserProfile;
