import { Piper } from "./Piper";
import { piper } from "./createPiper";

export class NumberPiper extends Piper<number> {
  range(start = 0, step = 1) {
    return piper(Array.from({ length: this.value }, (_, i) => start + i * step));
  }
  
  isZero() {
    return piper(this.value === 0);
  }

  isPositive() {
    return piper(this.value > 0);
  }

  isNegative() {
    return piper(this.value < 0);
  }
  
  round(precision = 0) {
    const shifted = this.value * Math.pow(10, precision);
    return piper(Math.round(shifted) / Math.pow(10, precision));
  }
}