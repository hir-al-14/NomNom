export const colors = {
  background: '#FFF9F3',
  text: '#302B27',
  textMuted: '#71645A',
  surface: '#FFFFFF',
  primary: '#963B2E',
  selected: '#FCEAE2',
  border: '#E6D8CB',
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
