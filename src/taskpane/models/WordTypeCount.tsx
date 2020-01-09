export class WordTypeCount {
  public verb: number;
  public noun: number;
  public prep: number;
  public waste: number;

  constructor(verb = 0, noun = 0, prep = 0, waste = 0) {
    this.noun = noun;
    this.prep = prep;
    this.verb = verb;
    this.waste = waste;
  }
}
