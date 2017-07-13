const prefs = require("./preferences.js");

const restoreFromStorege = () =>
  prefs.fetchDefaultPort().then(port => {
    const portInput = document.getElementsByClassName("default-port-input")[0];
    portInput.value = port;
  });

const bindListeners = () => {
  const portInput = document.getElementsByClassName("default-port-input")[0];
  portInput.addEventListener("input", e => {
    const val = e.target.value;

    const containsNonDigits = /\D+/.test(val);
    if (val === "" || containsNonDigits) {
      portInput.classList.add("broken-input");
      return;
    }

    portInput.classList.remove("broken-input");
    const port = parseInt(val, 10);
    return prefs.setDefaultPort(port);
  });

  const reset = document.getElementsByClassName("reset-port-button")[0];
  reset.addEventListener("click", () =>
    prefs
      .setDefaultPort(prefs.DEFAULT_PORT)
      .then(port => (portInput.value = port))
  );
};

document.addEventListener("DOMContentLoaded", () =>
  restoreFromStorege().then(() => bindListeners())
);
