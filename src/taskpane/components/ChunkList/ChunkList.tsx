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

  moveCursor = (section: Section) => {
    console.log(section.title);
    Word.run(async context => {
      var searchResults = context.document.body.search(section.content[0], { matchPrefix: true }).getFirst();

      searchResults.select("Start");
      await context.sync();
    });
  };

  chunkHandler = (section: Section, idx: number) => {
    const { setChunkDetailsData, chunkDetailsData } = this.props;
    // const chunkDetailsData = new ChunkDetailsData(idx, true, section);

    chunkDetailsData.idx = idx;
    chunkDetailsData.isShow = true;
    chunkDetailsData.data = section;
    setChunkDetailsData(chunkDetailsData);
    this.moveCursor(section);
  };

  render() {
    const { list } = this.props;

    return (
      <>
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
      </>
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
