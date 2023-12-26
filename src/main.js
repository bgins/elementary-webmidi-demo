import Emittery from "emittery";

import "./style.css";
import * as ui from "./ui";
import { Midi } from "./midi";

const noteEmitter = new Emittery();
const midi = new Midi(noteEmitter);

function getStarted() {
  ui.getStarted();
  midi.initialize(displayControllers);
}

noteEmitter.on("play", ({ midiNote }) => {
  console.log("note on: ", midiNote);
});
noteEmitter.on("stop", ({ midiNote }) => {
  console.log("note off: ", midiNote);
});

function setController(controller) {
  console.log("Setting controller: ", controller);

  midi.setController(controller);
  ui.selectController(controller);
}

function displayControllers(controllers, selectedController) {
  ui.setControllers(controllers, selectedController, setController);
}

ui.init(getStarted);
ui.setMIDINote(2);
ui.setFrequency(440);
