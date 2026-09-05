import { ChefHat } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

export function LoginHeader({ fontsLoaded }: { fontsLoaded: boolean }) {
  return (
    <View style={styles.header}>
      <View style={styles.logo} accessible accessibilityLabel="NomNom">
        <ChefHat size={48} strokeWidth={1.5} color={colors.surface} />
      </View>
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
    width: 98,
    height: 91,
    borderRadius: 50,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { ...typography.title, fontSize: 24, lineHeight: 28, color: colors.text },
  subtitle: { ...typography.body, fontSize: 12, color: colors.textMuted },
  divider: { width: 244, height: 2, backgroundColor: colors.divider, marginTop: 10 },
  fallback: { fontFamily: undefined },
});
