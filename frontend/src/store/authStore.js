import { create } from 'zustand';
import { authService } from '../services';

export const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  
  setUser: (user) => set({ user, isAuthenticated: true }),
  
  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
