import type { PropsWithChildren } from 'react';
import { ArrowLeft, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cardShadow, colors, typography } from '../theme';

export function IconButton({ Icon, label, onPress, color = colors.text }:
  { Icon: LucideIcon; label: string; onPress: () => void; color?: string }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
    style={({ pressed }) => [styles.icon, pressed && { opacity: 0.5 }]}>
    <Icon size={24} color={color} strokeWidth={1.7} />
  </Pressable>;
}

export function Header({ title, onBack, right }: PropsWithChildren<{
  title: string; onBack?: () => void; right?: React.ReactNode;
}>) {
  return <View style={styles.header}>
    {onBack ? <IconButton Icon={ArrowLeft} label="Back" onPress={onBack} /> : <View style={styles.icon} />}
    <Text accessibilityRole="header" style={styles.title}>{title}</Text>
    {right ?? <View style={styles.icon} />}
  </View>;
}

export function Section({ children }: PropsWithChildren) {
  return <Text accessibilityRole="header" style={styles.section}>{children}</Text>;
}

export function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

export function Pill({ children, tone = 'low', distinct = false }: PropsWithChildren<{
  tone?: 'high' | 'medium' | 'low' | 'neutral'; distinct?: boolean;
}>) {
  const border = tone === 'neutral' ? colors.border : colors[tone];
  const backgroundColor = { high: '#F7E8E8', medium: '#F7EEE5', low: '#DFF3E8', neutral: '#E1EEF0' }[tone];
  return <View style={[styles.pill, { borderColor: border, backgroundColor }, distinct && styles.distinct]}>
    <Text style={styles.pillText}>{children}</Text>
  </View>;
}

const styles = StyleSheet.create({
  icon: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginHorizontal: -10 },
  title: { ...typography.title, fontSize: 24, textAlign: 'center', color: colors.text, flex: 1 },
  section: { ...typography.section, color: colors.text },
  card: { ...cardShadow, backgroundColor: colors.surface, borderRadius: 20, padding: 16, gap: 12 },
  pill: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 40, paddingHorizontal: 10, paddingVertical: 2 },
  pillText: { ...typography.body, fontSize: 11, lineHeight: 16, color: colors.text },
  distinct: { borderWidth: 2, borderStyle: 'dashed' },
});
