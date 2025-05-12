export async function spotifyProfileRequest(accessToken) {
    const url = `${import.meta.env.VITE_SPOTIFY_API_URL}/me`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

    console.log("Spotify Profile Request: ", await res.json());
}