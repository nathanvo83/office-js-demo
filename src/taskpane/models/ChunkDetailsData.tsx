import { Section } from "./Section";

export class ChunkDetailsData {
  public data: Section;
  public isShow: boolean;
  public idx: number;

  constructor(idx: number = 0, isShow: boolean = false, data: Section = new Section()) {
    this.idx = idx;
    this.isShow = isShow;
    this.data = data;
  }
}
