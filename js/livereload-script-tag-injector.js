const isURLAvailable = url => {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();

    xhr.timeout = 1000;
    xhr.onerror = () => resolve(false);
    xhr.ontimeout = () => resolve(false);
    xhr.onload = () => (xhr.status === 200 ? resolve(true) : resolve(false));

    xhr.open("HEAD", url);
    xhr.send();
  });
};

const getHostname = () => {
  const { protocol, hostname } = new URL(document.URL);
  return { protocol, hostname };
};

const reportCouldNotConnect = url => {
  /* eslint-disable no-console */
  console.error(`livereloaded: could not find livereload script at ${url}
- check that livereload server is running
- check that livereload server port matches port in addon preferences`);
  /* eslint-enable no-console */
};

const injectLivereload = port => {
  const { protocol, hostname } = getHostname();
  const serverScriptUrl = `${protocol}//${hostname}:${port}/livereload.js`;

  return isURLAvailable(serverScriptUrl).then(isAvailable => {
    if (!isAvailable) {
      reportCouldNotConnect(`${protocol}//${hostname}`);
      return false;
    }

    const scriptUrl = browser.runtime.getURL("lib/livereload.js");
    const optedScriptUrl = `${scriptUrl}?host=${hostname}&port=${port}`;
    const script = document.createElement("script");
    script.setAttribute("src", optedScriptUrl);

    document.head.appendChild(script);

    return true;
  });
};

browser.runtime.onMessage.addListener(msg => {
  switch (msg.command) {
    case "inject":
      return injectLivereload(msg.port);
    default:
      return false;
  }
});
