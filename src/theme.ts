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
} as const;

export const spacing = {
  textGap: 12,
  screenPadding: 24,
} as const;

export const typography = {
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
