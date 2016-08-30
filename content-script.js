// this content-script plays role of medium to publish/subscribe messages from webpage to the background script

// this object is used to make sure our extension isn't conflicted with irrelevant messages!
var rtcmulticonnectionMessages = {
    'webrtcdev-extension-presence': true,
    'webrtcdev-extension-getsourceId':  true,
    'webrtcdev-extension-stopsource': true
};

// this port connects with background script
var port = chrome.runtime.connect();

// if background script sent a message
port.onMessage.addListener(function(message) {
    // get message from background script and forward to the webpage
    console.log("context Script ", message);
    window.postMessage(message, '*');
});

// watches for messages sent from the webpage processes messages and forwards to background script
window.addEventListener('message', function (event) {
    // if invalid source
    if (event.source != window)
        return;
        
    // it is 3rd party message
    if(!rtcmulticonnectionMessages[event.data]) return;
        
    // if browser is asking whether extension is available
    if(event.data == 'webrtcdev-extension-presence') {
        return window.postMessage('rtcmulticonnection-extension-loaded', '*');
    }

    if(event.data == 'webrtcdev-extension-getsourceId') {
        // forward message to background script
        port.postMessage(event.data);
    }else if(event.data == 'webrtcdev-extension-stopsource'){
        port.postMessage(event.data);        
    }

});

// inform browser that you're available!
window.postMessage('rtcmulticonnection-extension-loaded', '*');
