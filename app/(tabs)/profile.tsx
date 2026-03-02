import ProfileScreen from '../../src/screens/ProfileScreen';
import useThemeState from './useThemeState';

export default function ProfileTabScreen() {
  const { theme, freezeTokens, isDark, toggleDark } = useThemeState();

  return (
    <ProfileScreen
      theme={theme}
      freezeTokens={freezeTokens}
      isDark={isDark}
      toggleDark={toggleDark}
    />
  );
}
