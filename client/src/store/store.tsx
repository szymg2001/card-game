import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import listenerMiddleWare from "./listenerMiddleware";

const store = configureStore({
  reducer: { user: userReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleWare.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
