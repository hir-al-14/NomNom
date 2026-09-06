import { useState } from 'react';
import { Pressable,Text,TextInput,View } from 'react-native';
import { Card,Header,Pill,Section } from '../components/Primitives';
import { Action,Body,Screen } from '../components/ui';
import { customRestrictionTag, restrictionLabel, restrictionOptions,type Severity } from '../domain';
import { useApp } from '../state/AppContext';

import { styles } from './ProfileShared';

export function EditProfile() {
  const { data, saveProfile, navigate } = useApp();
  const [name, setName] = useState(data.name);
  const [restrictions, setRestrictions] = useState(data.restrictions);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [custom, setCustom] = useState('');
  const options = [...restrictionOptions, ...restrictions
    .filter(({ tag }) => tag.startsWith('custom:'))
    .map(({ tag }) => ({ tag, label: restrictionLabel(tag) }))];
  function addCustom() {
    const tag = customRestrictionTag(custom);
    if (!tag) { setError('Enter a restriction of 1–80 characters.'); return; }
    if (restrictions.some((item) => item.tag === tag)) {
      setError('That restriction is already selected.'); return;
    }
    setRestrictions([...restrictions, { tag, severity: 'high' }]);
    setCustom(''); setError('');
  }
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
    {options.map(({ tag, label }) => {
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
    <Section>Custom restriction</Section>
    <TextInput accessibilityLabel="Custom dietary restriction" placeholder="e.g. sesame-free"
      value={custom} onChangeText={setCustom} maxLength={80} style={styles.input}
      editable={!busy} returnKeyType="done" onSubmitEditing={addCustom} />
    <Action label="Add restriction" disabled={busy || !custom.trim()} onPress={addCustom} />
    <Body>Custom restrictions appear in your profile and Food-note. Confirm them with the restaurant; menu matching cannot verify them yet.</Body>
    {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    <Action label={busy ? 'Saving…' : 'Save changes'} disabled={busy} onPress={save} />
  </Screen>;
}
