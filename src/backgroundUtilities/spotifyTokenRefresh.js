export const spotifyTokenRefresh = async (refresh_token) => {
    try {
        const url = import.meta.env.VITE_SPOTIFY_TOKEN_URL;

        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token,
                client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID
            }),
        }
        const body = await fetch(url, payload);
        if (body.ok) {
            return await body.json();
        } else {
            console.error("Error refreshing token: ", body.statusText);
            return null;
        }
    } catch (error) {
        console.error("Error refreshing token: ", error);
        return null;
    }
}