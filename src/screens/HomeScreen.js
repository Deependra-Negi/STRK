import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import ConfettiCannon from 'react-native-confetti-cannon';
import { HABITS, HABIT_OPTIONS } from '../data/seed';
import Toast from '../components/Toast';
import BottomSheet from '../components/BottomSheet';
import Btn from '../components/Btn';

const buildHabitFromSelection = habitSelection => {
  const habitLabel = habitSelection.label;
  const [emoji, ...nameParts] = habitLabel.split(' ');
  const name = nameParts.join(' ') || habitLabel;
  const seedMatch = HABITS.find(habit => habit.emoji === emoji || habit.name === name);
  return {
    id: habitLabel,
    name: seedMatch?.name ?? name,
    emoji: seedMatch?.emoji ?? emoji,
    weeklyTarget: habitSelection.weeklyTarget,
    createdAt: new Date().toISOString(),
    archived: false,
  };
};

const syncHabitsWithSelection = (currentHabits, selectedHabits) => {
  const map = new Map(currentHabits.map(habit => [habit.id, habit]));
    const nextHabits = selectedHabits.map(selection => {
    const existing = map.get(selection.label);
    if (existing) {
      return { ...existing, weeklyTarget: selection.weeklyTarget };
    }
    return buildHabitFromSelection(selection);
  });
  return nextHabits;
};

const toDateKey = date => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateKey = dateKey => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (date, delta) => {
  const next = new Date(date);
  next.setDate(next.getDate() + delta);
  return next;
};

