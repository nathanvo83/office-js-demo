import { WordTypeCount } from "./WordTypeCount";
import { Section } from "./Section";

export class Result {
  public list: Section[];
  public total: WordTypeCount;
  // public isUpdated: boolean;

  constructor() {
    this.list = [];
    this.total = new WordTypeCount();
    // this.isUpdated = false;
  }
}
