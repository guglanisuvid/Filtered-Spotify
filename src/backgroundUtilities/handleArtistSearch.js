/* global chrome */

import { isTokenExpired } from "./isTokenExpired";

export const handleArtistSearch = async (artistSearch) => {
    try {
        if (!artistSearch.length) return { error: true, type: "artist-search-failed", reason: "artist-name-not-valid" };

        const tokens = await chrome.storage.local.get("spotifyTokens");

        if (!tokens || await isTokenExpired(tokens.spotifyTokens)) return { error: true, type: "artist-search-failed", reason: "spotify-token-not-valid" };

        const accessToken = tokens?.spotifyTokens?.accessToken;

        const url = new URL('/v1/search', import.meta.env.VITE_SPOTIFY_API_URL);
        url.search = new URLSearchParams({
            q: artistSearch,
            type: 'artist',
            limit: 10,
            offset: 0
        }).toString();

        const res = await fetch(url.toString(), {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
            return { error: true, type: "artist-search-failed", reason: "artist-data-not-fetched", msg: await res.text() }
        }

        const data = await res.json();

        await chrome.storage.local.set({
            artists: {
                href: data?.artists?.href,
                next: data?.artists?.next,
                previous: data?.artists?.previous,
                total: data?.artists?.total,
                items: data?.artists?.items.map(artist => ({
                    id: artist?.id,
                    name: artist?.name,
                    popularity: artist?.popularity,
                    genres: artist?.genres,
                    image: artist?.images[0]?.url
                }))
            }
        });

        return { error: false, type: "artist-search-success" }
    } catch (error) {
        console.error("Error fetching artist data: ", error);
    }
};