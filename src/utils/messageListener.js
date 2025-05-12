/* global chrome */

import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { userSignIn } from "./userSignIn";
import { signInWithCredential } from "firebase/auth";

export function messageListener(auth) {
    chrome.runtime.onMessage.addListener(async (message) => {
        if (message.type === "user-signin-request" && message.target === "background") { // Handle authentication request
            const res = await userSignIn();
            if (res.type === "Auth Result" && res.idToken && res.user) { // Check if the authentication was successful
                const credential = GoogleAuthProvider.credential(res.idToken);
                await signInWithCredential(auth, credential);
            }
        }

        return false;
    });
}