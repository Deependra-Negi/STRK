import { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

export default function Toast({ message, onHide }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(onHide);
  }, [onHide, opacity]);

  return (
    <Animated.View style={[s.toast, { opacity }]}>
      <Text style={s.text}>{message}</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    zIndex: 999,
  },
  text: { color: '#fff', fontSize: 13, fontWeight: '500' },
});
