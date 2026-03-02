import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Onboarding from './src/screens/Onboarding';
import BottomTabs from './src/navigation/BottomTabs';
import { light, dark } from './src/theme/colors';

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [freezeTokens, setFreezeTokens] = useState(2);
  const [selectedHabits, setSelectedHabits] = useState([]);
  const theme = isDark ? dark : light;

  const sharedProps = {
    theme,
    isDark,
    toggleDark: () => setIsDark(value => !value),
    freezeTokens,
    setFreezeTokens,
    selectedHabits,
    onAddHabit: habitConfig =>
      setSelectedHabits(current =>
        current.some(item => item.label === habitConfig.label) ? current : [...current, habitConfig],
      ),
  };

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        {!onboarded ? (
          <Onboarding
            theme={theme}
            onComplete={habits => {
              setSelectedHabits(habits);
              setOnboarded(true);
            }}
          />
        ) : (
          <BottomTabs sharedProps={sharedProps} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
