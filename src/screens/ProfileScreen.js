import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HABITS, BADGES } from '../data/seed';
import Toggle from '../components/Toggle';
import SectionLabel from '../components/SectionLabel';
import Toast from '../components/Toast';

export default function ProfileScreen({ theme, freezeTokens, isDark, toggleDark }) {
  const [notif, setNotif] = useState({
    daily: true,
    streakRisk: true,
    friendActivity: false,
    battleUpdates: true,
    time: '08:00',
  });
  const [showNotif, setShowNotif] = useState(false);
  const [toast, setToast] = useState(null);
  const { bg, card, border, text, sub, dark: isThemeDark } = theme;
  const total = HABITS.reduce((sum, habit) => sum + habit.streak, 0);

  const toggleNotif = key => {
    setNotif(currentNotif => ({ ...currentNotif, [key]: !currentNotif[key] }));
    setToast('Settings saved ✓');
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={[s.profileCard, { backgroundColor: card }]}>
          <View style={[s.avatar, { backgroundColor: text }]}>
            <Text style={{ color: isThemeDark ? '#111' : '#fff', fontWeight: '700', fontSize: 20 }}>YO</Text>
          </View>
          <Text style={[s.profileName, { color: text }]}>You</Text>
          <Text style={[s.profileSince, { color: sub }]}>Member since Jan 2025</Text>
          <View style={s.statsRow}>
            {[['Total Days', total], ['Habits', HABITS.length], ['Battles Won', 1]].map(([label, val]) => (
              <View key={label} style={{ alignItems: 'center' }}>
                <Text style={[s.statVal, { color: text }]}>{val}</Text>
                <Text style={[s.statLabel, { color: sub }]}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Freeze tokens */}
        <View
          style={[
            s.freezeCard,
            { backgroundColor: isThemeDark ? '#2a1a0a' : '#fff7ed', borderColor: isThemeDark ? '#7c3000' : '#fed7aa' },
          ]}
        >
          <Text style={{ fontSize: 28 }}>🧊</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '600', fontSize: 14, color: '#ea580c' }}>{freezeTokens} Freeze Tokens</Text>
            <Text style={{ fontSize: 12, color: isThemeDark ? '#c2410c' : '#9a3412', marginTop: 2 }}>
              3 more days to earn next token
            </Text>
            <View style={[s.barBg, { backgroundColor: isThemeDark ? '#7c2d12' : '#fde68a', marginTop: 6 }]}>
              <View style={[s.barFill, { width: '57%' }]} />
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={[s.appearanceCard, { backgroundColor: card }]}>
          <Text style={[s.appearanceTitle, { color: text }]}>🌗 Appearance</Text>
          <View style={[s.appearanceRow, { borderTopColor: border }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: text }}>Dark mode</Text>
              <Text style={{ fontSize: 11, color: sub, marginTop: 1 }}>
                Follow device theme by default
              </Text>
            </View>
            <Toggle value={isDark} onChange={toggleDark} />
          </View>
        </View>

        {/* Notifications */}
        <View style={[s.notifContainer, { backgroundColor: card }]}>
          <TouchableOpacity onPress={() => setShowNotif(value => !value)} style={s.notifHeader}>
            <Text style={[s.notifTitle, { color: text }]}>🔔 Notifications</Text>
            <Text style={{ color: sub, fontSize: 11 }}>{showNotif ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {showNotif && (
            <View style={[s.notifBody, { borderTopColor: border }]}>
              {[
                ['daily', 'Daily reminder', notif.time],
                ['streakRisk', 'Streak at risk', 'Before midnight'],
                ['friendActivity', 'Friend activity', 'Real-time'],
                ['battleUpdates', 'Battle updates', 'Real-time'],
              ].map(([key, label, hint], index, rows) => (
                <View
                  key={key}
                  style={[s.notifRow, index < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: border }]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, color: text }}>{label}</Text>
                    <Text style={{ fontSize: 11, color: sub, marginTop: 1 }}>{hint}</Text>
                  </View>
                  <Toggle value={notif[key]} onChange={() => toggleNotif(key)} />
                </View>
              ))}
              <View style={[s.timePicker, { borderTopColor: border }]}>
                <Text style={{ fontSize: 12, color: sub, marginBottom: 8 }}>Reminder time</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {['07:00', '08:00', '09:00', '12:00'].map(timeValue => (
                    <TouchableOpacity
                      key={timeValue}
                      onPress={() => setNotif(current => ({ ...current, time: timeValue }))}
                      style={[
                        s.timeChip,
                        {
                          borderColor: notif.time === timeValue ? '#f97316' : border,
                          backgroundColor: notif.time === timeValue ? (isThemeDark ? '#2a1500' : '#fff7ed') : card,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 12, color: notif.time === timeValue ? '#f97316' : text, fontWeight: notif.time === timeValue ? '700' : '400' }}>
                        {timeValue}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Badges */}
        <SectionLabel label="BADGES" theme={theme} />
        <View style={s.badgeGrid}>
          {BADGES.map(badge => (
            <View key={badge.name} style={[s.badge, { backgroundColor: card, opacity: badge.earned ? 1 : 0.35 }]}>
              <Text style={{ fontSize: 28 }}>{badge.emoji}</Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: text, marginTop: 6, textAlign: 'center' }}>
                {badge.name}
              </Text>
              {!badge.earned && <Text style={{ fontSize: 10, color: sub, marginTop: 2 }}>Locked</Text>}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  profileCard: { borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  profileName: { fontSize: 17, fontWeight: '700' },
  profileSince: { fontSize: 12, marginTop: 2, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 28 },
  statVal: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  statLabel: { fontSize: 11, textAlign: 'center' },
  freezeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 12 },
  appearanceCard: { borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  appearanceTitle: { fontSize: 14, fontWeight: '600', padding: 14 },
  appearanceRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12, borderTopWidth: 1 },
  barBg: { borderRadius: 99, height: 4 },
  barFill: { height: 4, borderRadius: 99, backgroundColor: '#ea580c', width: '57%' },
  notifContainer: { borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  notifTitle: { fontSize: 14, fontWeight: '600' },
  notifBody: { borderTopWidth: 1 },
  notifRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  timePicker: { borderTopWidth: 1, padding: 12 },
  timeChip: { flex: 1, borderWidth: 1.5, borderRadius: 9, paddingVertical: 7, alignItems: 'center' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badge: { width: '47%', borderRadius: 14, padding: 14, alignItems: 'center' },
});
