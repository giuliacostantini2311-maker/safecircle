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
  helpsCount: 28, // Silver badge for demo
  gender: 'female',
};

// Helper function to generate display name (First name + Last initial)
export const getDisplayName = (firstName, lastName) => {
  if (!firstName) return 'User';
  const lastInitial = lastName ? `${lastName.charAt(0)}.` : '';
  return `${firstName} ${lastInitial}`.trim();
};

// Helper function to generate realistic avatar URLs using DiceBear
// Using PNG format for React Native mobile compatibility
// Using 'lorelei' style for female, 'lorelei-neutral' seeds for male to ensure gender match
const getAvatarUrl = (seed, gender = 'female') => {
  // Use different styles/seeds to match gender
  if (gender === 'male') {
    // Use 'adventurer-neutral' for more masculine looking avatars
    return `https://api.dicebear.com/7.x/adventurer-neutral/png?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&size=200`;
  }
  // Use 'lorelei' for feminine looking avatars
  return `https://api.dicebear.com/7.x/lorelei/png?seed=${seed}&backgroundColor=ffd5dc,ffdfbf,d1d4f9&size=200`;
};

export const mockGuardians = [
  { 
    id: 'guardian_1', 
    firstName: 'Emma',
    lastName: 'Sørensen',
    username: 'emma_s',
    gender: 'female',
    avatar: getAvatarUrl('emma_female_1', 'female'), 
    rating: 94, 
    distance: 300,
    helpsCount: 52, // Gold badge
    memberSince: '2023-06',
  },
  { 
    id: 'guardian_2', 
    firstName: 'Lars',
    lastName: 'Kristensen',
    username: 'lars_k',
    gender: 'male',
    avatar: getAvatarUrl('lars_male_1', 'male'), 
    rating: 88, 
    distance: 450,
    helpsCount: 8, // Bronze badge
    memberSince: '2023-09',
  },
  { 
    id: 'guardian_3', 
    firstName: 'Sofia',
    lastName: 'Mortensen',
    username: 'sofia_m',
    gender: 'female',
    avatar: getAvatarUrl('sofia_female_1', 'female'), 
    rating: 97, 
    distance: 200,
    helpsCount: 120, // Diamond badge
    memberSince: '2023-03',
  },
  { 
    id: 'guardian_4', 
    firstName: 'Anders',
    lastName: 'Johansen',
    username: 'anders_j',
    gender: 'male',
    avatar: getAvatarUrl('anders_male_1', 'male'), 
    rating: 91, 
    distance: 600,
    helpsCount: 25, // Silver badge
    memberSince: '2023-07',
  },
  { 
    id: 'guardian_5', 
    firstName: 'Mia',
    lastName: 'Nielsen',
    username: 'mia_n',
    gender: 'female',
    avatar: getAvatarUrl('mia_female_1', 'female'), 
    rating: 85, 
    distance: 350,
    helpsCount: 3, // Copper badge
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
    firstName: 'Maria',
    lastName: 'Jensen',
    username: 'maria_j',
    gender: 'female',
    relationship: 'Family', 
    phone: '+45 12345678',
    avatar: getAvatarUrl('maria_female_2', 'female'),
    helpsCount: 15, // Silver badge
  },
  { 
    id: 'contact_2', 
    firstName: 'Anna',
    lastName: 'Karlsen',
    username: 'anna_k',
    gender: 'female',
    relationship: 'Friend', 
    phone: '+45 87654321',
    avatar: getAvatarUrl('anna_female_1', 'female'),
    helpsCount: 7, // Bronze badge
  },
  { 
    id: 'contact_3', 
    firstName: 'Michael',
    lastName: 'Petersen',
    username: 'michael_p',
    gender: 'male',
    relationship: 'Partner', 
    phone: '+45 55566677',
    avatar: getAvatarUrl('michael_male_1', 'male'),
    helpsCount: 2, // Copper badge
  },
];

export const mockConnectedGuardians = [
  { 
    id: 'connected_1', 
    firstName: 'Emma',
    lastName: 'Sørensen',
    username: 'emma_s',
    gender: 'female',
    helpedOn: '2024-01-15', 
    rating: 'up',
    avatar: getAvatarUrl('emma_female_1', 'female'),
    helpsCount: 52, // Gold badge
  },
  { 
    id: 'connected_2', 
    firstName: 'Lars',
    lastName: 'Kristensen',
    username: 'lars_k',
    gender: 'male',
    helpedOn: '2024-01-10', 
    rating: 'up',
    avatar: getAvatarUrl('lars_male_1', 'male'),
    helpsCount: 8, // Bronze badge
  },
];

// SafeCircle Users - people you've interacted with (helped or been helped by)
export const mockSafeCircleUsers = [
  {
    id: 'sc_user_1',
    firstName: 'Emma',
    lastName: 'Sørensen',
    username: 'emma_sor',
    gender: 'female',
    avatar: getAvatarUrl('emma_female_3', 'female'),
    helpsCount: 85, // Gold badge
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
    firstName: 'Laura',
    lastName: 'Karlsen',
    username: 'laura_k',
    gender: 'female',
    avatar: getAvatarUrl('laura_female_1', 'female'),
    helpsCount: 3, // Copper badge
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
    firstName: 'Sofia',
    lastName: 'Madsen',
    username: 'sofia_mad',
    gender: 'female',
    avatar: getAvatarUrl('sofia_female_2', 'female'),
    helpsCount: 150, // Diamond badge
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
    firstName: 'Anna',
    lastName: 'Jensen',
    username: 'anna_jen',
    gender: 'female',
    avatar: getAvatarUrl('anna_female_2', 'female'),
    helpsCount: 12, // Silver badge
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
    firstName: 'Mia',
    lastName: 'Nielsen',
    username: 'mia_nie',
    gender: 'female',
    avatar: getAvatarUrl('mia_female_2', 'female'),
    helpsCount: 6, // Bronze badge
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
    firstName: 'Caroline',
    lastName: 'Hansen',
    username: 'caroline_h',
    gender: 'female',
    avatar: getAvatarUrl('caroline_female_1', 'female'),
    helpsCount: 0, // No badge
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
    firstName: 'Maria',
    lastName: 'Lindgren',
    username: 'maria_l',
    gender: 'female',
    avatar: getAvatarUrl('maria_female_3', 'female'),
    helpsCount: 2, // Copper badge
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
    firstName: 'Sofia',
    lastName: 'Nielsen',
    username: 'sofia_n',
    gender: 'female',
    avatar: getAvatarUrl('sofia_female_3', 'female'),
    helpsCount: 18, // Silver badge
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
    firstName: 'Emma',
    lastName: 'Hansen',
    username: 'emma_h',
    gender: 'female',
    avatar: getAvatarUrl('emma_female_4', 'female'),
    helpsCount: 0, // No badge
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
    firstName: 'Lisa',
    lastName: 'Karlsson',
    username: 'lisa_k',
    gender: 'female',
    avatar: getAvatarUrl('lisa_female_1', 'female'),
    helpsCount: 7, // Bronze badge
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
    firstName: 'Anna',
    lastName: 'Madsen',
    username: 'anna_m',
    gender: 'female',
    avatar: getAvatarUrl('anna_female_3', 'female'),
    helpsCount: 65, // Gold badge
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
