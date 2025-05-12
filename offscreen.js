/* eslint-disable no-undef */
const _URL = import.meta.env.VITE_IFRAME_URL;
const iframe = document.createElement('iframe');
iframe.src = _URL;
document.documentElement.appendChild(iframe);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'signin-request' || !message.config) {
        sendResponse({ msg: 'Invalid message type or config' });
        return;
    }

    const handleIframeMessage = (message) => {
        try {
            if (typeof message.data === 'string' && message.data.startsWith('!_{')) return;

            globalThis.removeEventListener('message', handleIframeMessage, false);

            sendResponse(message.data);
        } catch (e) {
            sendResponse(e);
        }
    }

    globalThis.addEventListener('message', handleIframeMessage, false);

    iframe.contentWindow.postMessage(message, new URL(_URL).origin);

    return true;
});
