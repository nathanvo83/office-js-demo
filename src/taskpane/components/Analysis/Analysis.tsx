import { wordData } from "../../database/wordData";
import { setting } from "../../constants/Setting";
import { Section } from "../../models/Section";
import { Result } from "../../models/Result";
import { WordTypeCount } from "../../models/WordTypeCount";

export class Analysis {
  // private previousData: string[];
  // private previousText: string;
  private previousLength: number;

  constructor() {
    // this.previousData = [];
    // this.previousText = "";
    this.previousLength = 0;
  }

  wordCount(item: string) {
    return Math.round(item.length / 10);
  }

  getSectionTitle(section: Section) {
    let title = "---";
    let i = 0;
    while (i < section.content.length && title === "---") {
      let temp = section.content[i].trim();
      if (temp !== "") {
        let end = temp.indexOf(" ", 30) === -1 ? temp.length : temp.indexOf(" ", 30);
        title = temp.substring(0, end) + "...";
      }
      i++;
    }
    return title;
  }

  split(data: string[]) {
    let total = 0;
    let section: Section = new Section();

    let result: Result = new Result();

    data.map(item => {
      total += this.wordCount(item);
      section.content.push(item);

      if (total > setting.minWord) {
        section.title = this.getSectionTitle(section);

        result.list.push(section);

        total = 0;
        section = new Section();
      }
    });

    if (section.content.length > 0) {
      section.title = this.getSectionTitle(section);
      result.list.push(section);
    }

    return result;
  }

  calculator(data: string[]) {
    let _verb = 0;
    let _waste = 0;
    let _noun = 0;
    let _prep = 0;

    data.map(item => {
      if (item) {
        item.split(" ").forEach(word => {
          let term = word.toLowerCase();

          // verbs
          wordData.verbTokenRegex.forEach(verb => {
            if (term.endsWith(verb) === true) {
              _verb += 1;
            }
          });
          wordData.verbTokenMatch.forEach(verb => {
            if (term === verb) {
              _verb += 1;
            }
          });

          // nouns
          wordData.nounTokenRegex.forEach(noun => {
            if (term.endsWith(noun) === true) {
              _noun += 1;
            }
          });
          wordData.nounExceptionMatch.forEach(noun => {
            if (term === noun) {
              _noun += 1;
            }
          });

          // adj
          wordData.adjTokenRegex.forEach(prep => {
            if (term.endsWith(prep) === true) {
              _prep += 1;
            }
          });

          wordData.adjectiveAdverbExceptionMatch.forEach(prep => {
            if (term === prep) {
              _prep += 1;
            }
          });
          wordData.prepositionTokenMatch.forEach(prep => {
            if (term === prep) {
              _prep += 1;
            }
          });

          // waste
          wordData.wasteWordTokenMatch.forEach(waste => {
            if (term === waste) {
              _waste += 1;
            }
          });
        });
      }
    });

    let wtc = new WordTypeCount(_verb, _noun, _prep, _waste);

    return wtc;
  }

  // isPreviousData(newData: string[]) {
  //   if (newData.length !== this.previousData.length) {
  //     console.log("length difference...");
  //     return false;
  //   } else {
  //     for (let i = 0; i < newData.length; i++) {
  //       if (newData[i].localeCompare(this.previousData[i]) !== 0) {
  //         console.log("item data difference");
  //         return false;
  //       }
  //     }
  //   }
  //   return true;
  // }

  //   isTextChange(text) {
  //     if (this.previousText.localeCompare(text) !== 0) {
  //       console.log("text change");
  //       this.previousText = text;
  //       return true;
  //     }
  //     console.log("text does not change");
  //     return false;
  //   }

  isTextChange(text: string) {
    if (text.length !== this.previousLength) {
      console.log("text change");
      this.previousLength = text.length;
      return true;
    }
    console.log("text does not change");
    return false;
  }

  process(data: string[]) {
    let result: Result = new Result();

    // if (this.isPreviousData(data) === true) {
    //   result.isUpdated = false;
    // } else {
    result = this.split(data);
    let total = new WordTypeCount();

    result.list.map(item => {
      let wtc = this.calculator(item.content);
      item.wordTypeCount = wtc;

      total.noun += wtc.noun;
      total.prep += wtc.prep;
      total.verb += wtc.verb;
      total.waste += wtc.waste;
    });

    result.total = total;
    // result.isUpdated = true;
    // this.previousData = data;
    // }

    return result;
  }
}
