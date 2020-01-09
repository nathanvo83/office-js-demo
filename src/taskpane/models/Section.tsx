import { WordTypeCount } from "./WordTypeCount";

export class Section {
  public title: string;
  public content: string[];
  public wordTypeCount: WordTypeCount;
  constructor() {
    this.title = "";
    this.content = [];
    this.wordTypeCount = new WordTypeCount();
  }
}
