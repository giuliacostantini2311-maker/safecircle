// Mock data for demo purposes

export const mockUser = {
  id: 'user_1',
  firstName: 'Sarah',
  lastName: 'Jensen',
  email: 'sarah.jensen@example.com',
  phone: '+45 12345678',
  username: 'sarahjensen',
  avatar: null, // User's uploaded picture will be stored here
  verified: true,
  language: 'en',
  createdAt: '2024-01-01',
};

// Helper function to generate realistic avatar URLs using DiceBear
const getAvatarUrl = (seed, style = 'avataaars') => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

export const mockGuardians = [
  { 
    id: 'guardian_1', 
    username: 'emma_s',
    avatar: getAvatarUrl('emma_s', 'avataaars'), 
    rating: 94, 
    distance: 300,
    helpCount: 12,
    memberSince: '2023-06',
  },
  { 
    id: 'guardian_2', 
    username: 'lars_k',
    avatar: getAvatarUrl('lars_k', 'avataaars'), 
    rating: 88, 
    distance: 450,
    helpCount: 8,
    memberSince: '2023-09',
  },
  { 
    id: 'guardian_3', 
    username: 'sofia_m',
    avatar: getAvatarUrl('sofia_m', 'avataaars'), 
    rating: 97, 
    distance: 200,
    helpCount: 23,
    memberSince: '2023-03',
  },
  { 
    id: 'guardian_4', 
    username: 'anders_j',
    avatar: getAvatarUrl('anders_j', 'avataaars'), 
    rating: 91, 
    distance: 600,
    helpCount: 15,
    memberSince: '2023-07',
  },
  { 
    id: 'guardian_5', 
    username: 'mia_n',
    avatar: getAvatarUrl('mia_n', 'avataaars'), 
    rating: 85, 
    distance: 350,
    helpCount: 5,
    memberSince: '2024-01',
  },
];

export const mockSafePlaces = [
  { 
    id: 'place_1', 
    name: "O'Reilly's Irish Bar", 
    type: 'bar', 
    distance: 200, 
    open: true, 
    address: 'Frederiksborggade 15',
    lat: 55.6761, 
    lng: 12.5683,
  },
  { 
    id: 'place_2', 
    name: '7-Eleven', 
    type: 'store', 
    distance: 350, 
    open: true, 
    address: 'Vesterbrogade 42',
    lat: 55.6770, 
    lng: 12.5690,
  },
  { 
    id: 'place_3', 
    name: 'Copenhagen Central Station', 
    type: 'transit', 
    distance: 500, 
    open: true, 
    address: 'Bernstorffsgade 16',
    lat: 55.6728, 
    lng: 12.5650,
  },
  { 
    id: 'place_4', 
    name: 'Rigshospitalet', 
    type: 'hospital', 
    distance: 1200, 
    open: true, 
    address: 'Blegdamsvej 9',
    lat: 55.6962, 
    lng: 12.5664,
  },
  { 
    id: 'place_5', 
    name: 'Police Station', 
    type: 'police', 
    distance: 800, 
    open: true, 
    address: 'Polititorvet 14',
    lat: 55.6800, 
    lng: 12.5700,
  },
];

export const mockTrustedContacts = [
  { 
    id: 'contact_1', 
    username: 'maria_mom',
    relationship: 'Family', 
    phone: '+45 12345678',
    avatar: getAvatarUrl('maria_mom', 'avataaars'),
  },
  { 
    id: 'contact_2', 
    username: 'anna_k',
    relationship: 'Friend', 
    phone: '+45 87654321',
    avatar: getAvatarUrl('anna_k', 'avataaars'),
  },
  { 
    id: 'contact_3', 
    username: 'michael_p',
    relationship: 'Partner', 
    phone: '+45 55566677',
    avatar: getAvatarUrl('michael_p', 'avataaars'),
  },
];

export const mockConnectedGuardians = [
  { 
    id: 'connected_1', 
    username: 'emma_s',
    helpedOn: '2024-01-15', 
    rating: 'up',
    avatar: getAvatarUrl('emma_s', 'avataaars'),
  },
  { 
    id: 'connected_2', 
    username: 'lars_k',
    helpedOn: '2024-01-10', 
    rating: 'up',
    avatar: getAvatarUrl('lars_k', 'avataaars'),
  },
];

