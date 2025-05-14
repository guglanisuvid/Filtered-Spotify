/* global chrome */
import { signOut } from "firebase/auth/web-extension";
import { userSignIn } from "./userSignIn";
import { handleArtistSearch } from "./handleArtistSearch"

export function messageListener(auth) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "user-signin-request") { // Handle sign in request
            (async () => {
                try {
                    await userSignIn(auth);
                    sendResponse({ type: "signin-success" });
                } catch (error) {
                    sendResponse({ type: "signin-failure", error: error.message });
                }
            })();

            return true;
        } else if (message.type === "user-signout-request") { // Handle sign out request
            (async () => {
                try {
                    await signOut(auth);
                    sendResponse({ type: "signout-success" });
                } catch (error) {
                    sendResponse({ type: "signout-failure", error: error.message });
                }
            })();

            return true;
        } else if (message.type === "artist-search-request") {
            (async () => {
                try {
                    await handleArtistSearch(message.artistSearch)
                    sendResponse(message);
                } catch (error) {
                    sendResponse({ type: "signout-failure", error: error.message });
                }
            })();

            return true;
        }
    });
}