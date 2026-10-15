import { create } from 'zustand';

interface PrivacyState {
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  setPrivacyMode: (enabled: boolean) => void;
}

export const usePrivacyStore = create<PrivacyState>((set) => ({
  isPrivacyMode: false,
  togglePrivacyMode: () => set((state) => ({ isPrivacyMode: !state.isPrivacyMode })),
  setPrivacyMode: (enabled: boolean) => set({ isPrivacyMode: enabled }),
}));
