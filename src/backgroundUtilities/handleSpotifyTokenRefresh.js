/* global chrome */
import { firestoreGetData } from "./firestoreGetData";
import { firestoreSetSpotifyData } from "./firestoreSetSpotifyData";
import { spotifyTokenRefresh } from "./spotifyTokenRefresh";

export async function handleSpotifyTokenRefresh(db, port, uid) {
    const tokens = await chrome.storage.local.get("spotifyTokens");
    const refreshed = await spotifyTokenRefresh(tokens?.spotifyTokens?.refreshToken);
    if (!refreshed?.access_token) {
        port.postMessage({ type: "spotify-token-refresh-failed" });
        return;
    }

    if (await firestoreSetSpotifyData(db, refreshed, uid)) {
        const updated = await firestoreGetData(db, uid); // Fetch the updated document
        if (!updated) {
            port.postMessage({ type: "user-data-not-available" });
            return;
        }
        await chrome.storage.local.set({ spotifyTokens: updated.spotify }); // Store the tokens in local storage area
        port.postMessage({ type: "spotify-token-refresh-success" });
        return updated.spotify.accessToken;
    }
    return;
}