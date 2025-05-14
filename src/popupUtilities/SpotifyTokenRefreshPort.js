/* global chrome */
export function SpotifyTokenRefreshPort() {
    const port = chrome.runtime.connect({
        name: "spotify-token-refresh-request",
    });

    port.onMessage.addListener((message) => {
        if (message.type === "user-data-not-available") {
            // display a message about user data not accessible and signs out the user
        }
    });

    return () => {
        port.disconnect();
    };
}