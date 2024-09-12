import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { loadFromLocalStorage } from "./userSlice";
import { RootState } from "./store";
import getHeaders from "../headers";
import { CardColor, CardValue } from "./gameTypes";

type Card = {
  color: CardColor | "black";
  isSpecial: boolean;
  value: CardValue;
  imgName: string;
  selectedColor?: CardColor;
};

type gameDataUserType = {
  username: string;
  userId: string;
  cardsInHand: Card[] | number;
};

type gameDataType = {
  gameId: string;
  code: string;
  drawPileLength: number;
  discardPileLength: number;
  status: "lobby" | "inGame" | "endScreen";
  turn: number;
  users: gameDataUserType[];
  lastDiscardedCard: Card;
};

export const getGame = createAsyncThunk<
  gameDataType,
  string,
  { state: RootState }
>("game/getGame", async (id, thunkApi) => {
  try {
    const { game } = thunkApi.getState();
    if (game.isPending && game.requestId !== thunkApi.requestId) return;

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}game/${id}`,
      { method: "GET", credentials: "include", headers: getHeaders() }
    );

    return response.json();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const createGame = createAsyncThunk<
  { gameId: string },
  undefined,
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
      })
      .addCase(getGame.pending, (state, action) => {
        if (state.isPending) return;
        state.isPending = true;
        state.requestId = action.meta.requestId;
      })
      .addCase(getGame.fulfilled, (state, { payload }) => {
        if (!payload) return;

        state.isPending = false;
        state.requestId = null;

        state.data = payload;
      })
      .addCase(getGame.rejected, (state, action) => {
        state.isPending = false;
        state.requestId = null;
        //set error
      });
  },
});

export const { reducer, actions } = gameSlice;
export const {} = actions;
export default reducer;
