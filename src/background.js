import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from "./backgroundUtilities/firebaseConfig";
import { authStateChange } from "./backgroundUtilities/authStateChange";
import { messageListener } from "./backgroundUtilities/messageListener";
import { portConnectListener } from "./backgroundUtilities/portConnectListener";

const app = initializeApp(firebaseConfig); // Initialize Firebase
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore

let connectedPort = null;

authStateChange(auth, connectedPort);
messageListener(auth, db);
portConnectListener(connectedPort, auth, db);