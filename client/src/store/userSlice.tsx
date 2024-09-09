import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "./store";
import getHeaders from "../headers";
import { jwtDecode } from "jwt-decode";

function setCookie(token: string) {
  let decoded: string = jwtDecode(token);
  document.cookie = `token=${token}; expires=${new Date(
    new Date().getTime() + 1000 * 24 * 60 * 60
  ).toUTCString()}`;
  return decoded;
}

export const getUser = createAsyncThunk<
  userDataType,
  string,
  { state: RootState }
>("user/getUser", async (id, thunkApi) => {
  try {
    const { user } = thunkApi.getState();
    if (user.isPending && user.requestId !== thunkApi.requestId) return;

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}user/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: getHeaders(),
      }
    );

    return response.json();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const authUser = createAsyncThunk<
  { token: string },
  {
    email: string;
    password: string;
    confirmPassword?: string;
    username?: string;
  },
  { state: RootState }
>("user/authUser", async (data, thunkApi) => {
  try {
    const { user } = thunkApi.getState();
    if (user.isPending && user.requestId !== thunkApi.requestId) return;

    const endpoint =
      data.username || data.confirmPassword ? "login" : "register";
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}auth/${endpoint}`,
      {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: getHeaders(),
      }
    );

    return response.json();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

type userDataType = {};

const initialState = {
  data: loadFromLocalStorage<userDataType>("user") as userDataType | null,
  isPending: false,
  requestId: null as null | string,
};

export function loadFromLocalStorage<T>(key: string): T | null {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<typeof initialState>) => {
    builder
      .addCase(authUser.pending, (state, action) => {
        if (state.isPending) return;

        state.isPending = true;
        state.requestId = action.meta.requestId;
      })
      .addCase(authUser.fulfilled, (state, { payload }) => {
        if (!payload) return;
        state.isPending = false;
        state.requestId = null;
        setCookie(payload.token);
      })
      .addCase(authUser.rejected, (state, action) => {
        state.isPending = false;
        state.requestId = null;
        //set error
      })
      .addCase(getUser.pending, (state, action) => {
        if (state.isPending) return;

        state.isPending = true;
        state.requestId = action.meta.requestId;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.isPending = false;
        state.requestId = null;

        state.data = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isPending = false;
        state.requestId = null;
        //set error
      });
  },
});

const { actions, reducer } = userSlice;
export const {} = actions;
export default reducer;
