import { ElemNode } from "@elemaudio/core";
import WebRenderer from "@elemaudio/web-renderer";

export class Engine {
  context;
  core;

  constructor() {
    this.core = new WebRenderer();
    this.context = new AudioContext();
    this.context.suspend();
  }

  /** Initialize Elementary web renderer and web audio context.
   *
   * @returns {void}
   */
  async initialize() {
    // Start the audio context
    this.context.resume();

    // Initialize web renderer
    const node = await this.core.initialize(this.context, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });

    // Connect web renderer to audio context
    node.connect(this.context.destination);
  }

  /** Render audio channel.
   *
   * @param {ElemNode} channel Channel with voices to render.
   * @returns {void}
   */
  render(channel) {
    if (this.context.state === "running") {
      this.core.render(channel);
    }
  }
}
