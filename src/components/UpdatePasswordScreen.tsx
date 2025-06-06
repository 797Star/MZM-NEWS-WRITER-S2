import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom'; // Will be used if react-router-dom is installed

const UpdatePasswordScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const navigate = useNavigate(); // Uncomment if using react-router-dom for navigation

  // Supabase handles the session recovery from the URL fragment automatically
  // when the page loads after the user clicks the password reset link.
  // We can listen for the PASSWORD_RECOVERY event to provide specific UI updates if needed,
  // but often it's not strictly necessary for updateUser to work.
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // This event confirms that Supabase has processed the recovery token.
        // You could set a state here if you want to show a specific message
        // or enable the form only after this event.
        setMessage("You can now set your new password.");
      }
      // We don't strictly need to manage the session here as updateUser works within the context
      // of the session established by the recovery token.
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) { // Basic check, Supabase might have stricter rules
        setError("Password must be at least 6 characters long.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setMessage("Your password has been updated successfully! You can now sign in with your new password.");
      setIsPasswordUpdated(true);
      // Optionally, redirect to login page after a delay:
      setTimeout(() => navigate('/login'), 3000); // Example redirect
    } catch (e: any) {
      setError(e.message || "An error occurred while updating your password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f5f5f2]" style={{ fontFamily: "Lora, Georgia, 'Times New Roman', Times, serif" }}>
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full border border-neutral-200">
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ fontFamily: "Lora, Georgia, 'Times New Roman', Times, serif" }}>
          Update Password
        </h1>

        {isPasswordUpdated ? (
          <>
            {message && <p className="mb-4 text-green-600 text-sm text-center">{message}</p>}
            {/* Add a button to navigate to login, or rely on automatic redirect if implemented */}
            {/* Example: <button onClick={() => navigate('/login')} className="...">Go to Login</button> */}
          </>
        ) : (
          <form onSubmit={handleUpdatePassword}>
            {message && !error && <p className="mb-4 text-green-600 text-sm text-center">{message}</p>}
            <div className="mb-4">
              <label htmlFor="new-password" className="block text-sm font-medium text-neutral-700 mb-1">New Password</label>
              <input
                type="password"
                id="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                placeholder="••••••••"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-neutral-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="mb-4 text-red-600 text-sm text-center">{error}</p>}
            {isLoading && <p className="mb-4 text-neutral-600 text-sm text-center">Updating password...</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-neutral-700 hover:bg-neutral-800 text-white font-semibold rounded shadow-md disabled:bg-neutral-400 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
       <div className="mt-8 text-xs text-neutral-400 text-center">
        &copy; {new Date().getFullYear()} MZM News Writer
      </div>
    </div>
  );
};

export default UpdatePasswordScreen;
