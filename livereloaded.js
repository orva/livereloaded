// State, contains tabs which have livereloading enabled.
let enabledTabs = []

const toolbarButtonHandler = tab => {
  enabledTabs.push(tab)
  browser.tabs.executeScript(tab.id, {
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