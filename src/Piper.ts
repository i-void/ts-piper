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

  whenPresent<U>(callback: (value: NonNullable<T>) => U) {
    if (isPresent(this.value)) {
      callback(this.value);
    }
    return this;
  }

  whenNone<U>(callback: () => U) {
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

  proxied() {
    return new Proxy(this, {
      get: function (target, prop, receiver) {
        if (prop in target) {
          return (target as any)[prop];
        }

        if (typeof target.value === 'object' && target.value !== null && prop in target.value) {
          const result = (target.value as any)[prop];
          return prop === 'value' ? result : piper(result);
        }
        if (typeof target.value[prop as keyof T] === 'function') {
          return function (...args: any[]) {
            return (target.value[prop as keyof T] as Function).apply(target.value, args);
          };
        }

        const indexProp = parseInt(prop.toString())
        if (isSet(target.value) && isNumber(indexProp)) {
          return piper([...target.value][indexProp]);
        }
        return target.value[prop as keyof T];
      }
    }) as typeof this & T;
  }
}
