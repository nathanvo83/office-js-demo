import { types } from "../constants/types";
import { ChunkDetailsData } from "../models/ChunkDetailsData";

export const chunkDetailsDataReducer = (state = new ChunkDetailsData(), action) => {
  switch (action.type) {
    case types.SET_CHUNK:
      // console.log("action.chunkDetailsData", action.chunkDetailsData);
      // return action.chunkDetailsData;
      return {
        ...state,
        chunkDetailsData: action.chunkDetailsData
      };

    default:
      return state;
  }
};
