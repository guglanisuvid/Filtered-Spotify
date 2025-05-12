/* global chrome*/
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { spotifyTokenRefresh } from "./utils/spotifyTokenRefresh";
import { firebaseConfig } from "./utils/firebaseConfig";
import { portConnectListener } from "./utils/portConnectListener";
import { messageListener } from "./utils/messageListener";
import { authStateChange } from "./utils/authStateChange";
import { spotifyProfileRequest } from "./utils/spotifyProfileRequest";

const app = initializeApp(firebaseConfig); // Initialize Firebase
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore

let connectedPort = null;

authStateChange(auth, connectedPort);
messageListener(auth);
portConnectListener(connectedPort, auth);

// Listen for connections from the popup or other parts of the extension
chrome.runtime.onConnect.addListener(async (port) => {
  connectedPort = port;
  const user = auth.currentUser;

  if (port.name === "spotify-token-request") { // Handle Spotify tokens request
    try {
      if (user) await getSpotifyTokens(port, user.uid);
    } catch (error) {
      console.error("Error getting user data: ", error);
    }
  } else if (port.name === "spotify-profile-request") { // Handle Spotify tokens request
    try {
      const accessToken = await getSpotifyTokens(port, user.uid);
      await spotifyProfileRequest(accessToken);
    } catch (error) {
      console.error("Error getting user data: ", error);
    }
  }

  port.onDisconnect.addListener(() => {
    connectedPort = null;
  });
});

// Function to handle spotify token retrieval and refresh
const getSpotifyTokens = async (port, uid) => {
  const data = await getDoc(doc(db, "userData", uid));
  if (!data.exists()) return;

  let result = data.data(); // Fetch the user data from Firestore

  if (!result.spotify) { // Check if Spotify data exists
    port.postMessage({ type: "spotify-not-authorized" });
    return;
  }

  // Check if the token is expired
  const isExpired =
    (new Date() - new Date(result.spotify.recievedAt)) / 1000 >
    result.spotify.expiresIn - 30;

  if (isExpired) { // Check if the token is expired
    const refreshed = await spotifyTokenRefresh(result.spotify.refreshToken);
    if (!refreshed?.access_token) {
      port.postMessage({ type: "spotify-refresh-failed" });
      return;
    }

    // Update the token in Firestore
    await setDoc(doc(db, "userData", uid),
      {
        spotify: {
          accessToken: refreshed.access_token,
          refreshToken: refreshed.refresh_token,
          expiresIn: refreshed.expires_in,
          recievedAt: new Date().toISOString(),
        },
      }, { merge: true });

    const updated = await getDoc(doc(db, "userData", uid)); // Fetch the updated document
    if (updated.exists()) { // Check if the document exists
      result = updated.data();
    }
  }

  ({ spotifyTokens: result.spotify }); // Store the tokens in local storage area
  port.postMessage({ type: "spotify-tokens-updated" }); // Notify the popup that the tokens have been updated

  return result.spotify.accessToken; // Return the access token
};