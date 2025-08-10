import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('adminToken'),
  admin: null,
  isAuthenticated: !!localStorage.getItem('adminToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.admin = action.payload.admin;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('adminToken', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.token = null;
      state.admin = null;
      state.isAuthenticated = false;
      localStorage.removeItem('adminToken');
    },
    logout: (state) => {
      state.token = null;
      state.admin = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('adminToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
