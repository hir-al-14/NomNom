import { UserRound } from 'lucide-react-native';
import { StyleSheet,Text,View } from 'react-native';
import { useApp } from '../state/AppContext';
import { colors,typography } from '../theme';

export function Avatar() {
  const { data } = useApp();
  return <View style={styles.identity}>
    <View style={styles.avatar}><UserRound size={52} strokeWidth={1.3} color={colors.border} /></View>
    <Text style={styles.name}>{data.name || 'Your name'}</Text>
    <Text style={styles.caption}>Personal profile</Text>
  </View>;
}

export const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: -10 },
  title: { ...typography.title, fontSize: 24, color: colors.text },
  identity: { alignItems: 'center', gap: 4 },
  avatar: { height: 96, width: 96, borderRadius: 48, borderColor: colors.teal, borderWidth: 1, backgroundColor: colors.selected, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  name: { ...typography.body, fontFamily: typography.title.fontFamily, color: colors.text },
  caption: { ...typography.body, fontSize: 12, color: colors.textMuted },
  divider: { width: 244, height: 2, backgroundColor: '#BCE4E7', alignSelf: 'center' },
  buddyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  smallAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.selected, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  input: { ...typography.body, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 10, minHeight: 48, padding: 12 },
  select: { minHeight: 44, justifyContent: 'center' },
  level: { minHeight: 44, justifyContent: 'center', padding: 4, borderRadius: 12, borderWidth: 2, borderColor: 'transparent' },
  levelSelected: { borderColor: colors.text },
  error: { ...typography.body, color: '#A3343B', fontSize: 13 },
  qr: { alignItems: 'center', paddingVertical: 16 },
  setting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, minHeight: 44 },
  settingText: { ...typography.body, fontSize: 18, color: colors.text, flex: 1 },
  logout: { marginTop: 40, borderRadius: 40, borderWidth: 1, borderColor: '#FF6876', minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  logoutText: { ...typography.body, fontFamily: typography.title.fontFamily, color: '#D44050' },
});
