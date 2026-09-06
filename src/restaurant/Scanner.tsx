import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { AppState, Linking, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Card, Header, Pill } from '../components/Primitives';
import { Action, Body, Screen } from '../components/ui';
import { parseFoodNote, restrictionLabel } from '../domain';
import { matchDish } from '../matching';
import { useOwner } from './context';
import { ownerStyles as s } from './styles';

export function Scanner() {
  const { navigate, store } = useOwner();
  const [permission, requestPermission] = useCameraPermissions();
  const [note, setNote] = useState<ReturnType<typeof parseFoodNote> | null>(null);
  const [error, setError] = useState('');
  const [active, setActive] = useState(AppState.currentState === 'active');
  const locked = useRef(false);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => setActive(state === 'active'));
    return () => subscription.remove();
  }, []);
  function scan(raw: string) {
    if (locked.current) return;
    locked.current = true;
    try { setNote(parseFoodNote(raw)); setError(''); }
    catch { setError('This is not a valid NomNom Food-note. Try another QR code.'); }
  }
  function reset() { setNote(null); setError(''); locked.current = false; }
  if (!permission?.granted) return <Screen>
    <Header title="Scan Food-note" onBack={() => navigate('profile')} />
    <Body>Use your camera to read a guest’s Food-note QR code.</Body>
    {!!error && <Body>{error}</Body>}
    <Action label={permission?.canAskAgain === false ? 'Open camera settings' : 'Allow camera'} onPress={() => {
      (permission?.canAskAgain === false ? Linking.openSettings() : requestPermission())
        .catch(() => setError('Could not open camera permissions. Please try again.'));
    }} />
  </Screen>;
  if (note) return <Screen>
    <Header title="Customer Food-note" onBack={reset} />
    <Card><Text style={s.small}>Customer name</Text><Text style={s.title}>{note.name || 'Name not provided'}</Text></Card>
    <Text style={s.title}>Dietary restrictions</Text>
    {!note.restrictions.length && <Body>No dietary restrictions selected.</Body>}
    {note.restrictions.map(({ tag, severity }, index) => <Pill key={`${tag}-${index}`} tone={severity}>{restrictionLabel(tag)} · {severity}</Pill>)}
    <Text style={s.title}>Your menu</Text>
    {store.data.dishes.map((dish) => <Pressable key={dish.id} onPress={() => navigate('dish', dish.id)} accessibilityRole="button" style={s.menuRow}>
      <View style={{ flex: 1 }}><Text style={s.menuName}>{dish.name}</Text><Body>{matchDish(dish, note.restrictions).label}</Body></View>
    </Pressable>)}
    <Body>Confirm ingredients and preparation with the guest. This scan is not saved.</Body>
    <Action label="Scan another Food-note" onPress={reset} />
  </Screen>;
  return <View style={s.page}>
    <StatusBar style="light" />
    {active && <CameraView style={{ flex: 1 }} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      onBarcodeScanned={({ data }) => scan(data)} onMountError={() => setError('Camera could not start. Check permissions and reopen the scanner.')} />}
    <SafeAreaView pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
      <Text style={[s.heroTitle, { textAlign: 'center', padding: 20, backgroundColor: '#00000044' }]}>Scan Food-note</Text>
      {!!error && <View style={s.content}><Text style={{ color: 'white' }}>{error}</Text><Action label="Try again" onPress={reset} /></View>}
    </SafeAreaView>
  </View>;
}
