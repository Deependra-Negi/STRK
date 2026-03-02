import BattlesScreen from '../../src/screens/BattlesScreen';
import useThemeState from './useThemeState';

export default function BattlesTabScreen() {
  const { theme } = useThemeState();

  return <BattlesScreen theme={theme} />;
}
