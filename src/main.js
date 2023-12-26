import "./style.css";
import * as ui from "./ui";
import { Midi } from "./midi";

const midi = new Midi(null);

function getStarted() {
  ui.getStarted();
  midi.initialize(displayControllers);
}

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
