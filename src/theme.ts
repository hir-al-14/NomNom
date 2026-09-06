export const colors = {
  background: '#FFFFFF',
  text: '#0A2533',
  textMuted: '#48525F',
  surface: '#FFFFFF',
  primary: '#353535',
  selected: '#EEF7F7',
  border: '#4D8194',
  accent: '#F7A8AD',
  divider: '#FDE2E3',
  link: '#4DA2EC',
  teal: '#68B6BC',
  deepTeal: '#042628',
  mutedIcon: '#97A5B9',
  paleTeal: '#E1EEF0',
  tabs: '#E6EBF2',
  high: '#EB7B7F',
  medium: '#E48B33',
  low: '#68B389',
} as const;

export const spacing = {
  textGap: 12,
  screenPadding: 24,
} as const;

export const typography = {
  section: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: 'Manrope_700Bold',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Manrope_700Bold',
  },
  body: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
} as const;

export const cardShadow = {
  shadowColor: '#063336',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3,
} as const;
