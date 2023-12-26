import { WebMidi } from "webmidi";

export class Midi {
  noteEmitter;
  selectedInput;

  constructor(noteEmitter) {
    this.noteEmitter = noteEmitter;
    this.selectedInput = null;
  }

  /** Initialize MIDI. Note that we cannot do this in this constructor because
   * we need async for WebMidi.
   *
   * @callback displayControllers Callback to update displayed controllers.
   * @returns {void}
   */
  async initialize(displayControllers) {
    try {
      await WebMidi.enable();
      displayControllers(this.#getInputNames(), this.selectedInput?.name);

      WebMidi.addListener("connected", () => {
        displayControllers(this.#getInputNames(), this.selectedInput?.name);
      });

      WebMidi.addListener("disconnected", () => {
        displayControllers(this.#getInputNames(), this.selectedInput?.name);
      });
    } catch (err) {
      console.error("WebMidi could not be initialized:", err);
    }
  }

  /** Set the active controller by wiring it up to the note emitter.
   *
   * @param {string} name The name of the selected controller.
   * @returns {void}
   */
  setController(controller) {
    // Stop any active notes
    this.noteEmitter.emit("stopAll");

    // Remove listeners from the previous input
    if (this.selectedInput) {
      this.selectedInput.removeListener("noteon");
      this.selectedInput.removeListener("noteoff");
    }

    // Set the new input
    this.selectedInput = WebMidi.getInputByName(controller);

    // Add note on listener
    this.selectedInput.addListener("noteon", (event) => {
      const midiNote = event.note.number;
      this.noteEmitter.emit("play", { midiNote });
    });

    // Add note off listener
    this.selectedInput.addListener("noteoff", (event) => {
      const midiNote = event.note.number;
      this.noteEmitter.emit("stop", { midiNote });
    });
  }

  /** Get WebMidi input names.
   *
   * @returns {string[]} The input names.
   */
  #getInputNames() {
    return WebMidi.inputs.map((input) => input.name);
  }
}
