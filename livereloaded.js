
const toolbarButtonHandler = tab => {
  browser.tabs.executeScript({
    file: 'livereload-script-tag-injector.js'
  })
}

browser.browserAction.onClicked.addListener(toolbarButtonHandler)