import React, { useState } from 'react'; // Import useState
import { supabase } from '../services/supabaseClient'; // Adjusted path
import { User } from '@supabase/supabase-js'; // Using User type from Supabase

interface UserProfileProps {
  user: User; // Expecting the User object from Supabase session
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<string | null>(null);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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

  // Attempt to get avatar_url from user_metadata
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  // Generate initials from email for fallback
  const getInitials = (email?: string): string => {
    if (!email) return '?';
    const parts = email.split('@')[0];
    const nameParts = parts.split(/[._-]/); // Split by common separators
    if (nameParts.length > 1) {
      return (nameParts[0][0] + (nameParts[1][0] || '')).toUpperCase();
    } else if (parts.length > 1){
      return (parts[0] + parts[1]).toUpperCase();
    }
    return parts[0]?.toUpperCase() || '?';
  };

  const initials = getInitials(user.email);

  return (
    <div className="max-w-md mx-auto bg-white p-4 sm:p-6 my-8 rounded-lg shadow-xl border border-neutral-200 text-center space-y-4 sm:space-y-6"> {/* Adjusted padding & space-y */}
      <div> {/* Group for main profile info + avatar */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-neutral-800">User Profile</h2> {/* Responsive text & margin */}

        {avatarUrl && !avatarLoadError ? (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 sm:mb-4 shadow-md border-2 border-neutral-300" /* Responsive size & margin */
          onError={() => setAvatarLoadError(true)}
        />
      ) : (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 sm:mb-4 bg-blue-500 text-white flex items-center justify-center text-2xl sm:text-3xl font-semibold shadow-md border-2 border-blue-600"> {/* Responsive size, text & margin */}
          {initials}
        </div>
      )}

      {user.email && (
        <p className="text-neutral-600 mb-2 text-base sm:text-lg"> {/* Responsive text */}
          {user.email}
        </p>
      )}
      {user.last_sign_in_at && (
         <p className="text-neutral-500 text-xs sm:text-sm mb-4"> {/* Responsive text */}
            Last signed in: {new Date(user.last_sign_in_at).toLocaleDateString()}
         </p>
      )}
      {/* UID can be sensitive, consider if it needs to be displayed. For now, keeping it. */}
      <p className="text-neutral-400 text-xs mb-4 sm:mb-6"> {/* Responsive margin */}
        UID: {user.id}
      </p>
      </div>

      {/* Password Change Section */}
      {user.app_metadata.provider === 'email' && (
        <div className="border-t border-neutral-200 pt-4 sm:pt-6"> {/* Responsive padding */}
          {!isChangingPassword ? (
            <button
              onClick={() => {
                setIsChangingPassword(true);
                setPasswordChangeMessage(null);
                setPasswordChangeError(null);
              }}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base" /* Responsive text */
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (newPassword !== confirmNewPassword) {
                setPasswordChangeError("New passwords do not match.");
                return;
              }
              if (newPassword.length < 6) {
                setPasswordChangeError("Password must be at least 6 characters long.");
                return;
              }
              setIsUpdatingPassword(true);
              setPasswordChangeError(null);
              setPasswordChangeMessage(null);
              try {
                const { error } = await supabase.auth.updateUser({ password: newPassword });
                if (error) throw error;
                setPasswordChangeMessage("Password updated successfully!");
                setNewPassword('');
                setConfirmNewPassword('');
                setIsChangingPassword(false); // Hide form on success
              } catch (e: any) {
                setPasswordChangeError(e.message || "Failed to update password.");
              } finally {
                setIsUpdatingPassword(false);
              }
            }}>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-neutral-700">Change Password</h3> {/* Responsive text & margin */}
              <div className="mb-3 sm:mb-4"> {/* Responsive margin */}
                <label htmlFor="newPassword" className="block text-xs sm:text-sm font-medium text-neutral-700 mb-1 text-left">New Password</label> {/* Responsive text */}
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="New password"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-neutral-700 mb-1 text-left">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
              {passwordChangeError && <p className="mb-2 text-red-600 text-sm">{passwordChangeError}</p>}
              {passwordChangeMessage && <p className="mb-2 text-green-600 text-sm">{passwordChangeMessage}</p>}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md disabled:bg-green-400 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setPasswordChangeError(null);
                    setPasswordChangeMessage(null);
                  }}
                  disabled={isUpdatingPassword}
                  className="w-full sm:flex-1 bg-neutral-500 hover:bg-neutral-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Sign Out Button - separated for clarity and always visible */}
      <div className="border-t border-neutral-200 pt-6 mt-6">
        <button
          onClick={handleSignOut}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
