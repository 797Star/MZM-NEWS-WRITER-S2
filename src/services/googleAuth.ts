// Google OAuth2 for React (client-side only, no backend)
// Uses Google Identity Services (no cost, official)
// https://developers.google.com/identity/gsi/web/guides/overview

export const GOOGLE_CLIENT_ID = '324366107458-g48lhrhsllu2pirl7tnhdnjk1rhlrrea.apps.googleusercontent.com'; // <-- Replace with your client ID

export function loadGoogleScript() {
  if (document.getElementById('google-client-script')) return;
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.id = 'google-client-script';
  document.body.appendChild(script);
}

export function promptGoogleLogin(callback: (credential: string) => void) {
  // @ts-ignore
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response: any) => {
      callback(response.credential);
    },
    ux_mode: 'popup',
  });
  // @ts-ignore
  window.google.accounts.id.prompt();
}
