const prefs = require("./preferences.js");

// State, contains tabs which have livereloading enabled. This needs to stored
// (globally) in background script, as `livereload.js` script does what name
// says: it reloads the tab, trashing all state inside.
let enabledTabs = [];

const removeTabFromState = id => {
  const newState = enabledTabs.filter(et => et.id !== id);
  enabledTabs = newState;
};

const storeTabToState = tab => {
  if (!enabledTabs.some(t => t.id === tab.id)) {
    enabledTabs.push(tab);
  }
};

const toggleButtonState = tab => {
  const ON_TEXT = "ON";
  browser.browserAction.setBadgeBackgroundColor({
    color: "#1496bb",
    tabId: tab.id
  });

  return browser.browserAction
    .getBadgeText({ tabId: tab.id })
    .then(badgeText => {
      if (badgeText === ON_TEXT) {
        browser.browserAction.setBadgeText({ text: "", tabId: tab.id });
        browser.browserAction.setTitle({
          title: "Enable livereload",
          tabId: tab.id
        });
      } else {
        browser.browserAction.setBadgeText({ text: "ON", tabId: tab.id });
        browser.browserAction.setTitle({
          title: "Disable livereload",
          tabId: tab.id
        });
      }
    });
};

const injectScript = tab => {
  storeTabToState(tab);

  return browser.tabs
    .executeScript(tab.id, {
      file: "livereload-script-tag-injector.js"
    })
    .then(() => prefs.fetchDefaultPort())
    .then(port => browser.tabs.sendMessage(tab.id, { command: "inject", port }))
    .then(injectWasSuccesful => {
      if (!injectWasSuccesful) {
        toggleButtonState(tab);
        removeTabFromState(tab.id);
      }

      return true;
    });
};

const removeScript = tab => {
  removeTabFromState(tab.id);
  return browser.tabs.reload(tab.id);
};

const toggleLivereload = tab => {
  toggleButtonState(tab);

  if (enabledTabs.some(t => t.id === tab.id)) {
    return removeScript(tab);
  } else {
    return injectScript(tab);
  }
};

const tabChangedHandler = (id, changedInfo) => {
  const tab = enabledTabs.find(et => et.id === id);
  if (!tab || changedInfo.status !== "complete") {
    return;
  }

  return injectScript(tab);
};

browser.browserAction.onClicked.addListener(toggleLivereload);
browser.tabs.onRemoved.addListener(removeTabFromState);
browser.tabs.onUpdated.addListener(tabChangedHandler);
