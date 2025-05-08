/* eslint-disable no-undef */

// Firebase App Initialization
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithCredential, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let connectedPort = null;

chrome.runtime.onConnect.addListener(async (port) => {
  connectedPort = port;

  if (port.name === "signout-request") {
    signOut(auth)
  } else if (port.name === "user-request") {
    const user = auth.currentUser;
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
  } else if (port.name === "get-spotify-token") {
    try {
      const user = auth.currentUser;
      if (user) {
        const data = await getDoc(doc(db, "userData", user.uid));
        if (data.exists()) {
          const result = data.data();
          port.postMessage({
            type: "spotify-tokens",
            tokens: result.spotify.accessToken && result.spotify.refreshToken ? result.spotify : null
          });
        } else {
          return null;
        }
      }
    } catch (error) {
      console.error("Error getting user data: ", error);
      return null;
    }
  }

  port.onDisconnect.addListener(() => {
    connectedPort = null;
  });
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

const OFFSCREEN_DOCUMENT_PATH = chrome.runtime.getURL("/offscreen.html"); // Offscreen Document Path

let creatingOffscreenDocument = null; // Variable to track the creation of the offscreen document

// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "auth-request" && message.target === "background") {
    const res = await firebaseAuth();
    if (res.type === "Auth Result" && res.idToken && res.user) {
      const credential = GoogleAuthProvider.credential(res.idToken);
      await signInWithCredential(auth, credential);
    }
  }

  return false;
});

// check if the offscreen document is already created
async function hasDocument() {
  const matchedClients = await clients.matchAll();
  return matchedClients.some(
    (c) => c.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)
  );
}

// setup the offscreen document
async function setupOffscreenDocument(path) {
  if (await hasDocument()) {
    return
  };

  if (creatingOffscreenDocument) {
    await creatingOffscreenDocument;
    return;
  }

  try {
    creatingOffscreenDocument = chrome.offscreen.createDocument({
      url: path,
      reasons: ['DOM_SCRAPING'],
      justification: 'authentication',
    });
    await creatingOffscreenDocument;
  } catch (e) {
    console.error("Error creating offscreen document:", e);
  } finally {
    creatingOffscreenDocument = null;
  }
}

// close the offscreen document
async function closeOffscreenDocument() {
  if (await hasDocument()) {
    try {
      await chrome.offscreen.closeDocument();
    } catch (e) {
      console.error("Failed to close offscreen document:", e);
    }
  }
}

// get the auth from the offscreen document
async function getAuthentication() {
  return await chrome.runtime.sendMessage({
    type: "firebase-auth",
    config: firebaseConfig
  });
}

// main function to handle firebase authentication
async function firebaseAuth() {
  await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

  const auth = await getAuthentication();

  await closeOffscreenDocument();

  return auth;
}