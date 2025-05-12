/* global chrome */
import { closeOffscreenDocument } from "./closeOffscreenDocument";
import { firebaseConfig } from "./firebaseConfig";
import { setupOffscreenDocument } from "./setupOffscreenDocument";

export async function userSignIn() {
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