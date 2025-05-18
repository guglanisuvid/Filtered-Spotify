/* global chrome */
import { isTokenExpired } from "./isTokenExpired";

export const handleGetSpotifyProfile = async () => {
    try {
        const tokens = await chrome.storage.local.get("spotifyTokens");

        if (!tokens || await isTokenExpired(tokens.spotifyTokens)) return { error: true, type: "spotify-profile-search-failed", reason: "spotify-token-not-valid" };

        const accessToken = tokens?.spotifyTokens?.accessToken;

        const url = new URL('/v1/me', import.meta.env.VITE_SPOTIFY_API_URL);

        const res = await fetch(url.toString(), {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
            return { error: true, type: "spotify-profile-search-failed", reason: "spotfy-profile-not-fetched", msg: await res.text() }
        }

        return { error: false, type: "spotify-profile-search-success", profileData: await res.json() }
    } catch (error) {
        console.error("Error fetching artist data: ", error);
    }
};