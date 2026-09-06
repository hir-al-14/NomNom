import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { AccountTypeSelector, type AccountType } from './src/components/AccountTypeSelector';
import { colors, spacing, typography } from './src/theme';
import { DemoApp } from './src/demo/DemoApp';
import { LoginHeader } from './src/components/LoginHeader';
import { AuthForm } from './src/components/AuthForm';
import { AccountScreen } from './src/screens/AccountScreen';
import { useSession } from './src/hooks/useSession';

function AppContent() {
  const [fontsLoaded, fontError] = useFonts({ Manrope_400Regular, Manrope_700Bold });
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [inDemo, setInDemo] = useState(false);
  const { session, loading, error } = useSession();

  if (inDemo) {
    return <DemoApp previewMenu={accountType === 'restaurant'} onExit={() => setInDemo(false)} />;
  }
  if (session) {
    return <AccountScreen email={session.user.email ?? ''} onDemo={() => setInDemo(true)} />;
  }

  const welcome = (
    <ScrollView contentContainerStyle={styles.container}
      automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled">
      <LoginHeader fontsLoaded={fontsLoaded} />
      <AccountTypeSelector
        value={accountType}
        onChange={setAccountType}
        fontsLoaded={fontsLoaded}
      />
      {loading ? <Text style={styles.subtitle}>Restoring your session…</Text> : <AuthForm accountType={accountType} />}
      {!!error && <Text accessibilityRole="alert" style={styles.subtitle}>{error}</Text>}
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={!fontsLoaded && !fontError}
          onPress={() => setInDemo(true)}
          style={styles.demoLink}
        >
          <Text style={[styles.demoText, !fontsLoaded && styles.fontFallback]}>
            Try the demo without signing in
          </Text>
        </Pressable>
      </View>
      <StatusBar style="dark" />
    </ScrollView>
  );
  return <SafeAreaView style={styles.safe}>{welcome}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  actions: { width: '100%', maxWidth: 480, marginTop: spacing.screenPadding },
  demoLink: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  demoText: { ...typography.body, color: colors.link, fontSize: 13 },
  fontFallback: {
    fontFamily: undefined,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: spacing.screenPadding,
    paddingTop: 60,
  },
  title: {
    ...typography.title,
    color: colors.primary,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.textGap,
    textAlign: 'center',
    color: colors.textMuted,
  },
});

export default function App() {
  return <SafeAreaProvider><AppContent /></SafeAreaProvider>;
}
