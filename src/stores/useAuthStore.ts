import create from 'zustand';

type RedirectSettings = {
  pageKey?: string;
  additionalData?: string | number;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  recentlyLoggedOut: boolean;
  redirectSettings: RedirectSettings;
  setUser: Function;
  storeAuthenticatedUser: Function;
  clearAuthStore: Function;
  resetAuthentication: Function;
  setRedirectSettings: Function;
  clearRedirectionSettings: Function;
};

const useAuthStore = create<AuthStore>(set => ({
  user: null,
  isAuthenticated: false,
  recentlyLoggedOut: false,
  redirectSettings: {},
  setUser: (user: User) =>
    set(state => ({
      user: {
        ...state.user,
        ...user,
      },
    })),
  storeAuthenticatedUser: (user: User) =>
    set(state => {
      state.setUser(user);
      return {
        isAuthenticated: true,
        recentlyLoggedOut: false,
      };
    }),
  setRedirectSettings: (redirectSettings: RedirectSettings) =>
    set(() => ({
      redirectSettings,
    })),
  clearAuthStore: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
    })),

  resetAuthentication: () =>
    set(() => ({
      isAuthenticated: false,
      recentlyLoggedOut: true,
    })),
  clearRedirectionSettings: () =>
    set(() => ({
      redirectSettings: {},
    })),
}));

export default useAuthStore;
