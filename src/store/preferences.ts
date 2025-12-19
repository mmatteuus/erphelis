import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TableDensity = "comfortable" | "compact";
export type UserRole = "admin" | "gerente" | "vendedor" | "estoquista";

interface PreferencesState {
  sidebarCollapsed: boolean;
  tableDensity: TableDensity;
  lastGlobalSearch: string;
  currentRole: UserRole;

  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setTableDensity: (density: TableDensity) => void;
  setLastGlobalSearch: (value: string) => void;
  setCurrentRole: (role: UserRole) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      tableDensity: "comfortable",
      lastGlobalSearch: "",
      currentRole: "gerente",

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTableDensity: (tableDensity) => set({ tableDensity }),
      setLastGlobalSearch: (lastGlobalSearch) => set({ lastGlobalSearch }),
      setCurrentRole: (currentRole) => set({ currentRole }),
    }),
    { name: "erp-joaoemaria-preferences-v1" },
  ),
);
