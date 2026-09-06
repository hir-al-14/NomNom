import { Send } from 'lucide-react-native';
import { useEffect,useRef,useState } from 'react';
import { Image,KeyboardAvoidingView,Platform,Pressable,ScrollView,Text,TextInput,View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Primitives';
import { Body, Screen } from '../components/ui';
import { restaurantImages } from '../demo/images';
import { restaurants } from '../demo/menu';
import { useApp } from '../state/AppContext';
import { localId } from '../state/types';
import { colors } from '../theme';

import { styles,time } from './ActivityShared';

export function Chat() {
  const { data, update, restaurantId, navigate } = useApp();
  const restaurant = restaurants.find((item) => item.id === restaurantId);
  const [draft, setDraft] = useState('');
  const scroll = useRef<ScrollView>(null);
  const messages = data.messages.filter((message) => message.restaurantId === restaurant?.id);
  useEffect(() => { setDraft(''); }, [restaurantId]);
  useEffect(() => { scroll.current?.scrollToEnd({ animated: true }); }, [messages.length]);
  function send() {
    if (!draft.trim() || !restaurant) return;
    const message = { id: localId(), restaurantId: restaurant.id, body: draft.trim(), createdAt: new Date().toISOString() };
    update((current) => ({ ...current, messages: [...current.messages, message] }));
    setDraft('');
  }
  if (!restaurant) return <Screen>
    <Header title="Messages" onBack={() => navigate('home')} />
    <Body>Choose a restaurant to start a conversation.</Body>
    {restaurants.map((item) => <Pressable key={item.id} accessibilityRole="button"
      accessibilityLabel={`Chat with ${item.name}`} onPress={() => navigate('chat', item.id)} style={styles.thread}>
      <Image source={restaurantImages[item.id]} style={styles.restaurantImage} />
      <Text style={styles.noticeTitle}>{item.name}</Text>
    </Pressable>)}
  </Screen>;
  return <SafeAreaView edges={['top', 'left', 'right']} style={styles.chatPage}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.chatHeader}><Header title={restaurant.name} onBack={() => navigate('chat')} /></View>
      <ScrollView ref={scroll} contentContainerStyle={styles.conversation}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
        <Text style={styles.demo}>Demo conversation · Messages are saved on this device, not delivered to a restaurant.</Text>
        {!messages.length && <Body>Ask about ingredients or how a dish is prepared.</Body>}
        {messages.map((message) => <View key={message.id} style={styles.messageWrap}>
          <View style={styles.bubble}><Text style={styles.message}>{message.body}</Text></View>
          <Text style={styles.timestamp}>{time(message.createdAt)}</Text>
        </View>)}
      </ScrollView>
      <View style={styles.composer}>
        <TextInput accessibilityLabel="Message" value={draft} onChangeText={setDraft}
          placeholder="Send a message..." placeholderTextColor={colors.border}
          multiline maxLength={2000} style={styles.messageInput} />
        <Pressable accessibilityRole="button" accessibilityLabel="Save demo message" disabled={!draft.trim()} onPress={send} style={styles.send}>
          <Send size={24} color={draft.trim() ? colors.border : colors.mutedIcon} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
