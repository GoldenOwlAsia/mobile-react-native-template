import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from './mmkvStorage';

type UserState = {
  isLoggedIn: boolean;
  email: string;
  login: (email: string) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      isLoggedIn: false,
      email: '',
      login: email => set({ email, isLoggedIn: true }),
      logout: () => set({ email: '', isLoggedIn: false }),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: state => ({
        isLoggedIn: state.isLoggedIn,
        email: state.email,
      }),
    },
  ),
);
