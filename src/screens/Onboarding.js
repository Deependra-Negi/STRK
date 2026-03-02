import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HABIT_OPTIONS } from '../data/seed';
import Btn from '../components/Btn';
import Toggle from '../components/Toggle';

export default function Onboarding({ theme, onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedHabits, setSelectedHabits] = useState([]);
  const { bg, card, border, text, sub } = theme;

  const toggleHabit = habitLabel =>
    setSelectedHabits(selected => {
      const exists = selected.find(item => item.label === habitLabel);
      if (exists) {
        return selected.filter(item => item.label !== habitLabel);
      }
      return [...selected, { label: habitLabel, weeklyTarget: 3 }];
    });

  const updateHabitDays = (habitLabel, delta) =>
    setSelectedHabits(selected =>
      selected.map(item =>
        item.label === habitLabel
          ? { ...item, weeklyTarget: Math.min(7, Math.max(1, item.weeklyTarget + delta)) }
          : item,
      ),
    );
  const progress = step / 3;

  const steps = [
    // Welcome
    <View style={s.center} key="welcome">
      <Text style={s.emoji}>🔥</Text>
      <Text style={[s.title, { color: text }]}>Welcome to Streak</Text>
      <Text style={[s.sub, { color: sub }]}>Build better habits with friends through shared accountability.</Text>
      <Btn label="Get Started" onPress={() => setStep(1)} theme={theme} full />
    </View>,

    // Name
    <View key="name">
      <Text style={[s.title, { color: text }]}>What's your name?</Text>
      <Text style={[s.sub, { color: sub }]}>This is how your friends will see you.</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your first name"
        placeholderTextColor={sub}
        style={[s.input, { borderColor: border, backgroundColor: card, color: text }]}
      />
      <Btn label="Continue →" onPress={() => name.trim() && setStep(2)} theme={theme} full />
    </View>,

    // Habits
    <View key="habits">
      <Text style={[s.title, { color: text }]}>Pick your habits</Text>
      <Text style={[s.sub, { color: sub }]}>Choose what you want to track daily.</Text>
      <View style={s.grid}>
        {HABIT_OPTIONS.map(habitOption => {
          const selectedConfig = selectedHabits.find(item => item.label === habitOption);
          const isSelected = !!selectedConfig;
          return (
            <TouchableOpacity
              key={habitOption}
              onPress={() => toggleHabit(habitOption)}
              style={[
                s.habitChip,
                {
                  borderColor: isSelected ? '#f97316' : border,
                  backgroundColor: isSelected ? (theme.dark ? '#2a1500' : '#fff7ed') : card,
                },
              ]}
            >
              <Text
                style={[
                  s.habitChipText,
                  { color: isSelected ? '#f97316' : text, fontWeight: isSelected ? '700' : '400' },
                ]}
              >
                {habitOption}
              </Text>
              {isSelected && (
                <View style={s.daysRow}>
                  <TouchableOpacity
                    onPress={() => updateHabitDays(habitOption, -1)}
                    style={[s.dayBtn, { borderColor: border }]}
                  >
                    <Text style={{ color: text }}>−</Text>
                  </TouchableOpacity>
                  <Text style={[s.daysText, { color: text }]}>
                    {selectedConfig.weeklyTarget} day{selectedConfig.weeklyTarget !== 1 ? 's' : ''}/week
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateHabitDays(habitOption, 1)}
                    style={[s.dayBtn, { borderColor: border }]}
                  >
                    <Text style={{ color: text }}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <Btn label="Continue →" onPress={() => selectedHabits.length > 0 && setStep(3)} theme={theme} full />
    </View>,

    // Notifications
    <View key="notifications">
      <Text style={[s.title, { color: text }]}>Stay on track 🔔</Text>
      <Text style={[s.sub, { color: sub }]}>Enable reminders to keep streaks alive.</Text>
      <View style={[s.notifCard, { backgroundColor: card }]}>
        {[['Daily habit reminder', '08:00 AM'], ['Streak at risk alert', 'Before midnight'], ['Friend activity', 'Real-time']].map(
          ([label, hint], index, rows) => (
            <View
              key={label}
              style={[s.notifRow, index < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: border }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[s.notifLabel, { color: text }]}>{label}</Text>
                <Text style={[s.notifHint, { color: sub }]}>{hint}</Text>
              </View>
              <Toggle value={true} onChange={() => {}} />
            </View>
          ),
        )}
      </View>
      <Btn label="Start Streaking 🔥" onPress={() => onComplete(selectedHabits)} theme={theme} full />
      <TouchableOpacity onPress={() => onComplete(selectedHabits)} style={{ marginTop: 14, alignItems: 'center' }}>
        <Text style={{ color: sub, fontSize: 13 }}>Skip</Text>
      </TouchableOpacity>
    </View>,
  ];

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        {step > 0 && (
          <View style={{ marginBottom: 28 }}>
            <View style={s.progressRow}>
              <TouchableOpacity onPress={() => setStep(currentStep => currentStep - 1)}>
                <Text style={{ color: sub, fontSize: 13 }}>← Back</Text>
              </TouchableOpacity>
              <Text style={{ color: sub, fontSize: 12 }}>{step} / 3</Text>
            </View>
            <View style={[s.progressBg, { backgroundColor: border }]}>
              <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
            </View>
          </View>
        )}
        {steps[step]}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 24, paddingTop: 48 },
  center: { alignItems: 'center' },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: 8 },
  sub: { fontSize: 15, lineHeight: 22, marginBottom: 28 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  habitChip: { width: '47%', borderWidth: 2, borderRadius: 12, padding: 12, alignItems: 'center' },
  habitChipText: { fontSize: 13 },
  daysRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  dayBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  daysText: { fontSize: 11, fontWeight: '600' },
  notifCard: { borderRadius: 14, overflow: 'hidden', marginBottom: 24 },
  notifRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  notifLabel: { fontSize: 14 },
  notifHint: { fontSize: 11, marginTop: 2 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressBg: { height: 3, borderRadius: 99 },
  progressFill: { height: 3, borderRadius: 99, backgroundColor: '#f97316' },
});
