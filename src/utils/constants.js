// App constants
export const APP_NAME = 'SafeCircle';
export const APP_TAGLINE = "You're never alone when your community has your back.";

// Timing constants
export const GUARDIAN_SEARCH_TIMEOUT = 45000; // 45 seconds
export const RECORDING_MAX_DURATION = 3600; // 1 hour in seconds
export const ALERT_EXPIRY_TIME = 45; // seconds

// Radius options for guardian search (in meters)
export const RADIUS_OPTIONS = [
  { label: '100m', value: 100 },
  { label: '250m', value: 250 },
  { label: '500m', value: 500 },
  { label: '1km', value: 1000 },
];

// Default radius
export const DEFAULT_RADIUS = 500;

// Map settings
export const DEFAULT_MAP_DELTA = {
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// Copenhagen center coordinates (default)
export const DEFAULT_LOCATION = {
  latitude: 55.6761,
  longitude: 12.5683,
};

// Relationship types for contacts
export const RELATIONSHIP_TYPES = [
  'Family',
  'Friend',
  'Partner',
  'Colleague',
  'Neighbor',
  'Other',
];

// Safe place types with icons
export const SAFE_PLACE_TYPES = {
  bar: { icon: 'local-bar', color: '#8B5CF6' },
  store: { icon: 'store', color: '#10B981' },
  transit: { icon: 'train', color: '#3B82F6' },
  hospital: { icon: 'local-hospital', color: '#DC2626' },
  police: { icon: 'local-police', color: '#1D4ED8' },
  restaurant: { icon: 'restaurant', color: '#F59E0B' },
};

// Time-based greetings
export const getGreeting = (name) => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: `Good morning, ${name}!`,
      subtitle: 'Start your day feeling safe',
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      greeting: `Good afternoon, ${name}!`,
      subtitle: 'How can we help you today?',
    };
  } else if (hour >= 18 && hour < 22) {
    return {
      greeting: `Good evening, ${name}!`,
      subtitle: 'Stay safe on your way home',
    };
  } else {
    return {
      greeting: `Hi, ${name}!`,
      subtitle: "We're here if you need us",
    };
  }
};

// Languages supported
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'da', label: 'Dansk' },
  { code: 'de', label: 'Deutsch' },
  { code: 'sv', label: 'Svenska' },
  { code: 'no', label: 'Norsk' },
];

