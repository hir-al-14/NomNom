import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from './src/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NomNom</Text>
      <Text style={styles.subtitle}>
        Find meals that fit your dietary needs.
      </Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
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
