import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FRIENDS } from '../data/seed';
import Avatar from '../components/Avatar';
import SectionLabel from '../components/SectionLabel';
import Toast from '../components/Toast';
import BottomSheet from '../components/BottomSheet';

export default function FriendsScreen({ theme }) {
  const [friends, setFriends] = useState([]);
  const [contactPickerOpen, setContactPickerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const { bg, card, border, text, sub, dark: isDark } = theme;

  const pending = friends.filter(friend => friend.pending);
  const active = friends.filter(friend => !friend.pending);
  const availableContacts = FRIENDS.filter(contact => !friends.some(friend => friend.id === contact.id));

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {pending.length > 0 && (
          <>
            <SectionLabel label="REQUESTS" theme={theme} />
            {pending.map(friend => (
              <View key={friend.id} style={[s.card, { backgroundColor: card }]}>
                <Avatar initials={friend.avatar} theme={theme} />
                <View style={{ flex: 1 }}>
                  <Text style={[s.name, { color: text }]}>{friend.name}</Text>
                  <Text style={[s.habits, { color: sub }]}>{friend.habits.join(', ')}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setFriends(currentFriends => currentFriends.filter(item => item.id !== friend.id))}
                  style={[s.iconBtn, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }]}
                >
                  <Text style={{ color: text }}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setFriends(currentFriends => currentFriends.map(item => (item.id === friend.id ? { ...item, pending: false } : item)))
                  }
                  style={[s.acceptBtn, { backgroundColor: text }]}
                >
                  <Text style={{ color: isDark ? '#111' : '#fff', fontWeight: '600', fontSize: 12 }}>Accept</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {active.length === 0 && pending.length === 0 ? (
          <View style={[s.emptyCard, { borderColor: border, backgroundColor: card }]}>
            <Text style={[s.emptyTitle, { color: text }]}>No friends yet</Text>
            <Text style={[s.emptySub, { color: sub }]}>
              Add friends from your contacts to compare streaks and start battles.
            </Text>
            <TouchableOpacity style={[s.addPrimary, { backgroundColor: text }]} onPress={() => setContactPickerOpen(true)}>
              <Text style={{ color: isDark ? '#111' : '#fff', fontWeight: '600', fontSize: 13 }}>+ Add from contacts</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <SectionLabel label={`FRIENDS (${active.length})`} theme={theme} />
            {active.map(friend => (
              <View key={friend.id} style={[s.card, { backgroundColor: card }]}>
                <Avatar initials={friend.avatar} theme={theme} />
                <View style={{ flex: 1 }}>
                  <Text style={[s.name, { color: text }]}>{friend.name}</Text>
                  <Text style={{ fontSize: 12, color: '#f97316', marginTop: 2 }}>🔥 {friend.streak} day streak</Text>
                </View>
                <TouchableOpacity style={[s.iconBtn, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5', paddingHorizontal: 12 }]}>
                  <Text style={{ color: text, fontSize: 12, fontWeight: '600' }}>⚔️ Battle</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={[s.addCard, { borderColor: border }]} onPress={() => setContactPickerOpen(true)}>
              <Text style={{ color: sub, fontSize: 13 }}>+ Add a friend</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <BottomSheet visible={contactPickerOpen} onClose={() => setContactPickerOpen(false)} theme={theme}>
        <Text style={[s.sheetTitle, { color: text }]}>Add from contacts</Text>
        {availableContacts.map(contact => (
          <TouchableOpacity
            key={contact.id}
            onPress={() => {
              setFriends(current => [...current, { ...contact, pending: false }]);
              setContactPickerOpen(false);
              setToast(`Added ${contact.name}`);
            }}
            style={[s.pickRow, { borderColor: border, backgroundColor: card }]}
          >
            <Avatar initials={contact.avatar} theme={theme} />
            <View style={{ flex: 1 }}>
              <Text style={[s.name, { color: text }]}>{contact.name}</Text>
              <Text style={[s.habits, { color: sub }]}>{contact.habits.join(', ')}</Text>
            </View>
            <Text style={{ color: sub, fontSize: 12 }}>Add</Text>
          </TouchableOpacity>
        ))}
        {availableContacts.length === 0 && (
          <Text style={{ color: sub, fontSize: 13, textAlign: 'center', marginTop: 8 }}>
            No more contacts to add right now.
          </Text>
        )}
      </BottomSheet>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 14, marginBottom: 10 },
  name: { fontSize: 14, fontWeight: '600' },
  habits: { fontSize: 12, marginTop: 2 },
  iconBtn: { borderRadius: 8, padding: 8 },
  acceptBtn: { borderRadius: 8, paddingVertical: 6, paddingHorizontal: 14 },
  addCard: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 14, padding: 14, alignItems: 'center', marginBottom: 20 },
  emptyCard: { borderWidth: 1, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 14 },
  addPrimary: { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16 },
  sheetTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  pickRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
});
