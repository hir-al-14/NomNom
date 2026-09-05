import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#17251D',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#526158',
  },
});
