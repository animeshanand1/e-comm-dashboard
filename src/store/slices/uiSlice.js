import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: 'Dashboard',
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const {
  setCurrentPage,
  toggleSidebar,
  setSidebarCollapsed,
} = uiSlice.actions;

export default uiSlice.reducer;
