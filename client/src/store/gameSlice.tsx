import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { loadFromLocalStorage } from "./userSlice";
import { RootState } from "./store";
import getHeaders from "../headers";

type gameDataType = {};

export const createGame = createAsyncThunk<
  { gameId: string },
  { ownerId: string },
  { state: RootState }
>("game/createGame", async (data, thunkApi) => {
  try {
    const { game } = thunkApi.getState();
    if (game.isPending && game.requestId !== thunkApi.requestId) return;

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}game/create`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: getHeaders(),
      }
    );

    return response.json();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const initialState = {
  data: loadFromLocalStorage<gameDataType>("game") as gameDataType | null,
  isPending: false,
  requestId: null as null | string,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<typeof initialState>) => {
    builder
      .addCase(createGame.pending, (state, action) => {
        if (state.isPending) return;

        state.isPending = true;
        state.requestId = action.meta.requestId;
      })
      .addCase(createGame.fulfilled, (state, { payload }) => {
        if (!payload) return;

        state.isPending = false;
        state.requestId = null;
      })
      .addCase(createGame.rejected, (state, action) => {
        state.isPending = false;
        state.requestId = null;
        //set error
      });
  },
});

export const { reducer, actions } = gameSlice;
export const {} = actions;
export default reducer;
