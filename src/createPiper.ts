import { ArrayPiper, NumberArrayPiper, StringArrayPiper } from "./ArrayPiper";
import { MapPiper } from "./MapPiper";
import { NumberPiper } from "./NumberPiper";
import { Piper } from "./Piper";
import { RecordPiper } from "./RecordPiper";
import { NumberSetPiper, SetPiper, StringSetPiper } from "./SetPiper";
import { StringPiper } from "./StringPiper";
import { isMap, isNumber, isRecord, isString } from "./typeChecks";

export type PiperType<T> =
  T extends string ? StringPiper & T :
  T extends number ? NumberPiper & T :
  T extends Array<string> ? StringArrayPiper :
  T extends Array<number> ? NumberArrayPiper :
  T extends Array<infer A> ? ArrayPiper<A> :
  T extends Set<string> ? StringSetPiper & T :
  T extends Set<number> ? NumberSetPiper & T:
  T extends Set<infer A> ? SetPiper<A> & T:
  T extends Map<infer K, infer V> ? MapPiper<K, V> & T:
  T extends Record<string, infer V> ? RecordPiper<V>:
  Piper<T>

// Factory function
export function piper<T>(value: T): PiperType<T> {
  if (isString(value)) {
    return new StringPiper(value).proxied() as any;
  } else if (isNumber(value)) {
    return new NumberPiper(value).proxied() as any;
  } else if (Array.isArray(value)) {
    if (isString(value[0])) {
      return new StringArrayPiper(value as string[]).proxied() as any;
    } else if (isNumber(value[0])) {
      return new NumberArrayPiper(value as number[]).proxied() as any
    } else {
      return new ArrayPiper(value).proxied() as any;
    }
  } else if (value instanceof Set) {
    if (isString(Array.from(value)[0])) {
      return new StringSetPiper(value as Set<string>).proxied() as any;
    } else if (isNumber(Array.from(value)[0])) {
      return new NumberSetPiper(value as Set<number>).proxied() as any;
    } else {
      return new SetPiper(value).proxied() as any;
    }
  } else if (isMap(value)) {
    return new MapPiper(value).proxied() as any;
  } else if (isRecord(value)) {
    return new RecordPiper(value).proxied() as any;
  } else {
    return new Piper(value) as any;
  }
}


