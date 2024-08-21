import { Piper } from "./Piper";

export class StringPiper extends Piper<string> {
  chars(): string[] {
    return this.value.split('');
  }
}