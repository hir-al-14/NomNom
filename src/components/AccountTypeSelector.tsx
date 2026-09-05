import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

export type AccountType = 'personal' | 'restaurant';

type Props = {
  value: AccountType;
  onChange: (value: AccountType) => void;
  fontsLoaded: boolean;
};

const options = [
  { value: 'personal', label: 'Recovery user', detail: 'Find food that fits your recovery.' },
  { value: 'restaurant', label: 'Restaurant owner', detail: 'Help your guests eat with confidence.' },
] as const;

export function AccountTypeSelector({ value, onChange, fontsLoaded }: Props) {
  return (
    <View style={styles.group}>
      <Text style={[styles.label, !fontsLoaded && styles.fontFallback]}>
        How will you use NomNom?
      </Text>
      {options.map((option) => (
        <Pressable
          key={option.value}
          accessibilityRole="radio"
          accessibilityLabel={option.label}
          accessibilityHint={option.detail}
          accessibilityState={{ checked: value === option.value }}
          onPress={() => onChange(option.value)}
          style={({ pressed }) => [
            styles.option,
            value === option.value && styles.selected,
            pressed && { opacity: 0.75 },
          ]}
        >
          <Text style={[styles.label, !fontsLoaded && styles.fontFallback]}>
            {value === option.value ? '●  ' : '○  '}{option.label}
          </Text>
          <Text style={[styles.detail, !fontsLoaded && styles.fontFallback]}>
            {option.detail}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: '100%',
    maxWidth: 480,
    gap: spacing.textGap,
    marginTop: spacing.screenPadding,
  },
  option: {
    minHeight: 48,
    padding: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
  },
  label: {
    ...typography.body,
    color: colors.text,
  },
  selected: {
    backgroundColor: colors.selected,
    borderColor: colors.primary,
  },
  detail: {
    ...typography.body,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  fontFallback: {
    fontFamily: undefined,
  },
});
