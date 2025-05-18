/* global chrome */
import { firestoreGetData } from "./firestoreGetData";

export async function getSpotifyTokens(db, port, uid) {
    let result = await firestoreGetData(db, uid); // Fetch the user data from Firestore

    if (!result) { // Check if user data exists
        port.postMessage({ type: "user-data-not-available" });
        return;
    }

    if (!result.spotify) { // Check if Spotify data exists
        port.postMessage({ type: "spotify-not-authorized" });
        return;
    }

    if (await chrome.storage.local.set({ spotifyTokens: result.spotify })) {
        port.postMessage({ type: "fetch-spotify-tokens-success" }); // Notify the popup that the tokens have been updated
        return result.spotify.accessToken; // Return the access token
    }

    return;
};