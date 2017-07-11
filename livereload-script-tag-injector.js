const injectLivereload = () => {
  const script = document.createElement("script")
  script.setAttribute("src", "http://localhost:35729/livereload.js")
  document.head.appendChild(script)
}

const removeLivereload = () => {
  const elems = document.querySelectorAll("script[src='http://localhost:35729/livereload.js']")
  elems.forEach(s => s.remove())
}

browser.runtime.onMessage.addListener(msg => {
  switch (msg.command) {
    case "inject":
      injectLivereload();
      break;
    case "remove":
      removeLivereload();
      break;
    default:
      break;
  }
})

true