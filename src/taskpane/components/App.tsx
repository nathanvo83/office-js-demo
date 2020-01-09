import * as React from "react";
import { connect } from "react-redux";
import { delay } from "redux-saga/effects";

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
  time: string;
  text: string;
}

class App extends React.Component<AppProps, AppState> {
  private timerID;
  private analysis: Analysis;
  private flagRuning: boolean = false;

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  componentDidMount() {
    this.analysis = new Analysis();

    const d = new Date();
    this.setState({
      isLoad: false,
      result: new Result(),
      time: d.toString(),
      text: "---"
    });

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
    const d = new Date();
    this.setState({ isLoad: false, time: d.toString() }, () => {
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

  updateAppContent = async () => {
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

  showTime = (title: string) => {
    let d = new Date();
    console.log(title, d.toString());
  };

  refreshHandler = () => {
    this.updateAppContent();
  };

  subcribeToEvent = () => {
    Office.context.document.addHandlerAsync(
      Office.EventType.DocumentSelectionChanged,
      this.updateAppContent,
      asyncResult => {
        // if (asyncResult.status === '') {

        // }
        console.log("DocumentSelectionChanged --->", asyncResult);
        delay(2000);
      }
    );
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
    } else {
      this.subcribeToEvent();
    }

    return (
      <div>
        <div>{this.state.isLoad === false ? "completed" : "loading"}</div>
        <div>{this.state.text}</div>
        <div>{this.state.time}</div>
        {this.state.result.list.length}
        <hr></hr>
        <Button
          className="ms-welcome__action"
          buttonType={ButtonType.hero}
          iconProps={{ iconName: "ChevronRight" }}
          onClick={this.refreshHandler}
          disabled={this.state.isLoad}
        >
          Refresh
        </Button>
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
