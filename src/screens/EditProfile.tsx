import { useState } from 'react';
import { Pressable,Text,TextInput,View } from 'react-native';
import { Card,Header,Pill,Section } from '../components/Primitives';
import { Action,Body,Screen } from '../components/ui';
import { restrictionOptions,type Severity } from '../domain';
import { useApp } from '../state/AppContext';

import { styles } from './ProfileShared';

export function EditProfile() {
  const { data, saveProfile, navigate } = useApp();
  const [name, setName] = useState(data.name);
  const [restrictions, setRestrictions] = useState(data.restrictions);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function save() {
    if (busy) return;
    setBusy(true); setError('');
    try {
      await saveProfile(name, restrictions);
      navigate('profile');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not save. Please try again.');
    } finally { setBusy(false); }
  }
  return <Screen>
    <Header title="Edit profile" onBack={() => { if (!busy) navigate('profile'); }} />
    <Body>Name</Body><TextInput accessibilityLabel="Your name" placeholder="Your name" value={name}
      onChangeText={setName} maxLength={80} autoComplete="name" style={styles.input} editable={!busy} />
    <Section>Dietary restrictions</Section>
    <Body>Choose the restrictions you follow. Use your care team’s dietary guidance.</Body>
    {restrictionOptions.map(({ tag, label }) => {
      const item = restrictions.find((entry) => entry.tag === tag);
      return <Card key={tag}>
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: !!item }} disabled={busy}
          onPress={() => setRestrictions(item ? restrictions.filter((entry) => entry.tag !== tag)
            : [...restrictions, { tag, severity: 'high' }])} style={styles.select}>
          <Text style={styles.name}>{item ? '●' : '○'}  {label}</Text>
        </Pressable>
        {!!item && <View style={styles.chips}>{(['high', 'medium', 'low'] as Severity[]).map((severity) => (
          <Pressable key={severity} accessibilityRole="radio" accessibilityLabel={`${label}: ${severity}`}
            accessibilityState={{ checked: item.severity === severity }} disabled={busy}
            style={[styles.level, item.severity === severity && styles.levelSelected]}
            onPress={() => setRestrictions(restrictions.map((entry) => entry.tag === tag ? { ...entry, severity } : entry))}>
            <Pill tone={severity} distinct={data.colorBlind}>{severity}</Pill>
          </Pressable>
        ))}</View>}
      </Card>;
    })}
    {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    <Action label={busy ? 'Saving…' : 'Save changes'} disabled={busy} onPress={save} />
  </Screen>;
}