// SafeCircle Users - people you've interacted with (helped or been helped by)
export const mockSafeCircleUsers = [
  {
    id: 'sc_user_1',
    username: 'emma_sor',
    avatar: getAvatarUrl('emma_sor', 'avataaars'),
    lastActivity: {
      type: 'helped_you', // This person helped you
      date: '2024-11-28',
    },
    stats: {
      timesHelpedYou: 3,
      timesYouHelped: 1,
    },
    thankYouNote: null, // No note (they helped you, not the other way)
  },
  {
    id: 'sc_user_2',
    username: 'laura_k',
    avatar: getAvatarUrl('laura_k', 'avataaars'),
    lastActivity: {
      type: 'you_helped', // You helped this person
      date: '2024-11-25',
    },
    stats: {
      timesHelpedYou: 0,
      timesYouHelped: 2,
    },
    thankYouNote: {
      received: true,
      read: false,
      message: "Just wanted to say thank you again for helping me yesterday. It honestly meant a lot. You being here on this platform, even if you might not need help yourself, really makes a difference. Not just for me, but for other women here too.\n\nThank you, truly.",
    },
  },
  {
    id: 'sc_user_3',
    username: 'sofia_mad',
    avatar: getAvatarUrl('sofia_mad', 'avataaars'),
    lastActivity: {
      type: 'helped_you',
      date: '2024-11-20',
    },
    stats: {
      timesHelpedYou: 2,
      timesYouHelped: 0,
    },
    thankYouNote: null,
  },
  {
    id: 'sc_user_4',
    username: 'anna_jen',
    avatar: getAvatarUrl('anna_jen', 'avataaars'),
    lastActivity: {
      type: 'you_helped',
      date: '2024-11-15',
    },
    stats: {
      timesHelpedYou: 1,
      timesYouHelped: 4,
    },
    thankYouNote: {
      received: true,
      read: true, // Already read
      message: "I just wanted to reach out and say a huge thank you for walking with me the other night. I was feeling really scared and you made me feel so much safer.\n\nI'm so grateful this app exists and that people like you are on it. 💜",
    },
  },
  {
    id: 'sc_user_5',
    username: 'mia_nie',
    avatar: getAvatarUrl('mia_nie', 'avataaars'),
    lastActivity: {
      type: 'helped_you',
      date: '2024-11-10',
    },
    stats: {
      timesHelpedYou: 1,
      timesYouHelped: 1,
    },
    thankYouNote: null,
  },
  {
    id: 'sc_user_6',
    username: 'caroline_h',
    avatar: getAvatarUrl('caroline_h', 'avataaars'),
    lastActivity: {
      type: 'you_helped',
      date: '2024-11-05',
    },
    stats: {
      timesHelpedYou: 0,
      timesYouHelped: 3,
    },
    thankYouNote: null, // No note sent yet
  },
];

// Callers currently needing help (for Guardian Journey)
export const mockCallersNeedingHelp = [
  {
    id: 'caller_1',
    username: 'maria_l',
    firstName: 'Maria',
    lastName: 'Lindgren',
    avatar: getAvatarUrl('maria_lindgren', 'avataaars'),
    distance: 300, // meters
    walkTime: 3, // minutes
    location: {
      lat: 55.6762,
      lng: 12.5684,
    },
    message: "Walking alone. Feeling unsafe. Need company.",
    requestedAt: new Date().toISOString(),
  },
  {
    id: 'caller_2',
    username: 'sofia_n',
    firstName: 'Sofia',
    lastName: 'Nielsen',
    avatar: getAvatarUrl('sofia_nielsen', 'avataaars'),
    distance: 450,
    walkTime: 5,
    location: {
      lat: 55.6771,
      lng: 12.5691,
    },
    message: "Someone following me. Please help.",
    requestedAt: new Date().toISOString(),
  },
  {
    id: 'caller_3',
    username: 'emma_h',
    firstName: 'Emma',
    lastName: 'Hansen',
    avatar: getAvatarUrl('emma_hansen', 'avataaars'),
    distance: 600,
    walkTime: 7,
    location: {
      lat: 55.6750,
      lng: 12.5670,
    },
    message: null, // No message written
    requestedAt: new Date().toISOString(),
  },
  {
    id: 'caller_4',
    username: 'lisa_k',
    firstName: 'Lisa',
    lastName: 'Karlsson',
    avatar: getAvatarUrl('lisa_karlsson', 'avataaars'),
    distance: 250,
    walkTime: 2,
    location: {
      lat: 55.6755,
      lng: 12.5680,
    },
    message: "Dark street. Scared. Can someone come?",
    requestedAt: new Date().toISOString(),
  },
  {
    id: 'caller_5',
    username: 'anna_m',
    firstName: 'Anna',
    lastName: 'Madsen',
    avatar: getAvatarUrl('anna_madsen', 'avataaars'),
    distance: 500,
    walkTime: 6,
    location: {
      lat: 55.6768,
      lng: 12.5695,
    },
    message: null, // No message written
    requestedAt: new Date().toISOString(),
  },
];

// Guardian levels/milestones
export const guardianLevels = [
  { level: 1, name: 'Bronze Guardian', helpsRequired: 0, icon: '🥉' },
  { level: 2, name: 'Copper Guardian', helpsRequired: 1, icon: '🔶' },
  { level: 3, name: 'Silver Guardian', helpsRequired: 5, icon: '🥈' },
  { level: 4, name: 'Gold Guardian', helpsRequired: 10, icon: '🥇' },
  { level: 5, name: 'Platinum Guardian', helpsRequired: 25, icon: '💎' },
  { level: 6, name: 'Diamond Guardian', helpsRequired: 50, icon: '💠' },
];

export const mockChatMessages = [
  { 
    id: 'msg_1', 
    sender: 'guardian', 
    text: "Hi! I'm nearby. How can I help you feel safe?",
    timestamp: new Date().toISOString(),
  },
];

export const mockQuickReplies = [
  "Can you stay on chat?",
  "Can you walk towards me?",
  "Just need company until I'm home",
  "I'm at a location I can share",
];

// Helper function to generate safe places around a given location
export const generateSafePlacesNearLocation = (latitude, longitude) => {
  return mockSafePlaces.map((place, index) => ({
    ...place,
    lat: latitude + (Math.random() - 0.5) * 0.01,
    lng: longitude + (Math.random() - 0.5) * 0.01,
  }));
};

// Helper function to simulate nearby guardians count
export const getNearbyGuardiansCount = () => {
  return Math.floor(Math.random() * 10) + 5; // 5-15 guardians
};

// Mock addresses for demo
export const mockAddresses = [
  'Vesterbrogade 42, 1620 København V',
  'Nørrebrogade 15, 2200 København N',
  'Østerbrogade 100, 2100 København Ø',
  'Strøget 35, 1160 København K',
  'Amagerbrogade 50, 2300 København S',
];

// Get a random mock address
export const getRandomAddress = () => {
  return mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
};
