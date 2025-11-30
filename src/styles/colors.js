// Nordic Dusk - Premium Scandinavian Safety Palette

export const colors = {
  // Primary actions - deep calming blue with warmth
  primary: '#3D5A80',
  primaryLight: '#5C7A9E',
  primaryDark: '#2B4159',
  
  // Guardian mode - warm amber, not orange
  guardian: '#D4A574',
  guardianLight: '#E8C9A8',
  guardianDark: '#B8895A',
  
  // Emergency - muted but clear red
  emergency: '#C1666B',
  emergencyLight: '#D4898D',
  emergencyDark: '#A34D52',
  
  // Safe/Success - sage green
  safe: '#7EA172',
  safeLight: '#A3C197',
  safeDark: '#5E8153',
  
  // Backgrounds - warm off-whites and soft darks
  background: '#FAF8F5',        // warm paper white
  backgroundAlt: '#F2EDE7',     // slightly darker for cards
  backgroundDark: '#1A1D23',    // soft charcoal, not pure black
  
  // Text - warm grays, never pure black
  text: '#2D3142',              // primary text
  textSecondary: '#6B7280',     // secondary
  textMuted: '#9CA3AF',         // hints, placeholders
  textLight: '#F9FAFB',         // text on dark backgrounds
  
  // UI Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Accents
  border: '#E5E0D8',            // warm gray border
  borderLight: '#EDE9E3',
  borderFocus: '#3D5A80',       // focus state
  shadow: 'rgba(45, 49, 66, 0.08)',  // soft warm shadow
  overlay: 'rgba(26, 29, 35, 0.6)',  // dark overlay
  overlayLight: 'rgba(26, 29, 35, 0.3)',
  
  // Status indicators
  online: '#7EA172',
  offline: '#9CA3AF',
  recording: '#C1666B',
  searching: '#D4A574',
  warning: '#D4A574',
  info: '#3D5A80',
};

// Typography system
export const typography = {
  // Large display - for greetings, main headers
  display: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  
  // Page titles
  title: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  
  // Section headers
  heading: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 24,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.1,
    lineHeight: 24,
  },
  
  // Secondary text, descriptions
  caption: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  
  // Small labels, badges
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.4,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
};

// Spacing system (4px base unit)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Specific use cases
  screenPadding: 20,
  cardPadding: 20,
  sectionGap: 32,
  itemGap: 12,
};
