/* global chrome */
import { isTokenExpired } from "./isTokenExpired";

export const handleGetSpotifyUserTop = async () => {
    try {
        const tokens = await chrome.storage.local.get("spotifyTokens");

        if (!tokens || await isTokenExpired(tokens.spotifyTokens)) return { error: true, type: "spotify-user-top-request-failed", reason: "spotify-token-not-valid" };

        const accessToken = tokens?.spotifyTokens?.accessToken;

        let longTermTracks, shortTermTracks, longTermArtists, shortTermArtists;

        longTermTracks = await fetchingResult("tracks", "long_term", accessToken);
        if (!longTermTracks?.error) {
            shortTermTracks = await fetchingResult("tracks", "short_term", accessToken);

            if (!shortTermTracks?.error) {
                longTermArtists = await fetchingResult("artists", "long_term", accessToken);

                if (!longTermArtists?.error) {
                    shortTermArtists = await fetchingResult("artists", "short_term", accessToken);

                    if (shortTermArtists?.error) {
                        return shortTermArtists;
                    }

                } else {
                    return longTermArtists;
                }

            } else {
                return shortTermTracks;
            }

        } else {
            return longTermTracks;
        }

        return { error: false, longTermTracks, shortTermTracks, longTermArtists, shortTermArtists }
    } catch (error) {
        console.error("Error fetching artist data: ", error);
    }
};

const fetchingResult = async (type, time_range, accessToken) => {
    const url = new URL(`/v1/me/top/${type}`, import.meta.env.VITE_SPOTIFY_API_URL);
    url.search = new URLSearchParams({
        time_range: time_range,
        limit: 20,
        offset: 0
    }).toString();

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) {
        return { error: true, type: "spotify-user-top-request-failed", reason: `spotify-${time_range}-${type}-not-fetched`, msg: await res.text() }
    }

    return { error: false, type: "spotify-user-top-request-success", data: await res.json() }
}