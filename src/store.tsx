import { configureStore } from "@reduxjs/toolkit";
import formsReducer from "./store/formsSlice";
import uiReducer from "./store/uiSlice";

export const store = configureStore({
  reducer: {
    forms: formsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
