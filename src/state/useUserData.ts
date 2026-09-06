import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState, type SetStateAction } from 'react';
import { isRestrictionTag, type Restriction } from '../domain';
import { supabase } from '../lib/supabase';
import { emptyUserData, type UserData } from './types';

export function useUserData(userId?: string) {
  const [data, setData] = useState<UserData>(emptyUserData);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [canPersist, setCanPersist] = useState(false);
  const pending = useRef(Promise.resolve());
  const key = `nomnom:user:v1:${userId ?? 'guest'}`;

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
          const [profile, restrictions] = await Promise.all([
            supabase.from('profiles').select('name').eq('id', userId).maybeSingle(),
            supabase.from('restrictions').select('tag,severity').eq('user_id', userId),
          ]);
          if (!active) return;
          if (profile.error || restrictions.error) {
            setError('Profile sync is unavailable. Your saved device data is still available.');
          } else {
            setData((current) => ({ ...current, name: profile.data?.name ?? current.name,
              restrictions: (restrictions.data ?? []) as Restriction[] }));
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
  return { data, update, ready, error, saveProfile };
}
