import { Piper } from "./Piper";
import { piper } from "./createPiper";

export class BooleanPiper extends Piper<boolean> {
  doWhen<T,F>(trueFn: () => T, falseFn: () => F) {
    if (this.value) {
      return piper(trueFn());
    } else {
      return piper(falseFn());
    }
  }
}