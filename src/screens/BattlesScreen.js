import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BATTLES, GROUPS, HABIT_OPTIONS } from '../data/seed';
import BottomSheet from '../components/BottomSheet';
import Btn from '../components/Btn';

export default function BattlesScreen({ theme }) {
  const [view, setView] = useState('1v1');
  const [battleModal, setBattleModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);
  const { bg, card, border, text, sub, dark: isDark } = theme;

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Segment */}
        <View style={[s.segment, { backgroundColor: isDark ? '#222' : '#f0f0f0' }]}>
          {['1v1', 'Groups'].map(segment => (
            <TouchableOpacity
              key={segment}
              onPress={() => setView(segment)}
              style={[s.segBtn, view === segment && { backgroundColor: card }]}
            >
              <Text style={[s.segText, { color: view === segment ? text : sub, fontWeight: view === segment ? '700' : '400' }]}>
                {segment === '1v1' ? '⚔️ 1v1' : '👥 Groups'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.row}>
          <Text style={[s.sectionTitle, { color: text }]}>{view === '1v1' ? 'Active Battles' : 'Group Challenges'}</Text>
          <TouchableOpacity
            onPress={() => (view === '1v1' ? setBattleModal(true) : setGroupModal(true))}
            style={[s.newBtn, { backgroundColor: text }]}
          >
            <Text style={{ color: isDark ? '#111' : '#fff', fontWeight: '600', fontSize: 13 }}>+ New</Text>
          </TouchableOpacity>
        </View>

        {view === '1v1' &&
          BATTLES.map(battle => (
            <View key={battle.id} style={[s.card, { backgroundColor: card }]}>
              <View style={s.row}>
                <View>
                  <Text style={[s.cardTitle, { color: text }]}>
                    {battle.emoji} {battle.name}
                  </Text>
                  <Text style={[s.cardSub, { color: sub }]}>
                    vs {battle.challenger} · {battle.days}d
                  </Text>
                </View>
                <View
                  style={[
                    s.pill,
                    {
                      backgroundColor:
                        battle.status === 'won'
                          ? isDark
                            ? '#0a2a14'
                            : '#f0fdf4'
                          : isDark
                          ? '#1a2540'
                          : '#eff6ff',
                    },
                  ]}
                >
                  <Text style={{ color: battle.status === 'won' ? '#16a34a' : '#3b82f6', fontSize: 11, fontWeight: '700' }}>
                    {battle.status === 'won' ? '🏆 Won' : `${battle.daysLeft}d left`}
                  </Text>
                </View>
              </View>
              <View style={[s.row, { marginTop: 12, gap: 12 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.barLabel, { color: sub }]}>You</Text>
                  <View style={[s.barBg, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
                    <View style={[s.barFill, { width: `${(battle.myStreak / battle.days) * 100}%`, backgroundColor: text }]} />
                  </View>
                  <Text style={[s.streakNum, { color: text }]}>🔥 {battle.myStreak}</Text>
                </View>
                <Text style={{ color: sub, fontWeight: '800', fontSize: 12, paddingBottom: 10 }}>VS</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.barLabel, { color: sub }]}>{battle.challenger}</Text>
                  <View style={[s.barBg, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
                    <View style={[s.barFill, { width: `${(battle.theirStreak / battle.days) * 100}%`, backgroundColor: '#f97316' }]} />
                  </View>
                  <Text style={[s.streakNum, { color: '#f97316' }]}>🔥 {battle.theirStreak}</Text>
                </View>
              </View>
            </View>
          ))}

        {view === 'Groups' &&
          GROUPS.map(group => (
            <View key={group.id} style={[s.card, { backgroundColor: card }]}>
              <Text style={[s.cardTitle, { color: text }]}>
                {group.emoji} {group.name}
              </Text>
              <Text style={[s.cardSub, { color: sub, marginBottom: 12 }]}>
                {group.members.length} members · {group.daysLeft}d left
              </Text>
              {[...group.scores].sort((a, b) => b.streak - a.streak).map((score, index) => (
                <View key={score.name} style={[s.row, { marginBottom: 10, gap: 8 }]}>
                  <Text style={{ width: 22, fontSize: 14, textAlign: 'center' }}>{['🥇', '🥈', '🥉'][index] ?? `${index + 1}`}</Text>
                  <Text style={[{ flex: 1, fontSize: 13, color: text }, score.name === 'You' && { fontWeight: '700' }]}>
                    {score.name}
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#f97316', marginRight: 8 }}>🔥{score.streak}</Text>
                  <View style={[s.barBg, { width: 70, backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
                    <View
                      style={[
                        s.barFill,
                        {
                          width: `${(score.streak / group.days) * 100}%`,
                          backgroundColor: index === 0 ? '#f59e0b' : '#f97316',
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          ))}
      </ScrollView>

      {/* Battle Modal */}
      <BottomSheet visible={battleModal} onClose={() => setBattleModal(false)} theme={theme}>
        <Text style={[s.sheetTitle, { color: text }]}>New 1v1 Battle ⚔️</Text>
        <Text style={[s.sheetSub, { color: sub }]}>Habit</Text>
        {HABIT_OPTIONS.slice(0, 5).map(habit => (
          <TouchableOpacity key={habit} onPress={() => setBattleModal(false)} style={[s.pickRow, { borderColor: border, backgroundColor: card }]}>
            <Text style={{ color: text, fontSize: 14 }}>{habit}</Text>
          </TouchableOpacity>
        ))}
        <Text style={[s.sheetSub, { color: sub, marginTop: 14 }]}>Duration</Text>
        <View style={s.row}>
          {['7 days', '14 days', '30 days'].map(duration => (
            <TouchableOpacity key={duration} style={[s.durationChip, { borderColor: border }]}>
              <Text style={{ color: text, fontSize: 13 }}>{duration}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ marginTop: 20 }}>
          <Btn label="Send Challenge" onPress={() => setBattleModal(false)} theme={theme} full />
        </View>
      </BottomSheet>

      {/* Group Modal */}
      <BottomSheet visible={groupModal} onClose={() => setGroupModal(false)} theme={theme}>
        <Text style={[s.sheetTitle, { color: text }]}>New Group Challenge 👥</Text>
        <Text style={[s.sheetSub, { color: sub }]}>Group name</Text>
        <View style={[s.pickRow, { borderColor: border, backgroundColor: card }]}>
          <Text style={{ color: sub, fontSize: 14 }}>e.g. "Office Wellness"</Text>
        </View>
        <Text style={[s.sheetSub, { color: sub, marginTop: 14 }]}>Duration</Text>
        <View style={[s.row, { marginBottom: 20 }]}>
          {['7 days', '14 days', '30 days'].map(duration => (
            <TouchableOpacity key={duration} style={[s.durationChip, { borderColor: border }]}>
              <Text style={{ color: text, fontSize: 13 }}>{duration}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Btn label="Create Challenge" onPress={() => setGroupModal(false)} theme={theme} full />
      </BottomSheet>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  segment: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 16 },
  segBtn: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  segText: { fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 14, fontWeight: '600' },
  newBtn: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  card: { borderRadius: 14, padding: 16, marginTop: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardSub: { fontSize: 12, marginTop: 2 },
  pill: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10 },
  barLabel: { fontSize: 11, marginBottom: 5 },
  barBg: { borderRadius: 99, height: 7 },
  barFill: { height: 7, borderRadius: 99 },
  streakNum: { fontSize: 13, fontWeight: '700', marginTop: 5 },
  sheetTitle: { fontSize: 17, fontWeight: '700', marginBottom: 16 },
  sheetSub: { fontSize: 13, marginBottom: 8 },
  pickRow: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  durationChip: { flex: 1, borderWidth: 1, borderRadius: 10, paddingVertical: 9, alignItems: 'center', marginHorizontal: 3 },
});
