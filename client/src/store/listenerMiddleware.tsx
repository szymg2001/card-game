import { createListenerMiddleware } from "@reduxjs/toolkit";
import { getUser } from "./userSlice";

function updateLocalStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

const listenerMiddleWare = createListenerMiddleware();

listenerMiddleWare.startListening({
  actionCreator: getUser.fulfilled,
  effect: async (action, listenerAPI) => {
    updateLocalStorage("user", action.payload);
  },
});

export default listenerMiddleWare;
