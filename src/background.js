/* eslint-disable no-undef */

// Firebase App Initialization
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Background: User is signed in (on extension load):', user);

    // chrome.storage.local.set({ isLoggedIn: true, user: JSON.parse(JSON.stringify(user)) });
  } else {
    console.log('Background: User is signed out (on extension load):', user);

    //   chrome.storage.local.set({ isLoggedIn: false, user: null });
  }
});

const OFFSCREEN_DOCUMENT_PATH = chrome.runtime.getURL("/offscreen.html"); // Offscreen Document Path

let creatingOffscreenDocument = null; // Variable to track the creation of the offscreen document

// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "auth" && message.target === "background") {
    const res = await firebaseAuth();
    sendResponse(res);
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
  const docs = await hasDocument();
  if (!docs) {
    if (creatingOffscreenDocument) {
      await creatingOffscreenDocument;
    } else {
      creatingOffscreenDocument = chrome.offscreen.createDocument({
        url: path,
        reasons: [
          'DOM_SCRAPING'
        ],
        justification: 'authentication'
      });
      await creatingOffscreenDocument;
      creatingOffscreenDocument = null;
    }
  }
}

// close the offscreen document
async function closeOffscreenDocument() {
  if (!(await hasDocument())) {
    return;
  }
  await chrome.offscreen.closeDocument();
}

// get the auth from the offscreen document
async function getAuthentication() {
  const auth = await chrome.runtime.sendMessage({
    type: "firebase-auth",
    target: "offscreen",
  });

  return auth;
}

// main function to handle firebase authentication
async function firebaseAuth() {

  await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

  const auth = await getAuthentication();

  await closeOffscreenDocument();

  return auth;
}