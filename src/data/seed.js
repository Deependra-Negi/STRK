export const HABITS = [
  { id: 1, name: 'Morning Walk', emoji: '🚶', streak: 14, completed: true },
  { id: 2, name: 'Reading', emoji: '📖', streak: 7, completed: false },
  { id: 3, name: 'Gym', emoji: '🏋️', streak: 21, completed: false },
];

export const FRIENDS = [
  { id: 1, name: 'Alex Kim', avatar: 'AK', habits: ['🚶 Walking', '📖 Reading'], streak: 18, pending: false },
  { id: 2, name: 'Priya Shah', avatar: 'PS', habits: ['🏋️ Gym', '🧘 Meditation'], streak: 12, pending: false },
  { id: 3, name: 'Jordan Lee', avatar: 'JL', habits: ['🚴 Cycling'], streak: 5, pending: false },
  { id: 4, name: 'Morgan Wu', avatar: 'MW', habits: ['📖 Reading'], streak: 30, pending: true },
];

export const BATTLES = [
  { id: 1, name: 'Morning Walk Battle', emoji: '🚶', challenger: 'Alex Kim', days: 14, myStreak: 9, theirStreak: 11, daysLeft: 5, status: 'active' },
  { id: 2, name: 'Reading Challenge', emoji: '📖', challenger: 'Priya Shah', days: 7, myStreak: 7, theirStreak: 6, daysLeft: 0, status: 'won' },
];

export const GROUPS = [
  {
    id: 1,
    name: 'Office Wellness',
    emoji: '🏃',
    habit: 'Daily Exercise',
    members: ['Alex Kim', 'Priya Shah', 'Jordan Lee', 'You'],
    days: 30,
    daysLeft: 18,
    scores: [
      { name: 'You', streak: 12 },
      { name: 'Priya Shah', streak: 15 },
      { name: 'Alex Kim', streak: 9 },
      { name: 'Jordan Lee', streak: 7 },
    ],
  },
];

export const HABIT_OPTIONS = [
  '🚶 Walking',
  '📖 Reading',
  '🏋️ Gym',
  '🧘 Meditation',
  '🚴 Cycling',
  '💧 Hydration',
  '🥗 Healthy Eating',
  '😴 Sleep 8hrs',
];

export const BADGES = [
  { emoji: '🔥', name: '7-Day Streak', earned: true },
  { emoji: '⚡', name: '14-Day Streak', earned: true },
  { emoji: '👑', name: 'Battle Winner', earned: true },
  { emoji: '💎', name: '30-Day Streak', earned: false },
  { emoji: '🌟', name: 'Group Leader', earned: false },
];

export const FEED = [
  { id: 1, user: 'Alex Kim', avatar: 'AK', habit: 'Morning Walk', emoji: '🚶', time: '2h ago', streak: 18 },
  { id: 2, user: 'Priya Shah', avatar: 'PS', habit: 'Gym', emoji: '🏋️', time: '4h ago', streak: 12 },
  { id: 3, user: 'Jordan Lee', avatar: 'JL', habit: 'Cycling', emoji: '🚴', time: '6h ago', streak: 5 },
];
