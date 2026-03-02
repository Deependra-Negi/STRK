import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import BattlesScreen from '../screens/BattlesScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const icons = { Home: '🏠', Battles: '⚔️', Friends: '👥', Profile: '👤' };

export default function BottomTabs({ sharedProps }) {
  const { theme } = sharedProps;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.sub,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen name="Home">{() => <HomeScreen {...sharedProps} />}</Tab.Screen>
      <Tab.Screen name="Battles">{() => <BattlesScreen {...sharedProps} />}</Tab.Screen>
      <Tab.Screen name="Friends">{() => <FriendsScreen {...sharedProps} />}</Tab.Screen>
      <Tab.Screen name="Profile">{() => <ProfileScreen {...sharedProps} />}</Tab.Screen>
    </Tab.Navigator>
  );
}
