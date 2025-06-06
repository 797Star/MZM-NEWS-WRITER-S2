import React from 'react';
import { supabase } from '../services/supabaseClient'; // Adjusted path
import { User } from '@supabase/supabase-js'; // Using User type from Supabase

interface UserProfileProps {
  user: User; // Expecting the User object from Supabase session
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Sign out success will be handled by onAuthStateChange in App.tsx
    } catch (e: any) {
      console.error("Error signing out: ", e.message);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 my-8 rounded-none shadow-lg border border-neutral-300 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-neutral-800">User Profile</h2>
      {user.email && ( // Check if email exists
        <p className="text-neutral-700 mb-1">
          <span className="font-medium">Email:</span> {user.email}
        </p>
      )}
      <p className="text-neutral-700 mb-1">
        <span className="font-medium">UID:</span> {user.id} {/* Supabase user ID is typically 'id' */}
      </p>
      {user.last_sign_in_at && ( // Check if last_sign_in_at exists
         <p className="text-neutral-700 mb-6">
            <span className="font-medium">Last signed in:</span> {new Date(user.last_sign_in_at).toLocaleString()}
         </p>
      )}
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
