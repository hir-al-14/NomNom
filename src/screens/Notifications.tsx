import { Check,ShoppingCart } from 'lucide-react-native';
import { Alert,Pressable,Text,View } from 'react-native';
import { Card,Header,Section } from '../components/Primitives';
import { Body,Screen } from '../components/ui';
import { money } from '../domain';
import { useApp } from '../state/AppContext';
import { colors } from '../theme';

import { styles,time } from './ActivityShared';

export function Notifications() {
  const { data, update, navigate } = useApp();
  return <Screen>
    <Header title="Notifications" onBack={() => navigate('home')} />
    {!data.notifications.length && <Body>You’re all caught up. Your activity will appear here.</Body>}
    {data.notifications.map((notice) => <Pressable key={notice.id} accessibilityRole="button"
      accessibilityLabel={`${notice.read ? '' : 'Unread. '}${notice.title}`} onPress={() => {
        update((current) => ({ ...current, notifications: current.notifications.map((item) => item.id === notice.id ? { ...item, read: true } : item) }));
        Alert.alert(notice.title, notice.body);
      }}><Card><View style={styles.notice}>
        <View style={styles.noticeIcon}>{notice.read ? <Check size={30} color={colors.teal} /> : <ShoppingCart size={30} color={colors.teal} />}</View>
        <View style={{ flex: 1 }}><Text style={styles.noticeTitle}>{notice.title}</Text>
          <Text style={styles.small}>{notice.body}</Text><Text style={styles.timestamp}>{time(notice.createdAt)}</Text>
        </View>
      </View></Card></Pressable>)}
    {!!data.orders.length && <Section>Recent demo orders</Section>}
    {data.orders.map((order) => <Card key={order.id}>
      <Text style={styles.noticeTitle}>{money(order.totalCents)} · {new Date(order.placedAt).toLocaleDateString()}</Text>
      {order.items.map((item, index) => <Body key={`${order.id}-${index}`}>{item.quantity} × {item.name}</Body>)}
    </Card>)}
  </Screen>;
}

