(() => {
  const isLivereloadAvailable = (host, port) => {
    const req = new Request(`${host}:${port}/livereload.js`, {
      method: "HEAD",
      redirect: "follow"
    });

    return fetch(req).then(resp => resp.ok).catch(() => false);
  };

  const injectLivereload = () => {
    const host = "http://localhost";
    const port = 35729;

    return isLivereloadAvailable(host, port).then(isAvailable => {
      if (!isAvailable) {
        return;
      }

      const script = document.createElement("script");
      script.setAttribute("src", `${host}:${port}/livereload.js`);
      document.head.appendChild(script);
    });
  };

  browser.runtime.onMessage.addListener(msg => {
    switch (msg.command) {
      case "inject":
        injectLivereload();
        break;
      default:
        break;
    }
  });
})();
