// State, contains tabs which have livereloading enabled.
let enabledTabs = []

const toolbarButtonHandler = tab => {
  if (enabledTabs.some(t => t.id === tab.id)) {
    return
  }

  enabledTabs.push(tab)

  browser.browserAction.setBadgeText({ text: "ON", tabId: tab.id })
  browser.browserAction.setBadgeBackgroundColor({ color: "#1496bb", tabId: tab.id })

  return browser.tabs.executeScript(tab.id, {
    file: 'livereload-script-tag-injector.js'
  })
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

  browser.tabs.executeScript(et.id, {
    file: 'livereload-script-tag-injector.js'
  })
}

browser.browserAction.onClicked.addListener(toolbarButtonHandler)
browser.tabs.onRemoved.addListener(tabRemovedHandler)
browser.tabs.onUpdated.addListener(tabChangedHandler)