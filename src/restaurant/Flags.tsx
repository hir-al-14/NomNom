import { Info, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Card, IconButton } from '../components/Primitives';
import { customRestrictionTag, restrictionOptions, type RestrictionTag } from '../domain';
import { ownerStyles as s } from './styles';

export const flagLabel = (tag: RestrictionTag) => ({ gluten: 'Gluten', dairy: 'Dairy', peanuts: 'Peanuts',
  'high-fiber': 'High Fibre', 'high-sodium': 'High Sodium', 'hard-texture': 'Hard Texture' }[tag as string]
  ?? tag.replace('custom:', ''));

export function Flags({ flags, notes, onChange }: {
  flags: RestrictionTag[]; notes: Record<string, string>;
  onChange: (flags: RestrictionTag[], notes: Record<string, string>) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [custom, setCustom] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  function add(tag: RestrictionTag) {
    if (!flags.includes(tag)) onChange([...flags, tag], notes);
    setAdding(false); setCustom('');
  }
  return <>
    <View style={s.row}><Text style={s.title}>Dietary Flags</Text>
      <Pressable accessibilityRole="button" onPress={() => setAdding(!adding)} style={{ paddingVertical: 10 }}><Text style={s.link}>Add Flag</Text></Pressable>
    </View>
    {adding && <Card>
      {restrictionOptions.filter(({ tag }) => !flags.includes(tag)).map(({ tag }) => <Pressable key={tag}
        accessibilityRole="button" onPress={() => add(tag)} style={{ paddingVertical: 10 }}><Text style={s.link}>{flagLabel(tag)}</Text></Pressable>)}
      <TextInput accessibilityLabel="Custom dietary flag" placeholder="Custom flag, e.g. nightshade" value={custom}
        onChangeText={setCustom} maxLength={80} style={s.input} />
      <Pressable accessibilityRole="button" disabled={!custom.trim()} onPress={() => {
        const tag = customRestrictionTag(custom); if (tag) add(tag);
      }} style={s.button}><Text style={s.buttonText}>Add flag</Text></Pressable>
    </Card>}
    {flags.map((tag) => <Card key={tag}>
      <View style={s.row}><View style={{ flex: 1 }}><Text style={s.menuName}>{flagLabel(tag)}</Text>
        <Text style={s.small}>{notes[tag] || 'Add preparation or ingredient details.'}</Text></View>
        <IconButton Icon={Info} label={`Edit details for ${flagLabel(tag)}`} onPress={() => setEditing(editing === tag ? null : tag)} />
      </View>
      {editing === tag && <>
        <TextInput accessibilityLabel={`${flagLabel(tag)} details`} value={notes[tag] ?? ''} multiline maxLength={300}
          style={s.input} onChangeText={(text) => onChange(flags, { ...notes, [tag]: text })} />
        <IconButton Icon={X} label={`Remove ${flagLabel(tag)}`} onPress={() => {
          const next = { ...notes }; delete next[tag]; onChange(flags.filter((flag) => flag !== tag), next);
        }} />
      </>}
    </Card>)}
  </>;
}
