/* global chrome */

export const handleArtistSearch = async (artistSearch) => {
    try {
        if (artistSearch.trim().length) {
            const getToken = await chrome.storage.local.get("spotifyTokens");
            const accessToken = getToken.spotifyTokens.accessToken;

            const res = await fetch(`${import.meta.env.VITE_SPOTIFY_REQUEST_URL}/search?q=${encodeURI(artistSearch)}&type=artist`, {
                method: "GET",
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (res.ok) {
                const data = await res.json();
                console.log(data);
            }
            console.log(res);
        } else {
            console.log("Please enter a valid artist name");
        }
    } catch (error) {
        console.error("Error fetching artist data: ", error);
    }
};