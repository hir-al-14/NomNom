import { StyleSheet } from 'react-native';
import { cardShadow,colors,typography } from '../theme';

export function time(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export const styles = StyleSheet.create({
  notice: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  noticeIcon: { borderColor: colors.teal, borderWidth: 2, borderRadius: 30, width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  noticeTitle: { ...typography.section, fontSize: 17, color: colors.text, flexShrink: 1 },
  small: { ...typography.body, color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  timestamp: { ...typography.body, color: colors.textMuted, fontSize: 10 },
  chatPage: { flex: 1, backgroundColor: colors.surface },
  chatHeader: { paddingHorizontal: 24, borderBottomWidth: 2, borderBottomColor: '#BCE4E7', paddingBottom: 8 },
  restaurantPicker: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 12 },
  restaurantImage: { width: 48, height: 48, borderRadius: 12 },
  conversation: { padding: 24, gap: 22 },
  thread: { ...cardShadow, backgroundColor: colors.surface, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  demo: { ...typography.body, fontSize: 11, color: colors.textMuted, lineHeight: 17 },
  messageWrap: { alignItems: 'flex-end', gap: 4 },
  bubble: { ...cardShadow, maxWidth: '80%', padding: 14, borderRadius: 12, backgroundColor: '#B8CED4' },
  message: { ...typography.body, fontSize: 13, color: colors.text, lineHeight: 20 },
  composer: { ...cardShadow, margin: 24, borderRadius: 12, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingLeft: 16 },
  messageInput: { ...typography.body, fontSize: 13, color: colors.text, flex: 1, minHeight: 44, maxHeight: 120, paddingVertical: 12 },
  send: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
});
