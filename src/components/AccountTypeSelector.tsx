import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Map, UserRound } from 'lucide-react-native';
import { colors, typography } from '../theme';

export type AccountType = 'personal' | 'restaurant';

type Props = {
  value: AccountType;
  onChange: (value: AccountType) => void;
  fontsLoaded: boolean;
};

const options = [
  { value: 'personal', label: 'For myself', detail: 'Find food that fits your recovery.' },
  { value: 'restaurant', label: 'For my restaurant', detail: 'Help your guests eat with confidence.' },
] as const;

export function AccountTypeSelector({ value, onChange, fontsLoaded }: Props) {
  return (
    <View style={styles.group}>
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
          {option.value === 'personal'
            ? <UserRound size={32} color={colors.text} accessible={false} />
            : <Map size={32} color={colors.text} accessible={false} />}
          <View style={styles.optionText}>
            <Text style={[styles.label, !fontsLoaded && styles.fontFallback]}>
              {option.label}
            </Text>
            <Text style={[styles.detail, !fontsLoaded && styles.fontFallback]}>
              {option.detail}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: '100%',
    maxWidth: 360,
    gap: 6,
    marginTop: 16,
  },
  option: {
    minHeight: 60,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.selected,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 16,
  },
  label: {
    ...typography.body,
    fontFamily: typography.title.fontFamily,
    lineHeight: 20,
    color: colors.text,
  },
  selected: {
    backgroundColor: colors.selected,
    borderColor: colors.border,
  },
  detail: {
    ...typography.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
    marginTop: 2,
  },
  fontFallback: {
    fontFamily: undefined,
  },
  optionText: { flex: 1 },
});
