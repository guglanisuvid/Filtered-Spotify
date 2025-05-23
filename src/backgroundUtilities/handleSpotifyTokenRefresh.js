/* global chrome */
import { firestoreGetData } from "./firestoreGetData";
import { firestoreSetSpotifyData } from "./firestoreSetSpotifyData";
import { spotifyTokenRefresh } from "./spotifyTokenRefresh";

export async function handleSpotifyTokenRefresh(db, uid) {
    const tokens = await chrome.storage.local.get("spotifyTokens");
    const refreshed = await spotifyTokenRefresh(tokens?.spotifyTokens?.refreshToken);
    if (!refreshed?.access_token) {
        return { error: true, type: "spotify-token-refresh-failed", reason: "token-refresh-failed" };
    }

    if (await firestoreSetSpotifyData(db, refreshed, uid)) {
        const updated = await firestoreGetData(db, uid); // Fetch the updated document
        if (!updated) {
            return { error: true, type: "spotify-token-refresh-failed", reason: "user-data-not-fetched" };
        }
        await chrome.storage.local.set({ spotifyTokens: updated.spotify }); // Store the tokens in local storage area
        return { error: false, type: "spotify-token-refresh-success" };
    }
    return { error: true, type: "spotify-token-refresh-failed", reason: "token-storing-failed" }
}