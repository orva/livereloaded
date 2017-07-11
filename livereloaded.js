// State, contains tabs which have livereloading enabled.
let enabledTabs = []

const injectScript = tabId =>
  browser.tabs.executeScript(tabId, {
    file: 'livereload-script-tag-injector.js'
  })
  .then(() => browser.tabs.sendMessage(tabId, { command: "inject" }))

const toolbarButtonHandler = tab => {
  if (enabledTabs.some(t => t.id === tab.id)) {
    return
  }

  enabledTabs.push(tab)

  browser.browserAction.setBadgeText({ text: "ON", tabId: tab.id })
  browser.browserAction.setBadgeBackgroundColor({ color: "#1496bb", tabId: tab.id })

  return injectScript(tab.id)
}

const tabRemovedHandler = id => {
  const newState = enabledTabs.filter(et => et.id !== id)
  enabledTabs = newState
}

const tabChangedHandler = (id, changedInfo) => {
  const et = enabledTabs.find(et => et.id === id)
  if (!et || changedInfo.status === 'loading') {
    return
  }

  return injectScript(et.id)
}

browser.browserAction.onClicked.addListener(toolbarButtonHandler)
browser.tabs.onRemoved.addListener(tabRemovedHandler)
browser.tabs.onUpdated.addListener(tabChangedHandler)