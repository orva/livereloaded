const prefs = require("./preferences.js");

// State, contains tabs which have livereloading enabled. This needs to stored
// (globally) in background script, as `livereload.js` script does what name
// says: it reloads the tab, trashing all state inside.
//
// From this addons point of view tab can be in three possible states:
//
// 1. livereloaded content script is active in tab and livereload script is injected to the DOM
//    (tab is stored to the enabledTabs with livereloadInjected: true)
// 2. livereloaded content script is active in the tab, but livereload script could not be injected
//    (tab is stored to the enabledTabs with livereloadInjected:false)
// 3. tab is not relevant for this addon
//
// Each entry in enabledTabs is object in form of:
// { tab: browser.tabs.Tab, livereloadInjected: bool }
let enabledTabs = [];

const removeTabFromState = id => {
  const newState = enabledTabs.filter(et => et.tab.id !== id);
  enabledTabs = newState;
};

const storeTabToState = tab => {
  if (!enabledTabs.some(t => t.tab.id === tab.id)) {
    enabledTabs.push({ tab, livereloadInjected: false });
    return true;
  }

  return false;
};

const toggleButtonState = tab => {
  browser.browserAction.setBadgeBackgroundColor({
    color: "#1496bb",
    tabId: tab.id
  });

  const tabInfo = enabledTabs.find(et => et.tab.id === tab.id);
  const tabIsOn = tabInfo && tabInfo.livereloadInjected;

  if (tabIsOn) {
    browser.browserAction.setBadgeText({ text: "ON", tabId: tab.id });
    browser.browserAction.setTitle({
      title: "Disable livereload",
      tabId: tab.id
    });
  } else {
    browser.browserAction.setBadgeText({ text: "", tabId: tab.id });
    browser.browserAction.setTitle({
      title: "Enable livereload",
      tabId: tab.id
    });
  }
};

const startContentScript = tab => {
  const tabRequiresContentScript = storeTabToState(tab);

  return tabRequiresContentScript
    ? browser.tabs
        .executeScript(tab.id, {
          file: "livereload-script-tag-injector.js"
        })
        .then(() => true)
    : Promise.resolve(false);
};

const injectLivereloadScript = tab => {
  return startContentScript(tab)
    .then(() => prefs.fetchDefaultPort())
    .then(port => browser.tabs.sendMessage(tab.id, { command: "inject", port }))
    .then(injectWasSuccesful => {
      if (injectWasSuccesful) {
        const tabState = enabledTabs.find(et => et.tab.id === tab.id);
        tabState.livereloadInjected = true;
      }

      return true;
    });
};

const removeLivereloadScript = tab => {
  removeTabFromState(tab.id);
  return browser.tabs.reload(tab.id);
};

const toggleLivereload = tab => {
  const tabState = enabledTabs.find(t => t.tab.id === tab.id);
  if (tabState && tabState.livereloadInjected) {
    return removeLivereloadScript(tab).then(() => toggleButtonState(tab));
  } else {
    return injectLivereloadScript(tab).then(() => toggleButtonState(tab));
  }
};

const tabChangedHandler = (id, changedInfo) => {
  const tabState = enabledTabs.find(et => et.tab.id === id);
  if (!tabState || changedInfo.status !== "complete") {
    return;
  }

  removeTabFromState(id);
  return injectLivereloadScript(tabState.tab).then(() =>
    toggleButtonState(tabState.tab)
  );
};

browser.browserAction.onClicked.addListener(toggleLivereload);
browser.tabs.onRemoved.addListener(removeTabFromState);
browser.tabs.onUpdated.addListener(tabChangedHandler);
