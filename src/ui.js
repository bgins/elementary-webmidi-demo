/**
 * Initialize by adding event handler to get started button.
 *
 * @callback handler Click and keypress get started event handler.
 * @returns {void}
 */
export function init(handler) {
  const getStartedButton = document.querySelector("#get-started-button");
  getStartedButton.addEventListener("click", () => handler());
  getStartedButton.addEventListener("keypress", () => handler());
}

/**
 * Remove get started section and replace it with indicators
 *
 * @returns {void}
 */
export function getStarted() {
  document.querySelector("#get-started").remove();
  document.querySelector("#indicators").style.display = "grid";
}

/**
 * Sets the displayed MIDI note.
 *
 * @param {number} note The MIDI note number.
 * @returns {void}
 */
export function setMIDINote(note) {
  document.querySelector("#midi-note").textContent = note.toString();
}

/**
 * Sets the displayed frequency.
 *
 * @param {number} freq The frequency value.
 * @returns {void}
 */
export function setFrequency(freq) {
  document.querySelector("#frequency").textContent = freq.toString();
}

/**
 * Sets displayed MIDI controllers.
 *
 * @param {string[]} controllers The controller names.
 * @param {string|null} selectedController The selected controller name.
 * @callback handler Click and keypress event handler.
 * @returns {void}
 */
export function setControllers(controllers, selectedController, handler) {
  const controllerButtons = controllers.map((name) => {
    let button = document.createElement("button");
    button.textContent = name;
    button.addEventListener("click", () => handler(name));
    button.addEventListener("keypress", () => handler(name));

    if (selectedController && selectedController === name) {
      button.style.backgroundColor = "#d70d75";
    }

    return button;
  });

  document.querySelector("#controllers").replaceChildren(...controllerButtons);
}

/**
 * Update selected controller background color.
 *
 * Also updates backgrounds of other controllers to unselected color.
 *
 * @param {string} name The name of the selected controller.
 * @returns {void}
 */
export function selectController(name) {
  let controllerButtons = document.querySelector("#controllers").children;

  Array.from(controllerButtons).map((button) => {
    if (button.textContent === name) {
      button.style.backgroundColor = "#d70d75";
    } else {
      button.style.backgroundColor = "#1a1a1a";
    }
  });
}
