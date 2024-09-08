import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  isLoggedIn: boolean;
  email: string;
};

const initialState: UserState = {
  isLoggedIn: false,
  email: '',
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
      state.isLoggedIn = true;
    },
    logout: state => {
      state.email = '';
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = slice.actions;

export default slice.reducer;
