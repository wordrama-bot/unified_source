import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  error: "",
};

const loadingScreen = createSlice({
  name: "loadingScreen",
  reducers: {
    setLoading: (state, action: { payload: boolean }) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: { payload: string }) => {
      state.error = action.payload;
    },
  },
  initialState,
});

export default loadingScreen;

export const { setLoading, setError } = loadingScreen.actions;
