import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { AnyAction } from "redux";

import { wrappedApi } from "../api/wrapped";
import { wordramaApiV3 } from "../api/wordrama";
import { freePlayApi } from "../api/freePlay";
import { systemApi } from '../api/system';
import { liveApi } from "../api/live";
import { friendsApi } from "../api/friends";
import { teamApi } from "../api/teams";
import { rootReducer } from "../rootReducer";

export type IRootState = ReturnType<typeof store.getState>;
export type IAppDispatch = ThunkDispatch<IRootState, any, AnyAction>;

// Typed useDispatch and useSelector hooks
export const useAppDispatch = () => useDispatch<IAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware();

    middleware.push(wordramaApiV3.middleware);
    middleware.push(freePlayApi.middleware);
    middleware.push(systemApi.middleware);
    middleware.push(liveApi.middleware);
    middleware.push(friendsApi.middleware);
    middleware.push(teamApi.middleware);
    middleware.push(wrappedApi.middleware);

    return middleware;
  },
});
