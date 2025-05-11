/* eslint-disable no-undef */

export async function hasOffscreenDocument() {
    const matchedClients = await clients.matchAll();
    return matchedClients.some(
        (c) => c.url === chrome.runtime.getURL(import.meta.env.VITE_OFFSCREEN_URL)
    );
}