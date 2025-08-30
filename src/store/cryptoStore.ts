import { create } from 'zustand'

interface CryptoState 
{
  favorites: string[]
  themeMode: 'light' | 'dark'
  toggleTheme: () => void
  toggleFavorite: (id: string) => void
}

export const useCryptoStore = create<CryptoState>((set) => ({
  favorites: [],
  themeMode: 'light',
  toggleTheme: () =>
    set((state) => ({
      themeMode: state.themeMode === 'light' ? 'dark' : 'light'
    })),
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((f) => f !== id)
        : [...state.favorites, id]
    })),
}))
