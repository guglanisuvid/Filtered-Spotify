/* global chrome */
import { isTokenExpired } from "./isTokenExpired";

export const handleGetUserFollowedArtists = async () => {
    try {
        const tokens = await chrome.storage.local.get("spotifyTokens");

        if (!tokens || await isTokenExpired(tokens.spotifyTokens)) return { error: true, type: "spotify-user-followed-artists-failed", reason: "spotify-token-not-valid" };

        const accessToken = tokens?.spotifyTokens?.accessToken;

        const url = new URL('/v1/me/following', import.meta.env.VITE_SPOTIFY_API_URL);
        url.search = new URLSearchParams({
            type: "artist",
            limit: 50
        }).toString();

        const res = await fetch(url.toString(), {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!res.ok) {
            return { error: true, type: "spotify-user-followed-artists-failed", reason: "spotify-user-followed-artists-not-fetched", msg: await res.text() }
        }

        return { error: false, type: "spotify-user-followed-artists-success", followedArtists: await res.json() }
    } catch (error) {
        console.error("Error fetching artist data: ", error);
    }
};