/* global chrome */
import { getSpotifyTokens } from "./getSpotifyTokens";
import { userDataMessage } from "./userDataMessage";

export function portConnectListener(connectedPort, auth, db) {
  chrome.runtime.onConnect.addListener(async (port) => {
    connectedPort = port;
    const user = auth.currentUser;

    if (port.name === "user-data-request") { // Handle user data request
      try {
        userDataMessage(port, auth);
      } catch (error) {
        console.error("Error getting user data: ", error);
      }
    } else if (port.name === "spotify-token-request") { // Handle Spotify tokens request
      try {
        if (user) await getSpotifyTokens(db, port, user.uid);
      } catch (error) {
        console.error("Error getting spotify token: ", error);
      }
    }

    port.onDisconnect.addListener(() => {
      connectedPort = null;
    });
  });
}