import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { AccountTypeSelector, type AccountType } from './src/components/AccountTypeSelector';
import { colors, spacing, typography } from './src/theme';
import { Workspace } from './src/Workspace';
import { LoginHeader } from './src/components/LoginHeader';
import { AuthForm } from './src/components/AuthForm';
import { useSession } from './src/hooks/useSession';
import { supabase } from './src/lib/supabase';

function AppContent() {
  const [fontsLoaded, fontError] = useFonts({ Manrope_400Regular, Manrope_700Bold });
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [inDemo, setInDemo] = useState(false);
  const { session, loading, error } = useSession();

  if (session || inDemo) {
    const onExit = async () => {
      if (session && supabase) {
        try {
          const result = await supabase.auth.signOut({ scope: 'local' });
          if (result.error) throw result.error;
        } catch {
          Alert.alert('Unable to sign out', 'Please try again.');
          return;
        }
      }
      setInDemo(false);
    };
    return <Workspace key={session?.user.id ?? 'guest'} userId={session?.user.id} mode={accountType}
      onSwitch={() => setAccountType(accountType === 'restaurant' ? 'personal' : 'restaurant')} onExit={onExit} />;
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
