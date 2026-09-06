import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

export function LoginHeader({ fontsLoaded }: { fontsLoaded: boolean }) {
  return (
    <View style={styles.header}>
      <Image source={require('../../assets/nomnom-logo.png')} style={styles.logo}
        resizeMode="contain" accessible accessibilityLabel="NomNom logo" />
      <Text accessibilityRole="header" style={[styles.title, !fontsLoaded && styles.fallback]}>
        Welcome
      </Text>
      <Text style={[styles.subtitle, !fontsLoaded && styles.fallback]}>
        Who’s using the app today?
      </Text>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', width: '100%' },
  logo: {
    width: 144,
    height: 137,
    marginBottom: 14,
  },
  title: { ...typography.title, fontSize: 24, lineHeight: 28, color: colors.text },
  subtitle: { ...typography.body, fontSize: 12, color: colors.textMuted },
  divider: { width: 244, height: 2, backgroundColor: colors.divider, marginTop: 10 },
  fallback: { fontFamily: undefined },
});
