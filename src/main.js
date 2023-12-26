import "./style.css";
import * as ui from "./ui.js";

function setController(name) {
  console.log("Setting controller: ", name);

  ui.selectController(name);
}

function getStarted() {
  ui.getStarted();
}

ui.init(getStarted);
ui.setMIDINote(2);
ui.setFrequency(440);
ui.setControllers(["Roland", "Arturia", "Korg"], "Roland", setController);
