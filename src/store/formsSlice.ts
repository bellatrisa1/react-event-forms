import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FormItem } from "../types/types";
import { initialForms } from "../types/data";
import { uid } from "../types/utils";

type FormsState = {
  list: FormItem[];
};

const initialState: FormsState = {
  list: initialForms,
};

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    addForm(state, action: PayloadAction<Omit<FormItem, "id" | "updatedAt">>) {
      state.list.unshift({
        ...action.payload,
        id: uid(),
        updatedAt: Date.now(),
      });
    },

    updateForm(state, action: PayloadAction<FormItem>) {
      const idx = state.list.findIndex((f) => f.id === action.payload.id);
      if (idx !== -1) {
        state.list[idx] = {
          ...action.payload,
          updatedAt: Date.now(),
        };
      }
    },

    deleteForm(state, action: PayloadAction<string>) {
      state.list = state.list.filter((f) => f.id !== action.payload);
    },

    cloneForm(state, action: PayloadAction<string>) {
      const original = state.list.find((f) => f.id === action.payload);
      if (!original) return;

      state.list.unshift({
        ...original,
        id: uid(),
        title: `${original.title} (копия)`,
        updatedAt: Date.now(),
      });
    },
  },
});

export const { addForm, updateForm, deleteForm, cloneForm } =
  formsSlice.actions;

export default formsSlice.reducer;
