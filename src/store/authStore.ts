import { create } from "zustand";

interface AuthState {
  user: { id: string; email: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (user: AuthState["user"], accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: localStorage.getItem("refreshToken"),
  login: (user, accessToken, refreshToken) => {
    localStorage.setItem("refreshToken", refreshToken);
    set({ user, accessToken, refreshToken });
  },
  logout: () => {
    localStorage.removeItem("refreshToken");
    set({ user: null, accessToken: null, refreshToken: null });
  },
  setAccessToken: (token) => set({ accessToken: token }),
}));

