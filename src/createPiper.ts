import { ArrayPiper, NumberArrayPiper, StringArrayPiper } from "./ArrayPiper";
import { BooleanPiper } from "./BooleanPiper";
import { MapPiper } from "./MapPiper";
import { NumberPiper } from "./NumberPiper";
import { Piper } from "./Piper";
import { RecordPiper } from "./RecordPiper";
import { NumberSetPiper, SetPiper, StringSetPiper } from "./SetPiper";
import { StringPiper } from "./StringPiper";
import { isBool, isMap, isNumber, isRecord, isString } from "./typeChecks";

export type PiperType<T> =
  T extends boolean ? BooleanPiper :
  T extends string ? StringPiper :
  T extends number ? NumberPiper :
  T extends Array<string> ? StringArrayPiper :
  T extends Array<number> ? NumberArrayPiper :
  T extends Array<infer A> ? ArrayPiper<A> :
  T extends Set<string> ? StringSetPiper :
  T extends Set<number> ? NumberSetPiper:
  T extends Set<infer A> ? SetPiper<A>:
  T extends Map<infer K, infer V> ? MapPiper<K, V>:
  T extends Record<infer K, infer V> ? RecordPiper<K, V>:
  Piper<T>

// Factory function
export function piper<T>(value: T): PiperType<T> {
  if (isBool(value)) {
    return new BooleanPiper(value) as any;
  } else if (isString(value)) {
    return new StringPiper(value) as any;
  } else if (isNumber(value)) {
    return new NumberPiper(value) as any;
  } else if (Array.isArray(value)) {
    if (isString(value[0])) {
      return new StringArrayPiper(value as string[]) as any;
    } else if (isNumber(value[0])) {
      return new NumberArrayPiper(value as number[]) as any
    } else {
      return new ArrayPiper(value) as any;
    }
  } else if (value instanceof Set) {
    if (isString(Array.from(value)[0])) {
      return new StringSetPiper(value as Set<string>) as any;
    } else if (isNumber(Array.from(value)[0])) {
      return new NumberSetPiper(value as Set<number>) as any;
    } else {
      return new SetPiper(value) as any;
    }
  } else if (isMap(value)) {
    return new MapPiper(value) as any;
  } else if (isRecord(value)) {
    return new RecordPiper(value) as any;
  } else {
    return new Piper(value) as any;
  }
}


