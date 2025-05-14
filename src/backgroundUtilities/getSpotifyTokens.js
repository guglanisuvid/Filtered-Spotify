/* global chrome */
import { firestoreGetData } from "./firestoreGetData";

export async function getSpotifyTokens(port, uid) {
    let result = firestoreGetData(uid); // Fetch the user data from Firestore

    if (!result) { // Check if user data exists
        port.postMessage({ type: "user-data-not-available" });
        return;
    }

    if (!result.spotify) { // Check if Spotify data exists
        port.postMessage({ type: "spotify-not-authorized" });
        return;
    }

    if ((new Date() - new Date(result.spotify.recievedAt)) / 1000 > result.spotify.expiresIn - 30) { // Check if the token is expired
        await chrome.storage.local.set({ spotifyTokens: result.spotify }); // Store the tokens in local storage area
        port.postMessage({ type: "spotify-token-expired" });
        return;
    }

    await chrome.storage.local.set({ spotifyTokens: result.spotify }); // Store the tokens in local storage area
    port.postMessage({ type: "spotify-tokens-updated" }); // Notify the popup that the tokens have been updated
    return result.spotify.accessToken; // Return the access token
};