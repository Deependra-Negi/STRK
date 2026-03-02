import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Btn({ label, onPress, theme, outline = false, full = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        s.btn,
        full && s.full,
        outline
          ? { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border }
          : { backgroundColor: theme.text },
      ]}
    >
      <Text style={[s.label, { color: outline ? theme.text : theme.dark ? '#111' : '#fff' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: { borderRadius: 12, paddingVertical: 13, paddingHorizontal: 20, alignItems: 'center' },
  full: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600' },
});
