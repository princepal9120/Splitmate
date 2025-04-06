import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDarkMode: boolean;
  primaryColor: string;
  accentColor: string;
  toggleTheme: () => void;
  setPrimaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
}

export const useThemeStore = create(
  persist<ThemeState>(
    (set) => ({
      isDarkMode: false,
      primaryColor: '#4CAF50',
      accentColor: '#2196F3',

      toggleTheme: () =>
        set((state) => ({
          isDarkMode: !state.isDarkMode,
        })),

      setPrimaryColor: (color) =>
        set({
          primaryColor: color,
        }),

      setAccentColor: (color) =>
        set({
          accentColor: color,
        }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
