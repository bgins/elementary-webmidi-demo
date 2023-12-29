import Emittery from "emittery";

import "./style.css";
import * as ui from "./ui";
import { Engine } from "./audio/engine";
import { Midi } from "./midi";
import { Synth, computeFrequency } from "./audio/synth";

const noteEmitter = new Emittery();
const engine = new Engine();
const midi = new Midi(noteEmitter);
const synth = new Synth();

ui.init(getStarted);

// Play note and update indicators
noteEmitter.on("play", ({ midiNote }) => {
  engine.render(synth.playNote(midiNote));
  ui.setMIDINote(midiNote);
  ui.setFrequency(computeFrequency(midiNote));
});

// Stop note
noteEmitter.on("stop", ({ midiNote }) => {
  engine.render(synth.stopNote(midiNote));
});

// Stop all notes
noteEmitter.on("stopAll", () => {
  engine.render(synth.stopAllNotes());
});

/** Initialize WebMidi, web audio, and Elementary audio on
 * first user interaction. Display MIDI note and frequency
 * indicators.
 *
 * @returns {void}
 */
async function getStarted() {
  await midi.initialize(displayControllers);
  await engine.initialize();
  ui.getStarted();
}

/** Display available controllers and wire them up with
 * set controller event handlers.
 *
 * @param {string[]} controllers
 * @param {string} selectedController
 */
function displayControllers(controllers, selectedController) {
  ui.setControllers(controllers, selectedController, setController);
}

/** Set the active controller.
 *
 * @param {string} controller The selected controller.
 */
function setController(controller) {
  midi.setController(controller);
  ui.selectController(controller);
}
