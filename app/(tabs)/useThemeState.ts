import { useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { dark, light } from '../../src/theme/colors';

export default function useThemeState() {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const [freezeTokens, setFreezeTokens] = useState(2);
  const theme = useMemo(() => (isDark ? dark : light), [isDark]);

  useEffect(() => {
    setIsDark(systemScheme === 'dark');
  }, [systemScheme]);

  return {
    theme,
    isDark,
    toggleDark: () => setIsDark(value => !value),
    freezeTokens,
    setFreezeTokens,
  };
}
