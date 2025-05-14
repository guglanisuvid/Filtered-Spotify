/* global chrome */

import { hasOffscreenDocument } from "./hasOffscreenDocument";

export async function closeOffscreenDocument() {
    if (await hasOffscreenDocument()) {
        try {
            await chrome.offscreen.closeDocument();
        } catch (e) {
            console.error("Failed to close offscreen document:", e);
        }
    }
}