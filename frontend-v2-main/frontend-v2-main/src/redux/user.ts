import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {} as UserJWT,
  token: "",
  isLoggedIn: false,
  isLoggingIn: true,
};

const user = createSlice({
  name: "user",
  reducers: {
    setUser: (state, action: { payload: any }) => {
      state.user = action.payload;
    },
    setToken: (state, action: { payload: string }) => {
      state.token = action.payload;
    },
    setIsLoggedIn: (state, action: { payload: boolean }) => {
      state.isLoggedIn = action.payload;
    },
    setIsLoggingIn: (state, action: { payload: boolean }) => {
      state.isLoggingIn = action.payload;
    },
  },
  initialState,
});

export default user;

export const { setToken, setUser, setIsLoggedIn, setIsLoggingIn } =
  user.actions;
