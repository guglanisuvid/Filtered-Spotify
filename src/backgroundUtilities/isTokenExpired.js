import { spotifyTokenRefresh } from "./spotifyTokenRefresh";

export async function isTokenExpired(tokens) {
    const isExpired =
        (new Date() - new Date(tokens?.recievedAt)) / 1000 >
        tokens?.expiresIn - 30;

    if (isExpired) {
        const refreshed = await spotifyTokenRefresh(tokens?.refreshToken);
        if (!refreshed?.access_token) return { error: true, message: "Error refreshing tokens." }
    }
}