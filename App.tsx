import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { AccountTypeSelector, type AccountType } from './src/components/AccountTypeSelector';
import { colors, spacing, typography } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({ Manrope_400Regular, Manrope_700Bold });
  const [accountType, setAccountType] = useState<AccountType>('personal');

  return (
    <View style={styles.container}>
      <Text style={[styles.title, !fontsLoaded && styles.fontFallback]}>
        NomNom
      </Text>
      <Text style={[styles.subtitle, !fontsLoaded && styles.fontFallback]}>
        Find meals that fit your dietary needs.
      </Text>
      <AccountTypeSelector
        value={accountType}
        onChange={setAccountType}
        fontsLoaded={fontsLoaded}
      />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  fontFallback: {
    fontFamily: undefined,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screenPadding,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.textGap,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
