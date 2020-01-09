import { combineReducers } from "redux";
import { chunkDetailsDataReducer } from "./chunkDetailsDataReducer";
// import { isChunkDetailsReducer } from "./isChunkDetailsReducer";

export const rootReducer = combineReducers({
  chunkDetailsData: chunkDetailsDataReducer
  // isChunkDetails: isChunkDetailsReducer
});