const getWeekRange = date => {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const getWeeklyCompletionCount = (habitId, rangeStart, rangeEnd, completions) =>
  completions.filter(completion => {
    if (completion.habitId !== habitId) {
      return false;
    }
    const date = parseDateKey(completion.date);
    return date >= rangeStart && date <= rangeEnd;
  }).length;

const calculateStreak = (habitId, completions, todayDate) => {
  const dateSet = new Set(
    completions.filter(item => item.habitId === habitId).map(item => item.date),
  );
  const todayKey = toDateKey(todayDate);
  const yesterdayKey = toDateKey(addDays(todayDate, -1));
  if (!dateSet.has(todayKey) && !dateSet.has(yesterdayKey)) {
    return 0;
  }
  let streak = 0;
  let cursor = dateSet.has(todayKey) ? todayDate : addDays(todayDate, -1);
  while (dateSet.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
};

/**
 * @param {{
 * theme: { bg: string; card: string; border: string; text: string; sub: string; dark: boolean },
 * isDark: boolean,
 * toggleDark: () => void,
 * freezeTokens: number,
 * setFreezeTokens: (value: number | ((prev: number) => number)) => void,
 * selectedHabits?: { label: string; weeklyTarget: number }[],
 * onAddHabit?: (habitConfig: { label: string; weeklyTarget: number }) => void
 * }} props
 */
export default function HomeScreen({
  theme,
  isDark,
  toggleDark,
  freezeTokens,
  setFreezeTokens,
  selectedHabits = [],
  onAddHabit = () => {},
}) {
  const [habits, setHabits] = useState(() => syncHabitsWithSelection([], selectedHabits));
  const [completions, setCompletions] = useState([]);
  const [checkinHabit, setCheckinHabit] = useState(null);
  const [freezeHabit, setFreezeHabit] = useState(null);
  const [checkinDone, setCheckinDone] = useState(false);
  const [toast, setToast] = useState(null);
  const [addHabitVisible, setAddHabitVisible] = useState(false);
  const [pendingHabitOption, setPendingHabitOption] = useState(null);
  const [pendingHabitDays, setPendingHabitDays] = useState(3);
  const [confettiKey, setConfettiKey] = useState(0);
  const hasCelebratedRef = useRef(false);
  const { bg, card, border, text, sub } = theme;

  const showToast = message => {
    setToast(message);
  };
  const today = new Date();
  const todayKey = toDateKey(today);
  const { start: weekStart, end: weekEnd } = getWeekRange(today);
  const completedTodayCount = habits.filter(habit =>
    completions.some(item => item.habitId === habit.id && item.date === todayKey),
  ).length;
  const total = habits.length;
  const totalWeeklyTarget = habits.reduce((sum, habit) => sum + habit.weeklyTarget, 0);
  const totalWeeklyCompleted = habits.reduce(
    (sum, habit) => sum + getWeeklyCompletionCount(habit.id, weekStart, weekEnd, completions),
    0,
  );
  const pct = totalWeeklyTarget > 0 ? Math.min(totalWeeklyCompleted / totalWeeklyTarget, 1) : 0;
  const r = 22;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    setHabits(currentHabits => syncHabitsWithSelection(currentHabits, selectedHabits));
  }, [selectedHabits]);

  useEffect(() => {
    const hasHabits = selectedHabits.length > 0 && total > 0;
    const allDone = hasHabits && completedTodayCount === total;
    if (allDone && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      setConfettiKey(key => key + 1);
    }
    if (!allDone) {
      hasCelebratedRef.current = false;
    }
  }, [completedTodayCount, selectedHabits.length, total]);

  const completeHabitToday = habitId => {
    setCompletions(current => {
      const exists = current.some(item => item.habitId === habitId && item.date === todayKey);
      if (exists) {
        return current;
      }
      return [
        ...current,
        {
          id: `${habitId}-${todayKey}`,
          habitId,
          date: todayKey,
          createdAt: new Date().toISOString(),
        },
      ];
    });
    setCheckinDone(true);
    setTimeout(() => {
      setCheckinDone(false);
      setCheckinHabit(null);
    }, 1400);
  };

  const applyFreezeToken = habitId => {
    setFreezeTokens(tokens => tokens - 1);
    setCompletions(current => {
      const exists = current.some(item => item.habitId === habitId && item.date === todayKey);
      if (exists) {
        return current;
      }
      return [
        ...current,
        {
          id: `${habitId}-${todayKey}`,
          habitId,
          date: todayKey,
          createdAt: new Date().toISOString(),
        },
      ];
    });
    setFreezeHabit(null);
    showToast('🧊 Freeze token used!');
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      {confettiKey > 0 && (
        <View style={s.confettiOverlay} pointerEvents="none">
          <ConfettiCannon
            key={`confetti-${confettiKey}`}
            count={120}
            origin={{ x: -10, y: 0 }}
            fadeOut
          />
        </View>
      )}
      {toast && <Toast message={toast} onHide={() => setToast(null)} />}

      {/* Header */}
      <View style={[s.header, { backgroundColor: card, borderBottomColor: border }]}>
        <Text style={[s.appName, { color: text }]}>Streak 🔥</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Summary row */}
        <View style={s.summaryRow}>
          <View>
            <Text style={[s.doneText, { color: text }]}>
              This week: {totalWeeklyCompleted} / {totalWeeklyTarget}
            </Text>
            <Text style={[s.dateText, { color: sub }]}>
              {completedTodayCount} habit{completedTodayCount !== 1 ? 's' : ''} completed today
            </Text>
          </View>
          <Svg width={52} height={52}>
            <Circle cx={26} cy={26} r={r} fill="none" stroke={isDark ? '#2a2a2a' : '#f0f0f0'} strokeWidth={4} />
            <Circle
              cx={26}
              cy={26}
              r={r}
              fill="none"
              stroke={totalWeeklyCompleted >= totalWeeklyTarget && totalWeeklyTarget > 0 ? '#16a34a' : '#f97316'}
              strokeWidth={4}
              strokeDasharray={`${circ} ${circ}`}
              strokeDashoffset={circ * (1 - pct)}
              strokeLinecap="round"
              rotation="-90"
              origin="26,26"
            />
          </Svg>
        </View>

        {/* Habit cards */}
        {habits.map(habit => {
          const weeklyCount = getWeeklyCompletionCount(habit.id, weekStart, weekEnd, completions);
          const streakCount = calculateStreak(habit.id, completions, today);
          const hasCompletedToday = completions.some(item => item.habitId === habit.id && item.date === todayKey);
          const goalMet = weeklyCount >= habit.weeklyTarget;
          const filledDots = Math.min(weeklyCount, habit.weeklyTarget);
          return (
            <TouchableOpacity
              key={habit.id}
              activeOpacity={0.85}
              onPress={() => !hasCompletedToday && setCheckinHabit(habit)}
              onLongPress={() => freezeTokens > 0 && setFreezeHabit(habit)}
              style={[
                s.card,
                {
                  backgroundColor: hasCompletedToday
                    ? isDark
                      ? '#121c14'
                      : '#f0fdf4'
                    : card,
                },
              ]}
            >
              <View style={s.cardTopRow}>
                <View style={s.cardTitleRow}>
                  <Text style={s.habitEmoji}>{habit.emoji}</Text>
                  <Text style={[s.habitName, { color: text }]}>{habit.name}</Text>
                </View>
                <View style={s.cardTopRight}>
                  <Text style={[s.streakBig, { color: goalMet ? '#16a34a' : '#f97316' }]}>🔥 {streakCount}</Text>
                  {hasCompletedToday && (
                    <View style={[s.checkCircle, { backgroundColor: isDark ? '#0a2a14' : '#d1fae5' }]}>
                      <Text style={{ fontSize: 12 }}>✓</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={s.progressRow}>
                <View style={s.weekDots}>
                  {Array.from({ length: habit.weeklyTarget }).map((_, index) => (
                    <View
                      key={`${habit.id}-dot-${index}`}
                      style={[
                        s.weekDot,
                        {
                          backgroundColor:
                            index < filledDots ? '#16a34a' : isDark ? '#2a2a2a' : '#e5e7eb',
                        },
                      ]}
                    />
                  ))}
                </View>
                <View style={s.progressTextRow}>
                  <Text style={[s.weeklyText, { color: sub }]}>
                    {weeklyCount}/{habit.weeklyTarget}
                  </Text>
                  {weeklyCount > habit.weeklyTarget && (
                    <Text style={[s.bonusText, { color: '#16a34a' }]}>
                      🔥 +{weeklyCount - habit.weeklyTarget}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

      </ScrollView>

      <TouchableOpacity style={[s.fab, { backgroundColor: text }]} onPress={() => setAddHabitVisible(true)}>
        <Text style={{ color: isDark ? '#111' : '#fff', fontSize: 22, fontWeight: '700' }}>＋</Text>
      </TouchableOpacity>

      {/* Add habit sheet */}
      <BottomSheet visible={addHabitVisible} onClose={() => setAddHabitVisible(false)} theme={theme}>
        <Text style={[s.sheetTitle, { color: text, textAlign: 'center' }]}>Add a habit</Text>
        {!pendingHabitOption && (
          <>
            {HABIT_OPTIONS.filter(
              option => !selectedHabits.some(selected => selected.label === option),
            ).map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  setPendingHabitOption(option);
                  setPendingHabitDays(3);
                }}
                style={[s.habitPick, { borderColor: border, backgroundColor: card }]}
              >
                <Text style={{ color: text, fontSize: 14 }}>{option}</Text>
              </TouchableOpacity>
            ))}
            {HABIT_OPTIONS.filter(option => !selectedHabits.some(selected => selected.label === option)).length === 0 && (
              <Text style={{ color: sub, fontSize: 13, textAlign: 'center', marginTop: 8 }}>
                All available habits are already added.
              </Text>
            )}
          </>
        )}
        {pendingHabitOption && (
          <View style={s.daysPicker}>
            <Text style={[s.daysTitle, { color: text }]}>How many days per week?</Text>
            <Text style={{ color: sub, fontSize: 12, marginBottom: 12 }}>
              {pendingHabitOption}
            </Text>
            <View style={s.daysControls}>
              <TouchableOpacity
                onPress={() => setPendingHabitDays(value => Math.max(1, value - 1))}
                style={[s.dayAdjustBtn, { borderColor: border }]}
              >
                <Text style={{ color: text, fontSize: 16 }}>−</Text>
              </TouchableOpacity>
              <Text style={[s.daysCount, { color: text }]}>{pendingHabitDays}</Text>
              <TouchableOpacity
                onPress={() => setPendingHabitDays(value => Math.min(7, value + 1))}
                style={[s.dayAdjustBtn, { borderColor: border }]}
              >
                <Text style={{ color: text, fontSize: 16 }}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: sub, fontSize: 12, marginBottom: 16 }}>
              {pendingHabitDays} day{pendingHabitDays !== 1 ? 's' : ''} per week
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Btn
                  label="Back"
                  onPress={() => setPendingHabitOption(null)}
                  theme={theme}
                  outline
                  full
                />
              </View>
              <View style={{ flex: 1 }}>
                <Btn
                  label="Add Habit"
                  onPress={() => {
                    onAddHabit({ label: pendingHabitOption, weeklyTarget: pendingHabitDays });
                    setPendingHabitOption(null);
                    setAddHabitVisible(false);
                  }}
                  theme={theme}
                  full
                />
              </View>
            </View>
          </View>
        )}
      </BottomSheet>

      {/* Check-in sheet */}
      <BottomSheet visible={!!checkinHabit} onClose={() => !checkinDone && setCheckinHabit(null)} theme={theme}>
        {checkinDone ? (
          <View style={s.center}>
            <Text style={{ fontSize: 56 }}>🎉</Text>
            <Text style={[s.sheetTitle, { color: text }]}>Streak saved!</Text>
            <Text style={{ color: sub, fontSize: 14, marginTop: 6 }}>
              Day {(checkinHabit?.streak ?? 0) + 1} complete 🔥
            </Text>
          </View>
        ) : (
          checkinHabit && (
            <View>
              <Text style={[s.center, { fontSize: 44 }]}>{checkinHabit.emoji}</Text>
              <Text style={[s.sheetTitle, { color: text, textAlign: 'center', marginTop: 8 }]}>
                {checkinHabit.name}
              </Text>
              <Text style={{ color: sub, fontSize: 13, textAlign: 'center', marginBottom: 20 }}>
                Upload a photo to verify completion
              </Text>
              <TouchableOpacity style={[s.photoBox, { borderColor: border }]}>
                <Text style={{ color: sub, fontSize: 13 }}>📷 Tap to upload photo</Text>
              </TouchableOpacity>
              <Btn label="Mark Complete ✓" onPress={() => completeHabitToday(checkinHabit.id)} theme={theme} full />
            </View>
          )
        )}
      </BottomSheet>

      {/* Freeze sheet */}
      <BottomSheet visible={!!freezeHabit} onClose={() => setFreezeHabit(null)} theme={theme}>
        {freezeHabit && (
          <View style={s.center}>
            <Text style={{ fontSize: 44 }}>🧊</Text>
            <Text style={[s.sheetTitle, { color: text, marginTop: 8 }]}>Use a Freeze Token?</Text>
            <Text
              style={{
                color: sub,
                fontSize: 13,
                textAlign: 'center',
                marginTop: 6,
                marginBottom: 24,
                lineHeight: 20,
              }}
            >
              Protects your <Text style={{ fontWeight: '700', color: text }}>{freezeHabit.name}</Text> streak for today.
              {'\n'}
              {freezeTokens} token{freezeTokens !== 1 ? 's' : ''} remaining.
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Btn label="Cancel" onPress={() => setFreezeHabit(null)} theme={theme} outline full />
              </View>
              <View style={{ flex: 1 }}>
                <Btn label="Use Token" onPress={() => applyFreezeToken(freezeHabit.id)} theme={theme} full />
              </View>
            </View>
          </View>
        )}
      </BottomSheet>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
  },
  appName: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  content: { padding: 16, paddingBottom: 32 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  doneText: { fontSize: 22, fontWeight: '700' },
  dateText: { fontSize: 13, marginTop: 2 },
  card: { borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  habitEmoji: { fontSize: 28 },
  habitName: { fontSize: 15, fontWeight: '600' },
  cardTopRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakBig: { fontSize: 17, fontWeight: '800' },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  progressTextRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  weeklyText: { fontSize: 12 },
  bonusText: { fontSize: 11, fontWeight: '600' },
  weekDots: { flexDirection: 'row', gap: 6 },
  weekDot: { width: 8, height: 8, borderRadius: 4 },
  checkCircle: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  sheetTitle: { fontSize: 18, fontWeight: '700' },
  photoBox: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 14, padding: 32, alignItems: 'center', marginBottom: 16 },
  habitPick: { padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  daysPicker: { marginTop: 6 },
  daysTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  daysControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 8 },
  dayAdjustBtn: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  daysCount: { fontSize: 22, fontWeight: '700', minWidth: 28, textAlign: 'center' },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  confettiOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    elevation: 50,
  },
});
