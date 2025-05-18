/* global chrome */
import { signOut } from "firebase/auth/web-extension";
import { userSignIn } from "./userSignIn";
import { handleArtistSearch } from "./handleArtistSearch"
import { handleSpotifyTokenRefresh } from "./handleSpotifyTokenRefresh";
import { handlePreviousNextArtistSearch } from "./handlePreviousNextArtistSearch";
import { handleGetSpotifyProfile } from "./handleGetSpotifyProfile";

export function messageListener(auth, db) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "spotify-token-refresh-request") { // Handlespotify token refresh request
            (async () => {
                try {
                    const user = auth.currentUser;
                    if (user) {
                        const result = await handleSpotifyTokenRefresh(db, user.uid);
                        sendResponse(result)
                    };
                } catch (error) {
                    sendResponse({ type: "token-refresh-failure", error: error.message });
                }
            })();

            return true;
        } else if (message.type === "user-signin-request") { // Handle sign in request
            (async () => {
                try {
                    if (await userSignIn(auth)) sendResponse({ type: "signin-success" });
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
                    const res = await handleArtistSearch(message.artistSearch);
                    sendResponse(res);
                } catch (error) {
                    sendResponse({ type: "signout-failure", error: error.message });
                }
            })();

            return true;
        } else if (message.type === "previous-next-artist-search-request") {
            (async () => {
                try {
                    const res = await handlePreviousNextArtistSearch(message.url);
                    sendResponse(res);
                } catch (error) {
                    sendResponse({ type: "signout-failure", error: error.message });
                }
            })();

            return true;
        } else if (message.type === "spotify-profile-search-request") {
            (async () => {
                try {
                    const res = await handleGetSpotifyProfile();
                    sendResponse(res);
                } catch (error) {
                    sendResponse({ type: "signout-failure", error: error.message });
                }
            })();

            return true;
        }
    });
}