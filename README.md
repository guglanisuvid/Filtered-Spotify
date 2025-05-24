# 🎧 Filtered Spotify — A Chrome Extension by Loopverse

Filtered Spotify helps you rediscover the music you actually want to hear. Filter tracks by your favorite artists and eras — and instantly vibe to curated playlists built just for you.

Built as part of the Loopverse platform, Filtered Spotify is a powerful Chrome Extension tailored for Spotify listeners who crave control, nostalgia, and perfect playlists.

## 🌟 Features

- 🎤 **Artist Filter** — Search and select your favorite artists.
- 📅 **Date Range Filter** — Choose your preferred eras of music.
- 🔁 **Instant Playlist Generation** — Smart Spotify playlists with zero fluff.
- 🔒 **Secure Spotify Authorization** — Powered by PKCE and OAuth 2.0.
- 🔗 **Connected with Loopverse** — Authentication and user data is linked with your Loopverse web account.

## 🔧 Project Setup

Prerequisites: You must already have the Loopverse web app running with Firebase Auth + Firestore integrated.

### 1️⃣ Clone the Extension Repo

```bash
git clone https://github.com/guglanisuvid/Filtered-Spotify.git
cd Filtered Spotify
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Create a .env file in the root of the extension project:

```plaintext
VITE_FIREBASE_API_KEY = same_as_in_loopverse_project

VITE_FIREBASE_AUTH_DOMAIN = same_as_in_loopverse_project

VITE_FIREBASE_PROJECT_ID = same_as_in_loopverse_project

VITE_FIREBASE_STORAGE_BUCKET = same_as_in_loopverse_project

VITE_FIREBASE_MESSAGING_SENDER_ID = same_as_in_loopverse_project

VITE_FIREBASE_APP_ID = same_as_in_loopverse_project

VITE_FIREBASE_MEASUREMENT_ID = same_as_in_loopverse_project

VITE_OFFSCREEN_URL = /offscreen.html

VITE_IFRAME_URL = http://127.0.0.1:5173/FilteredSpotifySignIn.html

VITE_SPOTIFY_CLIENT_ID = same_as_in_loopverse_project

VITE_SPOTIFY_TOKEN_URL = same_as_in_loopverse_project

VITE_SPOTIFY_AUTHORIZATION_URL = http://127.0.0.1:5173/filtered-spotify

VITE_SPOTIFY_API_URL = https://api.spotify.com
```

### 4️⃣ Create the iframe page in the Loopverse Project and Run the Project

Navigate to the public folder of the Loopverse project and create an html file with the following code.

```html
<--FilteredSpotifySignIn.html-->
<!DOCTYPE html>
<html>
  <head>
    <title>Filtered Spotify SignIn</title>
    <script type="module">
      import {
        initializeApp,
        getApps,
      } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
      import {
        getAuth,
        signInWithPopup,
        GoogleAuthProvider,
      } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

      const PARENT_FRAME = document.location.ancestorOrigins[0];

      globalThis.addEventListener("message", async (event) => {
        if (
          event.data &&
          event.data.type === "signin-request" &&
          event.data.config
        ) {
          try {
            const app = initializeApp(event.data.config);
            const auth = getAuth(app);

            const user = await signInWithPopup(auth, new GoogleAuthProvider());
            const credential = await GoogleAuthProvider.credentialFromResult(
              user
            );
            const idToken = credential.idToken;
            globalThis.parent.self.postMessage(
              JSON.parse(
                JSON.stringify({ type: "Auth Result", idToken, user })
              ),
              PARENT_FRAME
            );
          } catch (error) {
            globalThis.parent.self.postMessage(error, PARENT_FRAME);
          }
        }
      });
    </script>
  </head>
  <body>
    <p>Signing You in…</p>
  </body>
</html>
```

```bash
npm run dev
```

### 5️⃣ Build the Chrome Extension

```bash
npm run build
```

### 6️⃣ Load the Extension in Chrome

Once built, load it in Chrome:

- Open chrome://extensions/.
- Enable Developer mode (top right).
- Click Load unpacked.
- Select the dist/ folder from your project root.

## 🔑 Spotify Authentication (Frontend-Only PKCE)

This extension uses the Authorization Code Flow with PKCE. Here’s how it works:

- User clicks “Connect Spotify”
- The extension redirects to Spotify’s auth page with a PKCE challenge.
- On successful login, Spotify redirects to /callback.html inside the extension.
- Access and refresh tokens are stored and refreshed automatically.

## 🔗 Connecting to Loopverse

This extension is built to authenticate users via Firebase, using the same credentials as your Loopverse web app.

Shared Authentication Flow:

- User logs into the Chrome extension via Firebase Auth (same as the Loopverse web app).
- User’s UID is used to fetch and store Spotify access/refresh tokens in Firestore.
- The extension reads/writes to the same Firestore instance that the Loopverse app uses.

_Make sure your Firebase Auth and Firestore rules allow authenticated reads/writes from both web and extension environments._

## 📄 License

MIT License
