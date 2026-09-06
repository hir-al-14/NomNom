import { Send, UserRound } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Primitives';
import { Body, Screen } from '../components/ui';
import { styles, time } from '../screens/ActivityShared';
import { localId } from '../state/types';
import { colors } from '../theme';
import { useOwner } from './context';
import { ownerStyles as s } from './styles';

export function OwnerChat({ thread = false }: { thread?: boolean }) {
  const { user, store, navigate } = useOwner();
  const [draft, setDraft] = useState('');
  const scroll = useRef<ScrollView>(null);
  const messages = user.data.messages.filter((message) => message.restaurantId === store.data.profile.id);
  const last = messages.at(-1);
  const customer = user.data.name || 'Customer 1';
  if (!thread) return <Screen>
    <Header title="Chat" onBack={() => navigate('profile')} />
    <View style={s.divider} />
    {last ? <Pressable accessibilityRole="button" onPress={() => navigate('thread')} style={s.menuRow}>
      <View style={s.iconTile}><UserRound size={28} color={colors.border} /></View>
      <View style={{ flex: 1 }}><Text style={s.menuName}>{customer}</Text><Text numberOfLines={1} style={s.small}>{last.body}</Text></View>
      <Text style={s.small}>{time(last.createdAt)}</Text>
    </Pressable> : <Body>No customer messages yet. Switch to personal mode and message this restaurant to try the conversation.</Body>}
  </Screen>;
  return <SafeAreaView edges={['top', 'left', 'right']} style={s.page}>
    <KeyboardAvoidingView style={s.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.chatHeader}><Header title={customer} onBack={() => navigate('chat')} /></View>
      <ScrollView ref={scroll} contentContainerStyle={styles.conversation} onContentSizeChange={() => scroll.current?.scrollToEnd()}>
        {messages.map((message) => <View key={message.id} style={{ alignItems: message.sender === 'restaurant' ? 'flex-end' : 'flex-start', gap: 4 }}>
          <View style={[styles.bubble, message.sender !== 'restaurant' && { backgroundColor: 'white' }]}><Text style={styles.message}>{message.body}</Text></View>
          <Text style={styles.timestamp}>{time(message.createdAt)}</Text>
        </View>)}
      </ScrollView>
      <View style={styles.composer}><TextInput accessibilityLabel="Reply to customer" placeholder="Send a message..."
        value={draft} onChangeText={setDraft} multiline maxLength={2000} style={styles.messageInput} />
        <Pressable accessibilityRole="button" accessibilityLabel="Send demo reply" disabled={!draft.trim()} style={styles.send} onPress={() => {
          if (!draft.trim()) return;
          user.update((current) => ({ ...current, messages: [...current.messages, { id: localId(), restaurantId: store.data.profile.id,
            body: draft.trim(), createdAt: new Date().toISOString(), sender: 'restaurant' }] }));
          setDraft('');
        }}><Send size={24} color={colors.border} /></Pressable>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
