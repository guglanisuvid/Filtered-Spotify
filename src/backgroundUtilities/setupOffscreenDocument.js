/* eslint-disable no-undef */

import { hasOffscreenDocument } from "./hasOffscreenDocument";

export async function setupOffscreenDocument() {

    let creatingOffscreenDocument = null; // Variable to track the creation of the offscreen document

    if (await hasOffscreenDocument()) { // if the document is already created, return
        return
    };

    if (creatingOffscreenDocument) { // if the document is being created, wait for it to finish
        await creatingOffscreenDocument;
        return;
    }

    // create the offscreen document
    try {
        creatingOffscreenDocument = chrome.offscreen.createDocument({
            url: chrome.runtime.getURL(import.meta.env.VITE_OFFSCREEN_URL),
            reasons: ['DOM_SCRAPING'],
            justification: 'authentication',
        });
        await creatingOffscreenDocument;
    } catch (e) {
        console.error("Error creating offscreen document:", e);
    } finally {
        creatingOffscreenDocument = null;
    }
}