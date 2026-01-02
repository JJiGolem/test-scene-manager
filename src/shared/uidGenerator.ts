import { NumberUID, UID } from "./uid";

export interface IUidGenerator<T extends UID<any>> {
  generate(): T
}

export class NumberUIDGenerator implements IUidGenerator<NumberUID> {
  private counter: number = 0;

  public generate(): NumberUID {
    return new NumberUID(++this.counter);
  }
}