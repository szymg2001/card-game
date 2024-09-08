import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loadFromLocalStorage } from "./userSlice";

type gameDataType = {};

const initialState = {
  data: loadFromLocalStorage<gameDataType>("game") as gameDataType | null,
  isPending: false,
  requestId: null as null | string,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
});

export const { reducer, actions } = gameSlice;
export const {} = actions;
export default reducer;
