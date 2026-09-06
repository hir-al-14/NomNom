import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState, type SetStateAction } from 'react';
import { isRestrictionTag, type Restriction, type CartItem, type Dish } from '../domain';
import { supabase } from '../lib/supabase';
import { emptyUserData, type UserData } from './types';
import { useActivity } from './useActivity';
import { sendCustomerMessage } from '../lib/activity';
import { preferences, applyPreferences } from '../lib/preferences';

export function useUserData(userId?: string) {
  const [data, setData] = useState<UserData>(emptyUserData);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [canPersist, setCanPersist] = useState(false);
  const pending = useRef(Promise.resolve());
  const key = `nomnom:user:v1:${userId ?? 'guest'}`;
  const activity = useActivity(!!userId, userId);
  const [cloudReady, setCloudReady] = useState(false);
  const lastPreferences = useRef('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(key);
        let saved = emptyUserData();
        if (raw) {
          const parsed = JSON.parse(raw);
          if (!parsed || !Array.isArray(parsed.cart) || !Array.isArray(parsed.restrictions)) {
            throw new Error('Invalid saved data');
          }
          saved = { ...saved, ...parsed };
          saved.restrictions = saved.restrictions.filter((item) =>
            item && isRestrictionTag(item.tag) &&
            ['low', 'medium', 'high'].includes(item.severity));
        }
        if (!active) return;
        setData(saved);
        setCanPersist(true);
        if (userId && supabase) {
          const [profile, restrictions, prefs] = await Promise.all([
            supabase.from('profiles').select('name').eq('id', userId).maybeSingle(),
            supabase.from('restrictions').select('tag,severity').eq('user_id', userId),
            supabase.from('user_preferences').select('*').eq('user_id', userId).maybeSingle(),
          ]);
          if (!active) return;
          if (profile.error || restrictions.error || prefs.error) {
            setError('Profile sync is unavailable. Your saved device data is still available.');
          } else {
            setData((current) => ({ ...current, ...applyPreferences(prefs.data), name: profile.data?.name ?? current.name,
              restrictions: (restrictions.data ?? []) as Restriction[], orders: [], messages: [] }));
            setCloudReady(true);
          }
        }
      } catch {
        if (active) setError('Could not load saved data. Existing storage has not been replaced.');
      } finally {
        if (active) setReady(true);
      }
    }
    load();
    return () => { active = false; };
  }, [key, userId]);

  useEffect(() => {
    if (!ready || !canPersist) return;
    pending.current = pending.current
      .then(() => AsyncStorage.setItem(key, JSON.stringify(data)))
      .catch(() => setError('Changes could not be saved on this device. Please try again.'));
  }, [data, ready, canPersist, key]);

  useEffect(() => {
    if (!userId || !supabase || !ready || !cloudReady) return;
    const snapshot = preferences(data); const serialized = JSON.stringify(snapshot);
    if (serialized === lastPreferences.current) return;
    lastPreferences.current = serialized;
    pending.current = pending.current.then(async () => {
      const result = await supabase!.from('user_preferences').upsert({ user_id: userId, ...snapshot });
      if (result.error) { lastPreferences.current = ''; setError('Preferences could not sync. Your device copy is saved.'); }
    }).catch(() => { lastPreferences.current = ''; setError('Preferences could not sync.'); });
  }, [data, ready, cloudReady, userId]);

  useEffect(() => {
    if (!userId || !ready) return;
    setData((current) => ({ ...current, orders: activity.orders, messages: activity.messages,
      notifications: activity.orders.map((order) => {
        const id = `${order.id}:${order.readyRestaurantIds?.length ? 'ready' : 'new'}`;
        return { id, title: order.readyRestaurantIds?.length ? 'Order ready' : 'Order placed',
          body: order.items.map((item) => `${item.quantity} × ${item.name}`).join(', '), createdAt: order.placedAt,
          read: current.notifications.some((notice) => notice.id === id && notice.read) };
      }) }));
  }, [activity.orders, activity.messages, userId, ready]);

  function update(change: SetStateAction<UserData>) {
    setCanPersist(true);
    setData(change);
  }

  async function saveProfile(name: string, restrictions: Restriction[]) {
    if (userId && supabase) {
      const profile = await supabase.from('profiles').upsert({ id: userId, name: name.trim() });
      if (profile.error) throw new Error('Could not save your profile. Check the database setup and try again.');
      const result = await supabase.rpc('save_restrictions', { items: restrictions });
      if (result.error) throw new Error('Could not save restrictions. Your edits are still here.');
    }
    const next = { ...data, name: name.trim(), restrictions };
    await AsyncStorage.setItem(key, JSON.stringify(next));
    update(next);
    setError('');
  }
  async function sendMessage(restaurantId: string, body: string) {
    if (!userId) throw new Error('Sign in to send a message.');
    await sendCustomerMessage(userId, restaurantId, data.name, body); activity.refresh();
  }
  async function placeOrder(items: CartItem[], dishes: Dish[], requestKey: string) {
    if (!userId || !supabase) throw new Error('Sign in to place an order.');
    const result = await supabase.rpc('place_orders', { request_key: requestKey,
      items: items.map((item) => ({ ...item, priceCents: dishes.find((dish) => dish.id === item.dishId)?.priceCents })) });
    if (result.error) throw new Error(result.error.message);
    update((current) => ({ ...current, cart: current.cart.filter((item) => !items.some((ordered) => ordered.dishId === item.dishId)) }));
    activity.refresh();
  }
  return { data, update, ready, error: error || activity.error, saveProfile, userId, sendMessage, placeOrder };
}
