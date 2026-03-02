import { View, Text, StyleSheet } from 'react-native';

export default function Avatar({ initials, theme, size = 40 }) {
  return (
    <View
      style={[
        s.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.dark ? '#2a2a2a' : '#f0f0f0',
        },
      ]}
    >
      <Text style={[s.text, { color: theme.sub, fontSize: size * 0.3 }]}>{initials}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: '700' },
});
