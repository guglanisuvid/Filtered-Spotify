/* global chrome */
export async function SpotifyTokenRefreshMessage() {
    const res = await chrome.runtime.sendMessage({
        type: "spotify-token-refresh-request",
    });

    if (res?.error && res?.type === "spotify-token-refresh-failed") {
        if (res?.reason === "token-refresh-failed") {
            return { error: true, reason: "token-refresh-failed" }
        } else if (res?.reason === "user-data-not-fetched") {
            return { error: true, reason: "user-data-not-fetched" }
        } else if (res.reason === "token-storing-failed") {
            return { error: true, reason: "token-storing-failed" }
        }
    }

    if (!res?.error) return { error: false, type: "spotify-token-refresh-success" }

    return { error: true, reason: "token-refresh-failed" };
}