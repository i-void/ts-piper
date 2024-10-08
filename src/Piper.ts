import { piper, type PiperType } from "./createPiper";
import { isNumber, isPresent, isSet } from "./typeChecks";

export class Piper<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  do<U>(callback: (value: T) => U) {
    return piper(callback(this.value));
  }
  
  doIf<TR, FR>({ condition, trueFn, falseFn }: { condition: (value: T) => boolean, trueFn: (value: T) => TR, falseFn: (value: T) => FR }) {
    if (condition(this.value)) {
      return piper(trueFn(this.value));
    } else {
      return piper(falseFn(this.value));
    }
  }

  debug() {
    console.log(this.value);
    return this;
  }

  isNull() {
    return piper(this.value === null);
  }

  isUndefined() {
    return piper(this.value === undefined);
  }

  isNone() {
    return piper(this.isNull().value || this.isUndefined().value);
  }

  isPresent() {
    return piper(!this.isNone());
  }

  existance<TR, FR>({ trueFn, falseFn }: { trueFn: (v: T) => TR, falseFn: (v: T) => FR }) {
    if (this.isPresent().value) {
      return piper(trueFn(this.value));
    } else {
      return piper(falseFn(this.value));
    }
  }

  presentSideEffect<U>(callback: (value: NonNullable<T>) => U) {
    if (isPresent(this.value)) {
      callback(this.value);
    }
    return this;
  }

  noneSideEffect<U>(callback: () => U) {
    if (this.isNone().value) {
      callback();
    }
    return this;
  }

  ensure(): PiperType<NonNullable<T>> {
    if (this.isNone().value) {
      throw new Error('Value is null or undefined');
    }
    return this as any;
  }
}
