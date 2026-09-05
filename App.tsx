import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { AccountTypeSelector, type AccountType } from './src/components/AccountTypeSelector';
import { colors, spacing, typography } from './src/theme';
import { Action } from './src/components/ui';
import { DemoApp } from './src/demo/DemoApp';

function AppContent() {
  const [fontsLoaded, fontError] = useFonts({ Manrope_400Regular, Manrope_700Bold });
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [inDemo, setInDemo] = useState(false);

  if (inDemo) {
    return <DemoApp previewMenu={accountType === 'restaurant'} onExit={() => setInDemo(false)} />;
  }

  const welcome = (
    <ScrollView contentContainerStyle={styles.container}>
      <Text accessibilityRole="header" style={[styles.title, !fontsLoaded && styles.fontFallback]}>
        NomNom
      </Text>
      <Text style={[styles.subtitle, !fontsLoaded && styles.fontFallback]}>
        A little care in every bite.
      </Text>
      <AccountTypeSelector
        value={accountType}
        onChange={setAccountType}
        fontsLoaded={fontsLoaded}
      />
      <View style={styles.actions}>
        <Action
          label={accountType === 'personal' ? 'Explore meals' : 'Preview sample menu'}
          disabled={!fontsLoaded && !fontError}
          onPress={() => setInDemo(true)}
        />
        <Text style={[styles.subtitle, !fontsLoaded && styles.fontFallback]}>
          Try the demo · No sign-in required
        </Text>
      </View>
      <StatusBar style="dark" />
    </ScrollView>
  );
  return <SafeAreaView style={styles.safe}>{welcome}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  actions: { width: '100%', maxWidth: 480, marginTop: spacing.screenPadding },
  fontFallback: {
    fontFamily: undefined,
  },
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screenPadding,
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
