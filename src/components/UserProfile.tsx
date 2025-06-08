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

  // handleSignOut function is now moved to App.tsx

  // Attempt to get avatar_url from user_metadata
  // Avatar display in header is separate, this is for the main profile page avatar
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
    <div className="max-w-md mx-auto bg-white p-6 sm:p-8 my-8 rounded-xl shadow-2xl border border-neutral-200 text-center space-y-6">
      <div> {/* Group for main profile info + avatar */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-primary-dark">BM_LABEL_UserProfileTitle</h2>

        {avatarUrl && !avatarLoadError ? (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 shadow-lg border-2 border-primary"
          onError={() => setAvatarLoadError(true)}
        />
      ) : (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 bg-primary text-white flex items-center justify-center text-3xl sm:text-4xl font-semibold shadow-lg border-2 border-primary-dark">
          {initials}
        </div>
      )}

      {user.email && (
        <div className="mb-2">
          <span className="block text-xs text-neutral-500">BM_LABEL_UserProfileEmail</span>
          <p className="text-neutral-800 text-base sm:text-lg">
            {user.email}
          </p>
        </div>
      )}
      {user.last_sign_in_at && (
         <div className="mb-4">
           <span className="block text-xs text-neutral-500">BM_LABEL_UserProfileLastSignIn</span>
           <p className="text-neutral-600 text-xs sm:text-sm">
              {new Date(user.last_sign_in_at).toLocaleDateString()}
           </p>
         </div>
      )}
      {/* UID can be sensitive, consider if it needs to be displayed. For now, keeping it. */}
      {/* <p className="text-neutral-400 text-xs mb-4 sm:mb-6">
        UID: {user.id}
      </p> */}
      </div>

      {/* Password Change Section */}
      {user.app_metadata.provider === 'email' && (
        <div className="border-t border-neutral-200 pt-6 space-y-4">
          {!isChangingPassword ? (
            <button
              onClick={() => {
                setIsChangingPassword(true);
                setPasswordChangeMessage(null);
                setPasswordChangeError(null);
              }}
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 text-sm sm:text-base" /* Corrected padding */
            >
              BM_LABEL_ChangePasswordTitle
            </button>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (newPassword !== confirmNewPassword) {
                setPasswordChangeError("BM_ERROR_PasswordsDoNotMatch");
                return;
              }
              if (newPassword.length < 6) {
                setPasswordChangeError("BM_ERROR_PasswordTooShort");
                return;
              }
              setIsUpdatingPassword(true);
              setPasswordChangeError(null);
              setPasswordChangeMessage(null);
              try {
                const { error } = await supabase.auth.updateUser({ password: newPassword });
                if (error) throw error;
                setPasswordChangeMessage("BM_SUCCESS_PasswordUpdated");
                setNewPassword('');
                setConfirmNewPassword('');
                setIsChangingPassword(false); // Hide form on success
              } catch (e: any) {
                setPasswordChangeError(e.message || "BM_ERROR_FailedToUpdatePassword");
              } finally {
                setIsUpdatingPassword(false);
              }
            }}>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-primary-dark">BM_LABEL_ChangePasswordTitle</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-1 text-left">BM_LABEL_NewPassword</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150"
                  placeholder="BM_PLACEHOLDER_EnterNewPassword"
                />
              </div>
              <div> {/* Removed mb-4 from here, space-y-4 on parent handles it */}
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-neutral-700 mb-1 text-left">BM_LABEL_ConfirmNewPassword</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150"
                  placeholder="BM_PLACEHOLDER_ConfirmNewPassword"
                />
              </div>
              </div> {/* Closing div for space-y-4 that wraps the input fields */}
              {passwordChangeError && <p className="mb-2 text-red-500 text-sm">{passwordChangeError}</p>}
              {passwordChangeMessage && <p className="mb-2 text-success text-sm">{passwordChangeMessage}</p>}
              <div className="flex flex-col sm:flex-row gap-3 pt-2"> {/* Added pt-2 for slight separation */}
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full sm:flex-1 bg-gradient-deep-blue hover:opacity-90 text-white font-semibold py-2 px-5 rounded-md shadow-md hover:shadow-lg disabled:bg-neutral-400 disabled:opacity-70 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 text-sm sm:text-base" /* Corrected py-2.5 to py-2 */
                >
                  {isUpdatingPassword ? 'BM_LABEL_UpdatingPassword' : 'BM_LABEL_UpdatePassword'}
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
                  className="w-full sm:flex-1 bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-2 px-5 rounded-md shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 text-sm sm:text-base" /* Corrected py-2.5 to py-2 */
                >
                  BM_LABEL_Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Sign Out Button is now in the header dropdown, so removed from here */}
    </div>
  );
};

export default UserProfile;
