import HomeScreen from "../../src/screens/HomeScreen";
import { useHabits } from "./habits-context";
import useThemeState from "./useThemeState";

export default function HomeTabScreen() {
  const { theme, isDark, toggleDark, freezeTokens, setFreezeTokens } =
    useThemeState();
  const { selectedHabits, setSelectedHabits } = useHabits();

  return (
    <HomeScreen
      theme={theme}
      isDark={isDark}
      toggleDark={toggleDark}
      freezeTokens={freezeTokens}
      setFreezeTokens={setFreezeTokens}
      selectedHabits={selectedHabits}
      onAddHabit={(habitConfig) =>
        setSelectedHabits((current) =>
          current.some((item) => item.label === habitConfig.label)
            ? current
            : [...current, habitConfig],
        )
      }
    />
  );
}
