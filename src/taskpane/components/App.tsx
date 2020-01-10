import * as React from "react";
import { connect } from "react-redux";
import { Button, ButtonType } from "office-ui-fabric-react";
import Progress from "./Progress";

import ChunkList from "./ChunkList/ChunkList";
import ChunkDetails from "./ChunkDetails/ChunkDetails";
import { Analysis } from "./Analysis/Analysis";
import { Result } from "../models/Result";
import { ChunkDetailsData } from "../models/ChunkDetailsData";
// import { Timer } from "../Utils/Timer";
import { types } from "../constants/types";
import { Section } from "../models/Section";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;

  // redux
  chunkDetailsData: ChunkDetailsData;
  setChunkDetailsData;
}

export interface AppState {
  isLoad: boolean;
  result: Result;
  // time: string;
  // text: string;
}

class App extends React.Component<AppProps, AppState> {
  private timerID;
  private aliveId;
  private analysis: Analysis;
  private flagRuning: boolean = false;

  constructor(props, context) {
    super(props, context);
    this.analysis = new Analysis();
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
    clearInterval(this.aliveId);
  }

  componentDidMount() {
    this.setState({
      isLoad: false,
      result: new Result()
      // text: "---"
    });

    // this.aliveId = setInterval(this.keepAlive, 1000);

    this.subcribeToEvent();
    this.timerID = setTimeout(this.updateAppContent);
  }

  detectChange = async context => {
    let body = context.document.body;
    context.load(body, "text");
    await context.sync();

    return this.analysis.isTextChange(body.text);
  };

  getWordDocument = async context => {
    let paragraphs = context.document.body.paragraphs;
    context.load(paragraphs, "text");
    await context.sync();
    var result = [];
    paragraphs.items.map(item => {
      result.push(item.text);
    });
    return result;
  };

  setCompleted = () => {
    this.setState({ isLoad: false }, () => {
      this.showTime("completed");
      this.flagRuning = false;
    });
  };

  setLoading = () => {
    this.setState({ isLoad: true }, () => {
      this.flagRuning = true;
      this.showTime("loading");
    });
  };

  updateChunkDetails = (result: Result) => {
    const { chunkDetailsData, setChunkDetailsData } = this.props;
    if (chunkDetailsData.isShow === true) {
      chunkDetailsData.data = result.list[chunkDetailsData.idx] || new Section();
      setChunkDetailsData(chunkDetailsData);
    }
  };

  process = () => {
    if (this.flagRuning === false) {
      Word.run(async context => {
        let flag = await this.detectChange(context);
        console.log("result detect ->", flag);
        if (flag === true) {
          this.setLoading();
          let data = await this.getWordDocument(context);
          // process
          let result: Result = this.analysis.process(data);
          this.updateChunkDetails(result);

          this.setState(
            {
              result: result
            },
            this.setCompleted
          );
        }
      });
    }
  };

  updateAppContent = async () => {
    clearTimeout(this.aliveId);
    this.aliveId = setTimeout(this.process, 2000);
  };

  showTime = (title: string) => {
    let d = new Date();
    console.log(title, d.toString());
  };

  refreshHandler = () => {
    this.updateAppContent();
  };

