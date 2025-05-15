/* global chrome */

import { isTokenExpired } from "./isTokenExpired";

export const handleArtistSearch = async (artistSearch) => {
    try {
        if (!artistSearch.length) return { error: true, type: "artist-search-failed", reason: "artist-name-not-valid" };

        const tokens = await chrome.storage.local.get("spotifyTokens");

        if (await isTokenExpired(tokens.spotifyTokens)) return { error: true, type: "artist-search-failed", reason: "spotify-token-not-valid" };

        const accessToken = tokens?.spotifyTokens?.accessToken;

        const url = new URL('/v1/search', import.meta.env.VITE_SPOTIFY_API_URL);
        url.search = new URLSearchParams({
            q: artistSearch,
            type: 'artist',
            limit: 10
        }).toString();

        const res = await fetch(url.toString(), {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
            console.log(await res.text());
            return { error: true, type: "artist-search-failed", reason: "artist-data-not-fetched" }
        }

        // return { error: false, type: "artist-search-success", data: await res.json() }
    } catch (error) {
        console.error("Error fetching artist data: ", error);
    }
};