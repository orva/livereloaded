(() => {
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

  const injectLivereload = port => {
    const host = getHostname();
    const url = `${host}:${port}/livereload.js`;

    return isURLAvailable(url).then(isAvailable => {
      if (!isAvailable) {
        return;
      }

      const script = document.createElement("script");
      script.setAttribute("src", url);
      document.head.appendChild(script);
    });
  };

  browser.runtime.onMessage.addListener(msg => {
    switch (msg.command) {
      case "inject":
        injectLivereload(msg.port);
        break;
      default:
        break;
    }
  });
})();
