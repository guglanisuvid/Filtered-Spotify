/* global chrome */
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth/web-extension";
import { closeOffscreenDocument } from "./closeOffscreenDocument";
import { firebaseConfig } from "./firebaseConfig";
import { setupOffscreenDocument } from "./setupOffscreenDocument";

export async function userSignIn(auth) {
    try {
        await setupOffscreenDocument();

        let authRes = await chrome.runtime.sendMessage({
            type: "signin-request",
            config: firebaseConfig,
        });

        await closeOffscreenDocument();

        if (authRes.type === "Auth Result" && authRes.idToken && authRes.user) { // Check if the authentication was successful
            const credential = GoogleAuthProvider.credential(authRes.idToken);
            return await signInWithCredential(auth, credential);
        }

        return null;
    } catch (error) {
        console.error("Error during authentication: ", error);
    }
}