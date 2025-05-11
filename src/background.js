/* eslint-disable no-undef */
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithCredential, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { spotifyTokenRefresh } from "./utils/spotifyTokenRefresh";
import { setupOffscreenDocument } from "./utils/setupOffscreenDocument";
import { closeOffscreenDocument } from "./utils/closeOffscreenDocument";
import { firebaseConfig } from "./utils/firebaseConfig";

const app = initializeApp(firebaseConfig); // Initialize Firebase
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore

let connectedPort = null;

// Listen for connections from the popup or other parts of the extension
chrome.runtime.onConnect.addListener(async (port) => {
  connectedPort = port;

  const user = auth.currentUser;

  if (port.name === "signout-request") { // Handle sign out request
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  } else if (port.name === "user-request") { // Handle user data request
    try {
      port.postMessage({
        type: "user-data",
        user: user ?
          {
            name: user?.displayName,
            email: user?.email,
            photo: user?.photoURL,
            uid: user?.uid,
          }
          : null
      });
    } catch (error) {
      console.error("Error getting user data: ", error);
    }
  } else if (port.name === "get-spotify-tokens") { // Handle Spotify tokens request
    try {
      if (user) {
        let data = await getDoc(doc(db, "userData", user.uid)); // Get user data from Firestore
        if (data.exists()) {
          let result = data.data();
          // Check if the user has authorized Spotify
          if (!result.spotify) {
            port.postMessage({
              type: "spotify-not-authorized",
            });
            return;
          }

          // Check if the access token is expired
          if (result.spotify && (new Date() - new Date(result.spotify.recievedAt)) / 1000 > result.spotify.expiresIn - 30) {
            data = await spotifyTokenRefresh(result.spotify.refreshToken);
            await setDoc(doc(db, "userData", user.uid), {
              spotify: {
                accessToken: data?.access_token,
                refreshToken: data?.refresh_token,
                expiresIn: data?.expires_in,
                recievedAt: new Date().toISOString()
              }
            }, { merge: true });

            data = await getDoc(doc(db, "userData", user.uid));
            if (data.exists()) {
              result = data.data();
            }
          }
          // Store the Spotify tokens in chrome storage
          chrome.storage.local.set({
            spotifyTokens: result.spotify
          });
        }
      }

      // Disconnect the port when done
      port.onDisconnect.addListener(() => {
        connectedPort = null;
      });
    } catch (error) {
      console.error("Error getting user data: ", error);
    }
  }
});

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
  if (connectedPort) {
    connectedPort.postMessage({
      type: "user-data",
      user: user
        ? {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid,
        }
        : null,
    });
  }
});

// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "auth-request" && message.target === "background") { // Handle authentication request
    const res = await firebaseAuth();
    if (res.type === "Auth Result" && res.idToken && res.user) { // Check if the authentication was successful
      const credential = GoogleAuthProvider.credential(res.idToken);
      await signInWithCredential(auth, credential);
    }
  }

  return false;
});

// Handling authentication request from the popup
async function firebaseAuth() {
  try {
    await setupOffscreenDocument();

    const auth = await chrome.runtime.sendMessage({
      type: "signin-request",
      config: firebaseConfig,
    });

    await closeOffscreenDocument();

    return auth;
  } catch (error) {
    console.error("Error during authentication: ", error);
  }
}