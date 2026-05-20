import { create } from "zustand";
import type { AuthState, User } from "../types/Authtypes";
import { setAuthToken } from "../services/graphql";
import { getRole } from "../services/authApi";

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  role: string;
  googleAuth: object;
  googleProfile: object;
  setGoogleProfile: (googleProfile: object) => void;
  setGoogleAuth: (googleAuth: object) => void;
  updateUser: (user: User) => void;
  initializeAuth: () => Promise<void>;
  isInitialized: boolean;
  authCheck: () => Promise<void>;
  isAuthenticated: boolean;
  getRole: () => Promise<string>;
}

const isUserCheck = localStorage.getItem("user") ? true : false;

export const useAuthStore = create<AuthStore>((set) => ({
  user: isUserCheck ? JSON.parse(localStorage.getItem("user") as string) : null,
  accessToken: localStorage.getItem("access_token"),
  isAuthenticated: false,
  isInitialized: false,
  role: "",
  googleAuth: {},
  googleProfile: {},

  setGoogleProfile: (googleProfile: object) => set({ googleProfile }),
  setGoogleAuth: (googleAuth: object) => set({ googleAuth }),
  initializeAuth: async () => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");

    if (token) {
      setAuthToken(token);
    }
    set({
      user: user ? JSON.parse(user) : null,
      accessToken: token,
      isAuthenticated: !!token,
      isInitialized: true,
    });
  },

  login: (user, token) => {
    setAuthToken(token);
    localStorage.setItem("access_token", token);

    // console.log(user, "user");
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, accessToken: token, isAuthenticated: true });
  },

  logout: () => {
    setAuthToken(null as unknown as string);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  updateUser: (user) => set({ user }),
  authCheck: async () => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");

    if (token) {
      setAuthToken(token);
    }
    set({
      user: user ? JSON.parse(user) : null,
      accessToken: token,
      isAuthenticated: !!token,
    });
  },
  getRole: async () => {
    const response = await getRole();
    set({ role: response.role });
    return response.role;
  },
}));
