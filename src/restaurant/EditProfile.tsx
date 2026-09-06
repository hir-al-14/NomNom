import { RestaurantPhoto } from '../components/RestaurantPhoto';
import { cuisineOptions } from '../domain';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Header } from '../components/Primitives';
import { Body, Screen } from '../components/ui';
import { useOwner } from './context';
import { ownerStyles as s } from './styles';

export function EditRestaurantProfile() {
  const { store, navigate } = useOwner();
  const [profile, setProfile] = useState(store.data.profile);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function save() {
    if (busy) return;
    if (!profile.name.trim()) { setError('Enter your restaurant name.'); return; }
    setBusy(true);
    try {
      await store.save((current) => ({ ...current, profile: { ...profile, name: profile.name.trim() } }));
      navigate('profile');
    } catch { setError('Could not save. Please try again.'); } finally { setBusy(false); }
  }
  return <Screen>
    <Header title="Edit restaurant" onBack={() => { if (!busy) navigate('profile'); }} />
    {([{ key: 'name', label: 'Restaurant name' },
      { key: 'address', label: 'Address' }, { key: 'hours', label: 'Opening hours' }] as const).map(({ key, label }) => <TextField key={key}
        label={label} value={profile[key]} disabled={busy} onChange={(value) => setProfile({ ...profile, [key]: value })} />)}
    <Body>Cuisine</Body><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {[...new Set([...cuisineOptions, profile.cuisine].filter(Boolean))].map((cuisine) => <Pressable key={cuisine} disabled={busy}
        accessibilityRole="radio" accessibilityState={{ checked: profile.cuisine === cuisine }} onPress={() => setProfile({ ...profile, cuisine })}
        style={[s.chip, profile.cuisine === cuisine && { backgroundColor: '#BFE4E5' }]}><Text style={s.small}>{cuisine}</Text></Pressable>)}
    </View>
    <Body>Restaurant photo</Body><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {['demo-kitchen', 'luigino', 'sokyo', 'window'].map((photo) => <Pressable key={photo} disabled={busy}
        accessibilityRole="radio" accessibilityLabel={`${photo} restaurant photo`} accessibilityState={{ checked: (profile.photo || profile.id) === photo }}
        onPress={() => setProfile({ ...profile, photo })} style={{ padding: 3, borderWidth: 2, borderRadius: 14,
          borderColor: (profile.photo || profile.id) === photo ? '#6BB6BC' : 'transparent' }}>
        <RestaurantPhoto restaurant={{ ...profile, photo }} width={72} height={72} />
      </Pressable>)}
    </View>
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    <Pressable accessibilityRole="button" disabled={busy} onPress={save} style={s.button}><Text style={s.buttonText}>{busy ? 'Saving…' : 'Save changes'}</Text></Pressable>
  </Screen>;
}

export function TextField({ label, value, onChange, disabled = false }: {
  label: string; value: string; onChange: (value: string) => void; disabled?: boolean;
}) {
  return <><Body>{label}</Body><TextInput accessibilityLabel={label} value={value} onChangeText={onChange}
    editable={!disabled} maxLength={200} style={s.input} /></>;
}
