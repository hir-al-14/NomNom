import type { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.column}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function Heading({ children }: PropsWithChildren) {
  return <Text accessibilityRole="header" style={styles.heading}>{children}</Text>;
}

export function Body({ children }: PropsWithChildren) {
  return <Text style={styles.body}>{children}</Text>;
}

type ActionProps = { label: string; onPress: () => void; disabled?: boolean };

export function Action({ label, onPress, disabled }: ActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, (pressed || disabled) && styles.dimmed]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, padding: spacing.screenPadding },
  column: { width: '100%', maxWidth: 480, alignSelf: 'center', gap: 20 },
  heading: { ...typography.title, color: colors.text, fontSize: 28 },
  body: { ...typography.body, color: colors.textMuted },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.body,
    fontFamily: typography.title.fontFamily,
    color: colors.surface,
  },
  dimmed: { opacity: 0.55 },
});
