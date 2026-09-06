import { Pressable,Switch,Text,View } from 'react-native';
import { Header } from '../components/Primitives';
import { Body,Screen } from '../components/ui';
import { useApp } from '../state/AppContext';
import { colors } from '../theme';

import { styles } from './ProfileShared';

export function Settings() {
  const { data, update, navigate, onExit, onSwitchMode, signedIn } = useApp();
  return <Screen>
    <Header title="Settings" onBack={() => navigate('profile')} />
    <View style={styles.setting}><Text style={styles.settingText}>Color-blind mode</Text>
      <Switch accessibilityLabel="Color-blind mode" value={data.colorBlind}
        onValueChange={(colorBlind) => update((current) => ({ ...current, colorBlind }))} trackColor={{ true: colors.teal }} />
    </View>
    <View style={styles.setting}><Text style={styles.settingText}>Voice-based mode</Text>
      <Switch accessibilityLabel="Read screen summaries aloud" value={data.voice}
        onValueChange={(voice) => update((current) => ({ ...current, voice }))} trackColor={{ true: colors.teal }} />
    </View>
    <Text style={styles.caption}>Voice mode reads screen summaries aloud. Restriction labels remain visible in every color mode.</Text>
    <Pressable accessibilityRole="button" onPress={() => navigate('notifications')} style={styles.select}><Body>Notifications →</Body></Pressable>
    <Pressable accessibilityRole="button" onPress={() => navigate('chat')} style={styles.select}><Body>Restaurant messages →</Body></Pressable>
    <Pressable accessibilityRole="button" onPress={onSwitchMode} style={styles.select}><Body>Switch to restaurant mode →</Body></Pressable>
    <Pressable accessibilityRole="button" onPress={onExit} style={styles.logout}>
      <Text style={styles.logoutText}>{signedIn ? 'Log out' : 'Exit demo'}</Text>
    </Pressable>
  </Screen>;
}
