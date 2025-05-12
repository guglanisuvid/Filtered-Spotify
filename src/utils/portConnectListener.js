/* global chrome */

import { signOut } from "firebase/auth";
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
    } else if (port.name === "signout-request") { // Handle sign out request
      try {
        await signOut(auth);
        userDataMessage(port, auth);
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    }

    port.onDisconnect.addListener(() => {
      connectedPort = null;
    });
  });
}