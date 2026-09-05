import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

export type AccountType = 'personal' | 'restaurant';

type Props = {
  value: AccountType;
  onChange: (value: AccountType) => void;
  fontsLoaded: boolean;
};

const options = [
  { value: 'personal', label: 'Diner' },
  { value: 'restaurant', label: 'Restaurant owner' },
] as const;

export function AccountTypeSelector({ value, onChange, fontsLoaded }: Props) {
  return (
    <View style={styles.group}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          accessibilityRole="radio"
          accessibilityLabel={option.label}
          accessibilityState={{ checked: value === option.value }}
          onPress={() => onChange(option.value)}
          style={styles.option}
        >
          <Text style={[styles.label, !fontsLoaded && styles.fontFallback]}>
            {option.label}{value === option.value ? ' · Selected' : ''}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: '100%',
    gap: spacing.textGap,
    marginTop: spacing.screenPadding,
  },
  option: {
    minHeight: 48,
    padding: spacing.textGap,
    borderWidth: 1,
    borderColor: colors.textMuted,
    borderRadius: 16,
  },
  label: {
    ...typography.body,
    color: colors.text,
  },
  fontFallback: {
    fontFamily: undefined,
  },
});
