/* global chrome */
import { signOut } from "firebase/auth/web-extension";
import { userSignIn } from "./userSignIn";
import { handleArtistSearch } from "./handleArtistSearch"
import { handleSpotifyTokenRefresh } from "./handleSpotifyTokenRefresh";
import { handlePreviousNextArtistSearch } from "./handlePreviousNextArtistSearch";
import { handleGetSpotifyProfile } from "./handleGetSpotifyProfile";
import { handleGetSpotifyUserTop } from "./handleGetSpotifyUserTop";
import { handleGetUserFollowedArtists } from "./handleGetUserFollowedArtists";

export function messageListener(auth, db) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "spotify-token-refresh-request") { // Handlespotify token refresh request
            (async () => {
                try {
                    const user = auth.currentUser;
                    if (user) {
                        sendResponse(await handleSpotifyTokenRefresh(db, user.uid))
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
                    sendResponse(await handleArtistSearch(message.artistSearch));
                } catch (error) {
                    sendResponse({ type: "artist-search-failure", error: error.message });
                }
            })();

            return true;
        } else if (message.type === "previous-next-artist-search-request") {
            (async () => {
                try {
                    sendResponse(await handlePreviousNextArtistSearch(message.url));
                } catch (error) {
                    sendResponse({ type: "previous-next-artist-search-failure", error: error.message });
                }
            })();

            return true;
        } else if (message.type === "spotify-profile-search-request") {
            (async () => {
                try {
                    sendResponse(await handleGetSpotifyProfile());
                } catch (error) {
                    sendResponse({ type: "spotify-profile-search-failure", error: error.message });
                }
            })();

            return true;
        } else if (message.type === "spotify-user-top-request") {
            (async () => {
                try {
                    sendResponse(await handleGetSpotifyUserTop());
                } catch (error) {
                    sendResponse({ type: "spotify-user-top-failure", error: error.message });
                }
            })();

            return true;
        } else if (message.type === "spotify-user-followed-artists-request") {
            (async () => {
                try {
                    sendResponse(await handleGetUserFollowedArtists());
                } catch (error) {
                    sendResponse({ type: "spotify-user-followed-artists-failure", error: error.message });
                }
            })();

            return true;
        }
    });
}