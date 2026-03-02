import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

export default function Toggle({ value, onChange }) {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, value]);

  const left = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [3, 22] });
  const bg = animatedValue.interpolate({ inputRange: [0, 1], outputRange: ['#dddddd', '#f97316'] });

  return (
    <TouchableOpacity onPress={onChange} activeOpacity={0.8}>
      <Animated.View style={[s.track, { backgroundColor: bg }]}>
        <Animated.View style={[s.thumb, { left }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  track: { width: 44, height: 24, borderRadius: 99 },
  thumb: {
    position: 'absolute',
    top: 3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
