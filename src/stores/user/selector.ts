import { RootState } from '..';

export const isLoggedInSelector = (state: RootState): boolean =>
  state.user.isLoggedIn;

export const emailSelector = (state: RootState): string => state.user.email;
