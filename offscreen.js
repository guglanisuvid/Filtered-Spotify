/* eslint-disable no-undef */

const _URL = import.meta.env.VITE_IFRAME_URL;
const iframe = document.createElement('iframe');
iframe.src = _URL;
document.documentElement.appendChild(iframe);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'firebase-auth' || message.target !== 'offscreen') {
        sendResponse({ msg: 'Invalid message type or target', authRes: false });
        return false;
    }

    const handleIframeMessage = (message) => {
        try {
            if (message.data.startsWith('!_{')) {
                return;
            }

            const data = JSON.parse(message.data);

            globalThis.removeEventListener('message', handleIframeMessage, false);
            sendResponse(data);
        } catch (e) {
            sendResponse(e);
        }
    }

    globalThis.addEventListener('message', handleIframeMessage, false);

    iframe.contentWindow.postMessage({ "initAuth": true }, new URL(_URL).origin);

    return true;
});
