/* global chrome */
export function SpotifyTokenRefreshPort() {
    return new Promise((resolve) => {
        const port = chrome.runtime.connect({
            name: "spotify-token-refresh-request",
        });

        port.onMessage.addListener((message) => {
            if (message.type === "spotify-token-refresh-failed") {
                // display a message about spotify token could not be refreshed and sign out the user
            } else if (message.type === "user-data-not-available") {
                // display a message about user data not available and sign out the user
            }
        });

        port.disconnect();
        resolve();
    });
}