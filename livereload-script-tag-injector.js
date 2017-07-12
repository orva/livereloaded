(() => {
  const injectLivereload = () => {
    const script = document.createElement("script")
    script.setAttribute("src", "http://localhost:35729/livereload.js")
    document.head.appendChild(script)
  }

  browser.runtime.onMessage.addListener(msg => {
    switch (msg.command) {
      case "inject":
        injectLivereload();
        break;
      default:
        break;
    }
  })
})()