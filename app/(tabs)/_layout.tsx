import { useState } from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import Onboarding from "../../src/screens/Onboarding";
import useThemeState from "./useThemeState";
import { HabitsProvider, useHabits } from "./habits-context";

const tabIcons = { index: '🏠', battles: '⚔️', friends: '👥', profile: '👤' };
const tabTitles = { index: 'Home', battles: 'Battles', friends: 'Friends', profile: 'Profile' };

function TabsContent() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const { theme } = useThemeState();
  const { setSelectedHabits } = useHabits();

  if (!isOnboarded) {
    return (
      <Onboarding
        theme={theme}
        onComplete={(habits: { label: string; weeklyTarget: number }[]) => {
          setSelectedHabits(habits);
          setIsOnboarded(true);
        }}
      />
    );
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            {tabIcons[route.name as keyof typeof tabIcons]}
          </Text>
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: tabTitles.index }} />
      <Tabs.Screen name="battles" options={{ title: tabTitles.battles }} />
      <Tabs.Screen name="friends" options={{ title: tabTitles.friends }} />
      <Tabs.Screen name="profile" options={{ title: tabTitles.profile }} />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <HabitsProvider>
      <TabsContent />
    </HabitsProvider>
  );
}
