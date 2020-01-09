import * as React from "react";
import { connect } from "react-redux";
import { types } from "../../constants/types";

import { Section } from "../../models/Section";
import { ChunkDetailsData } from "../../models/ChunkDetailsData";
import Chunk from "../Chunk/Chunk";

export interface AppProps {
  list: Section[];
  chunkDetailsData: ChunkDetailsData;
  setChunkDetailsData;
}

export interface AppState {}

class ChunkList extends React.Component<AppProps, AppState> {
  componentWillUnmount() {}

  componentDidMount() {}

  chunkHandler = (section: Section, idx: number) => {
    const { setChunkDetailsData, chunkDetailsData } = this.props;
    // const chunkDetailsData = new ChunkDetailsData(idx, true, section);

    chunkDetailsData.idx = idx;
    chunkDetailsData.isShow = true;
    chunkDetailsData.data = section;
    setChunkDetailsData(chunkDetailsData);
  };

  render() {
    const { list } = this.props;

    return (
      <div>
        {list.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              this.chunkHandler(item, idx);
            }}
          >
            <Chunk title={item.title}></Chunk>
          </div>
        ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(ChunkList);
