import { combineReducers } from '@reduxjs/toolkit';
import { wordramaApiV3 } from "./api/wordrama";
import { wrappedApi } from './api/wrapped';
import { freePlayApi } from './api/freePlay';
import { systemApi } from './api/system';
import { liveApi } from './api/live';
import { friendsApi } from './api/friends';
import { teamApi } from './api/teams';
import wordleReducer from './wordle/reducers';
import freePlayReducer from './wordleFreePlay/reducers';
import uiReducer from './ui/reducers';
import { logout } from './actions';

const appReducer = combineReducers({
  wordramaApi: wordramaApiV3.reducer,
  freePlayApi: freePlayApi.reducer,
  systemApi: systemApi.reducer,
  liveApi: liveApi.reducer,
  friendsApi: friendsApi.reducer,
  teamApi: teamApi.reducer,
  wrappedApi: wrappedApi.reducer,
  wordleGameState: wordleReducer,
  freePlayGameState: freePlayReducer,
  uiState: uiReducer,
});

export const rootReducer = (state: any, action: any) => {
  if (action.type === logout.type) {
    state = undefined;
  }
  return appReducer(state, action);
};
