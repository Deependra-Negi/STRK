import FriendsScreen from '../../src/screens/FriendsScreen';
import useThemeState from './useThemeState';

export default function FriendsTabScreen() {
  const { theme } = useThemeState();

  return <FriendsScreen theme={theme} />;
}
