/* global chrome */
import { userDataMessage } from "./userDataMessage";

export function portConnectListener(connectedPort, auth) {
  chrome.runtime.onConnect.addListener(async (port) => {
    connectedPort = port;

    if (port.name === "user-data-request") { // Handle user data request
      try {
        userDataMessage(port, auth);
      } catch (error) {
        console.error("Error getting user data: ", error);
      }
    }

    port.onDisconnect.addListener(() => {
      connectedPort = null;
    });
  });
}