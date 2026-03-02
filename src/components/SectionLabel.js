import { Text, StyleSheet } from 'react-native';

export default function SectionLabel({ label, theme }) {
  return <Text style={[s.label, { color: theme.sub }]}>{label}</Text>;
}

const s = StyleSheet.create({
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8, marginTop: 4, paddingLeft: 2 },
});
