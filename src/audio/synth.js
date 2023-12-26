import { el } from "@elemaudio/core";

export class Synth {
  voices = [];

  /** Play a note. Adds note to voices and limits polyphony
   * to eight voices by dropping oldest voices.
   *
   * @param {number} midiNote The note to play.
   * @returns {ElemNode}
   */
  playNote(midiNote) {
    const key = `v${midiNote}`;
    const freq = computeFrequency(midiNote);

    // Add note to voices after removing previous instances.
    this.voices = this.voices
      .filter((voice) => voice.key !== key)
      .concat({ gate: 1, freq, key })
      .slice(-8);

    return synth(this.voices);
  }

  /** Stop a note. Return silence if last note.
   *
   * @param {number} midiNote The note to stop.
   * @returns {ElemNode}
   */
  stopNote(midiNote) {
    const key = `v${midiNote}`;
    this.voices = this.voices.filter((voice) => voice.key !== key);

    if (this.voices.length > 0) {
      return synth(this.voices);
    } else {
      return silence();
    }
  }

  /** Remove all voices and return silence.
   *
   * @returns {ElemNode}
   */
  stopAllNotes() {
    this.voices = [];
    return silence();
  }
}

/** Compute frequency using 12-tone equal temperament.
 *
 * @param {number} midiNote
 * @returns {number}
 */
export function computeFrequency(midiNote) {
  return 440 * 2 ** ((midiNote - 69) / 12);
}

/** Sum voices and reduce overall amplitude.
 *
 * @param {ElemNode} voices
 * @returns {ElemNode}
 */
function synth(voices) {
  return el.mul(el.add(...voices.map((voice) => synthVoice(voice))), 0.1);
}

/** Create a single saw voice with a key, gate, and frequency.
 *
 * @param {number} voice.gate The voice gate, expected to be 0 or 1.
 * @param {number} voice.freq The voice frequency.
 * @param {string} voice.key The node key. Associated with the MIDI note, for example "v69".
 * @returns {ElemNode}
 */
function synthVoice(voice) {
  return el.mul(
    el.const({ key: `${voice.key}:gate`, value: voice.gate }),
    el.blepsaw(el.const({ key: `${voice.key}:freq`, value: voice.freq })),
  );
}

/** Create silence. We render silence when no voices are active.
 *
 * @returns {ElemNode}
 */
function silence() {
  return el.const({ key: "silence", value: 0 });
}
