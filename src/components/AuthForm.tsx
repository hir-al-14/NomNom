import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { AccountType } from './AccountTypeSelector';
import { useEmailAuth } from '../hooks/useEmailAuth';
import { colors, typography } from '../theme';

export function AuthForm({ accountType }: { accountType: AccountType }) {
  const auth = useEmailAuth(accountType);
  return (
    <View style={styles.form}>
      <View style={styles.divider} />
      <TextInput
        accessibilityLabel="Email" placeholder="Email"
        value={auth.email} onChangeText={auth.setEmail}
        keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
        autoComplete="email" editable={!auth.busy}
        placeholderTextColor={colors.border} style={styles.input}
      />
      <TextInput
        accessibilityLabel="Password" placeholder="Password"
        value={auth.password} onChangeText={auth.setPassword}
        secureTextEntry autoCapitalize="none" autoCorrect={false}
        autoComplete={auth.creating ? 'new-password' : 'current-password'}
        editable={!auth.busy} returnKeyType="go" onSubmitEditing={auth.submit}
        placeholderTextColor={colors.border} style={styles.input}
      />
      {!!auth.message && <Text accessibilityRole="alert" style={styles.message}>{auth.message}</Text>}
      <Pressable
        accessibilityRole="button" disabled={auth.busy}
        accessibilityState={{ disabled: auth.busy, busy: auth.busy }}
        onPress={auth.submit}
        style={({ pressed }) => [styles.button, (pressed || auth.busy) && { opacity: 0.6 }]}
      >
        <Text style={styles.buttonText}>
          {auth.busy ? 'Please wait…' : auth.creating ? 'Create account' : 'Log in'}
        </Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={auth.toggleMode} disabled={auth.busy} style={styles.link}>
        <Text style={styles.linkText}>
          {auth.creating ? 'Already have an account? Log in' : 'Don’t have an account? Sign up'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { width: '100%', maxWidth: 360, gap: 8, marginTop: 16 },
  divider: { width: 244, height: 2, alignSelf: 'center', backgroundColor: colors.divider, marginBottom: 10 },
  input: {
    ...typography.body, color: colors.text, borderColor: colors.border,
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, minHeight: 44,
  },
  button: { minHeight: 44, width: '80%', alignSelf: 'center', backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginTop: 4 },
  buttonText: { ...typography.body, color: colors.surface },
  link: { minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  linkText: { ...typography.body, fontSize: 13, color: colors.link, textAlign: 'center' },
  message: { ...typography.body, color: colors.text, fontSize: 13 },
});
