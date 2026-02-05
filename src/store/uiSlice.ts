import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NavKey } from "../types/types";
import type { FormItem } from "../types/types";

type ModalState =
  | { open: false }
  | { open: true; mode: "create" | "edit"; form: FormItem | null };

type UiState = {
  activeNav: NavKey;
  modal: ModalState;
};

const initialState: UiState = {
  activeNav: "forms",
  modal: { open: false },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setNav(state, action: PayloadAction<NavKey>) {
      state.activeNav = action.payload;
    },

    openCreateModal(state) {
      state.modal = { open: true, mode: "create", form: null };
    },

    openEditModal(state, action: PayloadAction<FormItem>) {
      state.modal = { open: true, mode: "edit", form: action.payload };
    },

    closeModal(state) {
      state.modal = { open: false };
    },
  },
});

export const { setNav, openCreateModal, openEditModal, closeModal } =
  uiSlice.actions;

export default uiSlice.reducer;
