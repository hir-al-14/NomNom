import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, Body, Heading, Screen } from '../components/ui';
import { restrictionOptions, type Restriction, type Severity } from '../domain';
import { colors, typography } from '../theme';

type Props = {
  restrictions: Restriction[];
  onChange: (value: Restriction[]) => void;
  onDone: () => void;
};
const levels: Severity[] = ['high', 'medium', 'low'];

export function ProfileScreen({ restrictions, onChange, onDone }: Props) {
  return (
    <Screen>
      <Heading>Food that fits you.</Heading>
      <Body>Choose your dietary needs. Use the guidance your care team gave you.</Body>
      {restrictionOptions.map(({ tag, label }) => {
        const selected = restrictions.find((item) => item.tag === tag);
        const toggle = () => onChange(selected
          ? restrictions.filter((item) => item.tag !== tag)
          : [...restrictions, { tag, severity: 'high' }]);
        return (
          <View key={tag} style={styles.card}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: !!selected }}
              onPress={toggle}
              style={styles.control}
            >
              <Text style={styles.label}>{selected ? '●  ' : '○  '}{label}</Text>
            </Pressable>
            {selected && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${label} priority: ${selected.severity}. Tap to change.`}
                onPress={() => onChange(restrictions.map((item) => item.tag === tag
                  ? { ...item, severity: levels[(levels.indexOf(item.severity) + 1) % levels.length] }
                  : item))}
                style={styles.control}
              >
                <Text style={styles.detail}>Priority: {selected.severity} · Change</Text>
              </Pressable>
            )}
          </View>
        );
      })}
      <Body>Priority changes emphasis. Every known conflict will still be shown.</Body>
      <Action label="Save & browse meals" onPress={onDone} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 16 },
  control: { minHeight: 48, justifyContent: 'center' },
  label: { ...typography.body, color: colors.text },
  detail: { ...typography.body, fontSize: 13, color: colors.primary },
});
