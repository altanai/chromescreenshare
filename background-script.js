// this background script is used to invoke desktopCapture API 
// to capture screen-MediaStream.
console.log("Background Script ");
var session = ['screen', 'window'];

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(portOnMessageHanlder);
    console.log("Background Script runtime connect ");

    function portOnMessageHanlder(message) {
        if(message == 'webrtcdev-extension-getsourceId') {
            chrome.desktopCapture.chooseDesktopMedia(session, port.sender.tab, onAccessApproved);
        }else if(message == 'webrtcdev-extension-stopsource'){
            chrome.desktopCapture.cancelChooseDesktopMedia(parseInt(localStorage['desktop-media-request-id']));
        }
    }

    function onAccessApproved(sourceId) {        
        // if "cancel" button is clicked
        if(!sourceId || !sourceId.length) {
            return port.postMessage('PermissionDeniedError');
        }
        localStorage.setItem('desktop-media-request-id', sourceId);
        port.postMessage({
            sourceId: sourceId
        });
    }
});
