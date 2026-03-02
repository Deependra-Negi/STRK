import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useMemo, useState } from "react";

type HabitsContextValue = {
  selectedHabits: { label: string; weeklyTarget: number }[];
  setSelectedHabits: Dispatch<SetStateAction<{ label: string; weeklyTarget: number }[]>>;
};

type HabitsProviderProps = {
  children: ReactNode;
  initialHabits?: { label: string; weeklyTarget: number }[];
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children, initialHabits = [] }: HabitsProviderProps) {
  const [selectedHabits, setSelectedHabits] = useState(initialHabits);
  const value = useMemo(
    () => ({ selectedHabits, setSelectedHabits }),
    [selectedHabits]
  );

  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error("useHabits must be used within HabitsProvider");
  }
  return context;
}