  subcribeToEvent = async () => {
    await window.Office.onReady(() => {
      Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, this.updateAppContent);
    });
  };

  testHandler = () => {
    Word.run(async context => {
      // Queue a command to search the document and ignore punctuation.
      var searchResults = context.document.body
        .search(
          "Padraig became an altar boy, wearing white surplice over red cassock, small Celtic cross dangling from a chain around his neck.",
          { ignorePunct: true }
        )
        .getFirst();

      // var searchResults = context.document.body.search(
      //   "Padraig became an altar boy, wearing white surplice over red cassock, small Celtic cross dangling from a chain around his neck.",
      //   { ignorePunct: true }
      // );

      // Queue a command to load the search results and get the font property values.
      // context.load(searchResults, "font");
      searchResults.select("Select");
      await context.sync();

      // Synchronize the document state by executing the queued commands,
      // and return a promise to indicate task completion.
      // return context.sync().then(function() {
      //   console.log("Found count: " + searchResults.items.length);

      //   // Queue a set of commands to change the font for each found item.
      //   for (var i = 0; i < searchResults.items.length; i++) {
      //     searchResults.items[i].font.color = "purple";
      //     searchResults.items[i].font.highlightColor = "#FFFF00"; //Yellow
      //     searchResults.items[i].font.bold = true;
      //   }

      // Synchronize the document state by executing the queued commands,
      // and return a promise to indicate task completion.
      //   return context.sync();
      // });
    }).catch(function(error) {
      console.log("Error: " + JSON.stringify(error));
      if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
      }
    });

    // Word.run(async context => {
    //   var range = context.document.getSelection().getTextRanges([" "], true);
    //   context.load(range, "text");
    //   await context.sync();

    //   console.log("range:", range);
    // });

    // Word.run(function(context) {
    //   var range = context.document.getSelection();
    //   range.select("Select");
    //   return context.sync();
    // });

    // Word.run(function(context) {
    //   var words = context.document.getSelection().getTextRanges([" "], true);
    //   context.load(words, ["text", "font"]);
    //   var boldRanges = [];
    //   return context
    //     .sync()
    //     .then(function() {
    //       for (var i = 0; i < words.items.length; ++i) {
    //         var word = words.items[i];
    //         if (word.font.bold) boldRanges.push(word);
    //       }
    //     })
    //     .then(function() {
    //       for (var j = 0; j < boldRanges.length; ++j) {
    //         boldRanges[j].font.highlightColor = "#FF00FF";
    //       }
    //     });
    // });
  };

  renderDetails() {
    const { chunkDetailsData } = this.props;
    return (
      <div>
        <h3>total section {chunkDetailsData.idx}</h3>
        <div>noun: {chunkDetailsData.data.wordTypeCount.noun}</div>
        <div>verb: {chunkDetailsData.data.wordTypeCount.verb}</div>
        <div>prep: {chunkDetailsData.data.wordTypeCount.prep}</div>
        <div>waste: {chunkDetailsData.data.wordTypeCount.waste}</div>
        <ChunkDetails chunkData={this.props.chunkDetailsData}></ChunkDetails>
      </div>
    );
  }

  renderMaster() {
    //
    return (
      <div>
        <h3>total</h3>
        <div>noun: {this.state.result.total.noun}</div>
        <div>verb: {this.state.result.total.verb}</div>
        <div>prep: {this.state.result.total.prep}</div>
        <div>waste: {this.state.result.total.waste}</div>
        <ChunkList list={this.state.result.list}></ChunkList>
      </div>
    );
  }

  render() {
    const { title, isOfficeInitialized, chunkDetailsData } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }
    return (
      <div>
        <div>
          {/* {this.state.text} */}
          {this.state.isLoad === false ? "completed" : "loading"} - {this.state.result.list.length}
        </div>
        <Button
          className="ms-welcome__action"
          buttonType={ButtonType.hero}
          iconProps={{ iconName: "ChevronRight" }}
          onClick={this.refreshHandler}
          disabled={this.state.isLoad}
        >
          Refresh
        </Button>

        <Button onClick={this.testHandler}>Test</Button>
        <hr></hr>

        {chunkDetailsData.isShow === false ? this.renderMaster() : this.renderDetails()}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setChunkDetailsData: chunkDetailsData => {
    dispatch({
      type: types.SET_CHUNK,
      chunkDetailsData: chunkDetailsData
    });
  }
});

const mapStateToProps = ({ chunkDetailsData }) => ({ chunkDetailsData });

export default connect(mapStateToProps, mapDispatchToProps)(App);

// const mapStateToProps = ({ isChunkDetails, chunkDetailsData }) => ({ isChunkDetails, chunkDetailsData });
// const mapStateToProps = ({ chunkDetailsData }) => ({ chunkDetailsData });

// export default connect(mapStateToProps)(App);
