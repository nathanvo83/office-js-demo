import * as React from "react";
import { connect } from "react-redux";
import { types } from "../../constants/types";

import { ChunkDetailsData } from "../../models/ChunkDetailsData";

import { Button } from "office-ui-fabric-react";

export interface AppProps {
  chunkDetailsData: ChunkDetailsData;
  setChunkDetailsData;
}

export interface AppState {}

class ChunkDetails extends React.Component<AppProps, AppState> {
  componentWillUnmount() {}

  componentDidMount() {}

  chunkHandler = () => {
    const { chunkDetailsData, setChunkDetailsData } = this.props;

    chunkDetailsData.isShow = false;

    setChunkDetailsData(chunkDetailsData);
  };

  loadHandler = () => {
    // console.log("chunkData =>", this.props.chunkData);
  };

  render() {
    const { chunkDetailsData } = this.props;

    return (
      <div>
        <Button onClick={this.chunkHandler}>Close</Button>
        <Button onClick={this.loadHandler}>load</Button>
        <div>
          {chunkDetailsData.data.content.map((item, idx) => (
            <div key={idx}>{item}</div>
          ))}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChunkDetails);
