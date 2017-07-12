// State, contains tabs which have livereloading enabled.
let enabledTabs = [];

const removeTabFromState = id => {
  // This should probably be redundant
  browser.browserAction.setBadgeText({ text: "", tabId: id });

  const newState = enabledTabs.filter(et => et.id !== id);
  enabledTabs = newState;
};

const storeTabToState = tab => {
  if (!enabledTabs.some(t => t.id === tab.id)) {
    enabledTabs.push(tab);
  }
};

const injectScript = tab => {
  storeTabToState(tab);
  browser.browserAction.setBadgeText({ text: "ON", tabId: tab.id });
  browser.browserAction.setBadgeBackgroundColor({
    color: "#1496bb",
    tabId: tab.id
  });

  return browser.tabs
    .executeScript(tab.id, {
      file: "livereload-script-tag-injector.js"
    })
    .then(() => browser.tabs.sendMessage(tab.id, { command: "inject" }));
};

const removeScript = tab => {
  removeTabFromState(tab.id);
  return browser.tabs.reload(tab.id);
};

const toggleLivereload = tab => {
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
