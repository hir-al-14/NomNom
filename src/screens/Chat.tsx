import { MessageCircle,Send } from 'lucide-react-native';
import { useEffect,useRef,useState } from 'react';
import { Image,KeyboardAvoidingView,Platform,Pressable,ScrollView,Text,TextInput,View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Primitives';
import { Body } from '../components/ui';
import { restaurantImages } from '../demo/images';
import { restaurants } from '../demo/menu';
import { useApp } from '../state/AppContext';
import { localId } from '../state/types';
import { colors } from '../theme';

import { styles,time } from './ActivityShared';

export function Chat() {
  const { data, update, restaurantId, navigate } = useApp();
  const restaurant = restaurants.find((item) => item.id === restaurantId) ?? restaurants[0];
  const [draft, setDraft] = useState('');
  const [chooseRestaurant, setChooseRestaurant] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const messages = data.messages.filter((message) => message.restaurantId === restaurant.id);
  useEffect(() => { scroll.current?.scrollToEnd({ animated: true }); }, [messages.length]);
  function send() {
    if (!draft.trim()) return;
    const message = { id: localId(), restaurantId: restaurant.id, body: draft.trim(), createdAt: new Date().toISOString() };
    update((current) => ({ ...current, messages: [...current.messages, message] }));
    setDraft('');
  }
  return <SafeAreaView edges={['top', 'left', 'right']} style={styles.chatPage}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.chatHeader}><Header title={chooseRestaurant ? 'Messages' : restaurant.name} onBack={() => navigate('home')} /></View>
      <Pressable accessibilityRole="button" onPress={() => setChooseRestaurant(!chooseRestaurant)} style={styles.restaurantPicker}>
        <Image source={restaurantImages[restaurant.id]} style={styles.restaurantImage} />
        <Text style={styles.small}>Choose restaurant</Text><MessageCircle size={18} color={colors.border} />
      </Pressable>
      {chooseRestaurant ? <ScrollView contentContainerStyle={styles.conversation}>
        {restaurants.map((item) => <Pressable key={item.id} accessibilityRole="button" onPress={() => {
          navigate('chat', item.id); setChooseRestaurant(false);
        }} style={styles.thread}><Image source={restaurantImages[item.id]} style={styles.restaurantImage} />
          <Text style={styles.noticeTitle}>{item.name}</Text>
        </Pressable>)}
      </ScrollView> : <ScrollView ref={scroll} contentContainerStyle={styles.conversation}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
        <Text style={styles.demo}>Demo conversation · Messages are saved on this device, not delivered to a restaurant.</Text>
        {!messages.length && <Body>Ask about ingredients or how a dish is prepared.</Body>}
        {messages.map((message) => <View key={message.id} style={styles.messageWrap}>
          <View style={styles.bubble}><Text style={styles.message}>{message.body}</Text></View>
          <Text style={styles.timestamp}>{time(message.createdAt)}</Text>
        </View>)}
      </ScrollView>}
      {!chooseRestaurant && <View style={styles.composer}>
        <TextInput accessibilityLabel="Message" value={draft} onChangeText={setDraft}
          placeholder="Send a message..." placeholderTextColor={colors.border}
          multiline maxLength={2000} style={styles.messageInput} />
        <Pressable accessibilityRole="button" accessibilityLabel="Save demo message" disabled={!draft.trim()} onPress={send} style={styles.send}>
          <Send size={24} color={draft.trim() ? colors.border : colors.mutedIcon} />
        </Pressable>
      </View>}
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

