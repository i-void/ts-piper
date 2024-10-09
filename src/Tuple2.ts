export class Tuple2<A, B> {
  static new<A, B>(a: A, b: B) {
    return new Tuple2(a, b);
  }

  static from<A, B>(arr: [A, B]) {
    return new Tuple2(arr[0], arr[1]);
  }

  constructor(public readonly a: A, public readonly b: B) {}
  
  toArray(): [A, B] {
    return [this.a, this.b];
  }

  mapFirst<C>(fn: (a: A) => C): Tuple2<C, B> {
    return new Tuple2(fn(this.a), this.b);
  }

  mapSecond<C>(fn: (b: B) => C): Tuple2<A, C> {
    return new Tuple2(this.a, fn(this.b));
  }

  map<C, D>(fn: (a: A, b: B) => [C, D]): Tuple2<C, D> {
    return Tuple2.from(fn(this.a, this.b));
  }

  setFirst<C>(a: C): Tuple2<C, B> {
    return new Tuple2(a, this.b);
  }

  setSecond<C>(b: C): Tuple2<A, C> {
    return new Tuple2(this.a, b);
  }

  first(): A {
    return this.a;
  }

  second(): B {
    return this.b;
  }
}