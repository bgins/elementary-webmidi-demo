import Emittery from "emittery";

import "./style.css";
import * as ui from "./ui";
import { Engine } from "./audio/engine";
import { Midi } from "./midi";
import { Synth, computeFrequency } from "./audio/synth";

const noteEmitter = new Emittery();
const engine = new Engine();
const midi = new Midi(noteEmitter);
const synth = new Synth(noteEmitter);

ui.init(getStarted);

noteEmitter.on("play", ({ midiNote }) => {
  engine.render(synth.playNote(midiNote));
  ui.setMIDINote(midiNote);
  ui.setFrequency(computeFrequency(midiNote));
});
noteEmitter.on("stop", ({ midiNote }) => {
  engine.render(synth.stopNote(midiNote));
});

async function getStarted() {
  await midi.initialize(displayControllers);
  await engine.initialize();
  ui.getStarted();
}

function setController(controller) {
  console.log("Setting controller: ", controller);

  midi.setController(controller);
  ui.selectController(controller);
}

function displayControllers(controllers, selectedController) {
  ui.setControllers(controllers, selectedController, setController);
}
