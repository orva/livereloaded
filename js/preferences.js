const DEFAULT_PORT = 35729;

const fetchDefaultPort = () =>
  browser.storage.sync
    .get("defaultPort")
    .then(d => d.defaultPort || DEFAULT_PORT);

const setDefaultPort = port => {
  const defaultPort = port || DEFAULT_PORT;
  return browser.storage.sync.set({ defaultPort }).then(() => defaultPort);
};

module.exports = {
  DEFAULT_PORT,
  fetchDefaultPort,
  setDefaultPort
};
