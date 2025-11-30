// Mock data for demo purposes

export const mockUser = {
  id: 'user_1',
  firstName: 'Sarah',
  lastName: 'Jensen',
  email: 'sarah.jensen@example.com',
  phone: '+45 12345678',
  username: 'sarahjensen',
  avatar: null,
  verified: true,
  language: 'en',
  createdAt: '2024-01-01',
};

export const mockGuardians = [
  { 
    id: 'guardian_1', 
    name: 'Emma S.', 
    firstName: 'Emma',
    avatar: null, 
    rating: 94, 
    distance: 300,
    helpCount: 12,
    memberSince: '2023-06',
  },
  { 
    id: 'guardian_2', 
    name: 'Lars K.', 
    firstName: 'Lars',
    avatar: null, 
    rating: 88, 
    distance: 450,
    helpCount: 8,
    memberSince: '2023-09',
  },
  { 
    id: 'guardian_3', 
    name: 'Sofia M.', 
    firstName: 'Sofia',
    avatar: null, 
    rating: 97, 
    distance: 200,
    helpCount: 23,
    memberSince: '2023-03',
  },
  { 
    id: 'guardian_4', 
    name: 'Anders J.', 
    firstName: 'Anders',
    avatar: null, 
    rating: 91, 
    distance: 600,
    helpCount: 15,
    memberSince: '2023-07',
  },
  { 
    id: 'guardian_5', 
    name: 'Mia N.', 
    firstName: 'Mia',
    avatar: null, 
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
    name: 'Mom', 
    relationship: 'Family', 
    phone: '+45 12345678',
    avatar: null,
  },
  { 
    id: 'contact_2', 
    name: 'Best Friend Anna', 
    relationship: 'Friend', 
    phone: '+45 87654321',
    avatar: null,
  },
  { 
    id: 'contact_3', 
    name: 'Partner Michael', 
    relationship: 'Partner', 
    phone: '+45 55566677',
    avatar: null,
  },
];

export const mockConnectedGuardians = [
  { 
    id: 'connected_1', 
    name: 'Emma S.', 
    helpedOn: '2024-01-15', 
    rating: 'up',
    avatar: null,
  },
  { 
    id: 'connected_2', 
    name: 'Lars K.', 
    helpedOn: '2024-01-10', 
    rating: 'up',
    avatar: null,
  },
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

