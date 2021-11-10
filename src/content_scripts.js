const VIEW_MODE_ID = "wppip-view-mode"
const SPLIT_MODE_ID = "wppip-split-mode"
const URL_INPUT_ID = "wppip-url-input"

function getIframe(settings) {
    return '<iframe id="' + settings.id + '" width="' + settings.width + '" height="' + settings.height + '" style="' + settings.style + '" src="' + settings.src + '" />'
}

function getFrameset(settings) {
    return '<frameset cols="50%, 50%"><frame src="' + settings.pageUrl + '" /><frame src="' + settings.src + '" id="' + settings.id + '"/></frameset>'
}

function getUrlInput(settings) {
    return '<input id="' + URL_INPUT_ID + '" type="url" style="width: ' + settings.width + "px;" + settings.style + '" value="' + settings.src + '" />'
}

function addUrlInputEventListener(settings) {
    document.getElementById(URL_INPUT_ID).addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            document.getElementById(settings.id).src = document.getElementById(URL_INPUT_ID).value;
        }
    });
}

function open(payload) {
    switch (payload.settings.id) {
        case VIEW_MODE_ID:
            openByViewMode(payload.settings)
            break
        case SPLIT_MODE_ID:
            payload.settings.pageUrl = payload.pageUrl
            openBySplitMode(payload.settings)
            break
        default:
            break
    }
}

function openByViewMode(settings) {
    if (document.getElementById(settings.id)) {
        document.getElementById(settings.id).remove()
    }
    document.body.innerHTML += getIframe(settings)
    document.body.innerHTML += getUrlInput(settings)
    addUrlInputEventListener(settings)
}

function openBySplitMode(settings) {
    if (document.getElementById(settings.id)) {
        document.getElementById(settings.id).src = settings.src
    } else {
        document.body.parentNode.removeChild(document.body);
        document.documentElement.innerHTML = getFrameset(settings)
    }
}

function close(settings) {
    switch (settings.id) {
        case VIEW_MODE_ID:
            if (document.getElementById(settings.id)) {
                document.getElementById(settings.id).remove()
            }
            break
        case SPLIT_MODE_ID:
            if (document.getElementById(settings.id)) {
                alert("Split mode cannot be turned off, please reload the page.")
            }
            break
        default:
            break
    }
}

function update(settings) {
    if (document.getElementById(settings.id)) {
        document.getElementById(settings.id).width = settings.width
        document.getElementById(settings.id).height = settings.height
        document.getElementById(settings.id).style = settings.style
    }
    if (document.getElementById(URL_INPUT_ID)) {
        document.getElementById(URL_INPUT_ID).style = "width: " + settings.width + "px;" + settings.style
    }
}

const onMessage = (message) => {
    switch (message.action) {
        case "WPPIP.OPEN":
            if (message.payload.linkUrl) {
                message.payload.settings.src = message.payload.linkUrl
            }
            open(message.payload)
            break;
        case "WPPIP.CLOSE":
            close(message.payload.settings)
            break;
        case "WPPIP.SEARCH":
            if (message.payload.selectionText) {
                message.payload.settings.src = 'https://www.google.com/search?q=' + message.payload.selectionText
            }
            open(message.payload)
            break;
        case "WPPIP.UPDATE":
            update(message.payload.settings)
            break;
        default:
            break;
    }
}

chrome.runtime.onMessage.addListener(onMessage);