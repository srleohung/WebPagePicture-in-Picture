const VIEW_MODE_ID = "wppip-view-mode"
const SPLIT_MODE_ID = "wppip-split-mode"

var settings = {
    id: VIEW_MODE_ID,
    style: "position: fixed; bottom: 0; right: 0; z-index: 99",
    width: 360,
    height: 640,
    src: "https://www.google.com/webhp?igu=1",
}

function onClickOpen(info, tab) {
    chrome.tabs.sendMessage(tab.id, { action: "WPPIP.OPEN", payload: { ...info, settings } })
}

function onClickClose(info, tab) {
    chrome.tabs.sendMessage(tab.id, { action: "WPPIP.CLOSE", payload: { ...info, settings } })
}

function onClickSearch(info, tab) {
    chrome.tabs.sendMessage(tab.id, { action: "WPPIP.SEARCH", payload: { ...info, settings } })
}

function onClickUpdate(info, tab, setting) {
    settings = { ...settings, ...setting }
    chrome.tabs.sendMessage(tab.id, { action: "WPPIP.UPDATE", payload: { ...info, settings } })
}

function createSizeContextMenus(parent) {
    createTitleContextMenu(parent, "Size")
    createSizeContextMenu(parent, 360, 640)
    createSizeContextMenu(parent, 640, 360)
}

function createModeContextMenus(parent) {
    createTitleContextMenu(parent, "Mode")
    createModeContextMenu(parent, "View", VIEW_MODE_ID)
    createModeContextMenu(parent, "Split", SPLIT_MODE_ID)
}

function createPositionContextMenus(parent) {
    createTitleContextMenu(parent, "Position")
    createStyleContextMenu(parent, "Bottom right", "position: fixed; bottom: 2px; right: 2px; z-index: 99")
    createStyleContextMenu(parent, "Bottom left", "position: fixed; bottom: 2px; left: 2px; z-index: 99")
    createStyleContextMenu(parent, "Top right", "position: fixed; top: 2px; right: 2px; z-index: 99")
    createStyleContextMenu(parent, "Top left", "position: fixed; top: 2px; left: 2px; z-index: 99")
}

function createTitleContextMenu(parent, title) {
    return chrome.contextMenus.create({
        "title": "Mode",
        "type": "separator",
        "contexts": ['all'],
        "parentId": parent
    });
}

function createModeContextMenu(parent, title, id) {
    return chrome.contextMenus.create({
        "title": title,
        "type": "radio",
        "contexts": ['all'],
        "parentId": parent,
        "onclick": (info, tab) => { onClickUpdate(info, tab, { id: id }) }
    });
}

function createSizeContextMenu(parent, width, height) {
    return chrome.contextMenus.create({
        "title": width + "x" + height,
        "type": "radio",
        "contexts": ['all'],
        "parentId": parent,
        "onclick": (info, tab) => { onClickUpdate(info, tab, { width, height }) }
    });
}

function createStyleContextMenu(parent, title, style) {
    return chrome.contextMenus.create({
        "title": title,
        "type": "radio",
        "contexts": ['all'],
        "parentId": parent,
        "onclick": (info, tab) => { onClickUpdate(info, tab, { style }) }
    });
}

function createNormalContextMenu(parent, title, onclick) {
    return chrome.contextMenus.create({
        "title": title,
        "type": "normal",
        "contexts": ['all'],
        "parentId": parent,
        "onclick": onclick
    });
}

function createParentContextMenu(title) {
    return chrome.contextMenus.create({
        "title": title,
        "contexts": ['all'],
    });
}

function createContextMenus() {
    const parent = createParentContextMenu("Web Page Picture-in-Picture")
    createNormalContextMenu(parent, "Open", onClickOpen)
    createNormalContextMenu(parent, "Search", onClickSearch)
    createNormalContextMenu(parent, "Close", onClickClose)
    createModeContextMenus(parent)
    createSizeContextMenus(parent)
    createPositionContextMenus(parent)
}

createContextMenus();