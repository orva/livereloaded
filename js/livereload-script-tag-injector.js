const isURLAvailable = url => {
  const req = new Request(url, {
    method: "HEAD",
    redirect: "follow"
  });

  return fetch(req).then(resp => resp.ok).catch(() => false);
};

const getHostname = () => {
  const u = new URL(document.URL);
  return `${u.protocol}//${u.hostname}`;
};

const reportCouldNotConnect = url => {
  /* eslint-disable no-console */
  console.error(`livereloaded: could not find livereload script at ${url}
- check that livereload server is running
- check that livereload server port matches port in addon preferences`);
  /* eslint-enable no-console */
};

const injectLivereload = port => {
  const host = getHostname();
  const url = `${host}:${port}/livereload.js`;

  return isURLAvailable(url).then(isAvailable => {
    if (!isAvailable) {
      reportCouldNotConnect(url);
      return false;
    }

    const script = document.createElement("script");
    script.setAttribute("src", url);
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
