import { supabase } from './supabase';
import type { DemoOrder } from '../domain';
import type { Message } from '../state/types';

export async function readActivity(filter: { customerId?: string; restaurantId?: string }) {
  if (!supabase) throw new Error('Supabase is not configured.');
  let threads = supabase.from('chat_threads').select('*, chat_messages(*)');
  let orders = supabase.from('orders').select('*, order_items(*)');
  if (filter.customerId) { threads = threads.eq('customer_id', filter.customerId); orders = orders.eq('customer_id', filter.customerId); }
  if (filter.restaurantId) { threads = threads.eq('restaurant_id', filter.restaurantId); orders = orders.eq('restaurant_id', filter.restaurantId); }
  const [t, o] = await Promise.all([threads, orders.order('created_at', { ascending: false })]);
  if (t.error || o.error) throw new Error('Could not sync messages and orders. Check your connection and database setup.');
  return {
    messages: t.data.flatMap((thread) => thread.chat_messages.map((message: any): Message => ({
      id: message.id, threadId: thread.id, customerName: thread.customer_name, restaurantId: thread.restaurant_id,
      body: message.body, createdAt: message.created_at, sender: message.sender_id === thread.customer_id ? 'customer' : 'restaurant',
    }))).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    orders: o.data.map((order): DemoOrder => ({ id: order.id, placedAt: order.created_at, totalCents: order.total_cents,
      customerName: order.customer_name, readyRestaurantIds: order.status === 'ready' ? [order.restaurant_id] : [],
      items: order.order_items.map((item: any) => ({ name: item.name, quantity: item.quantity, priceCents: item.price_cents, restaurantId: order.restaurant_id })),
    })),
  };
}
export async function sendCustomerMessage(userId: string, restaurantId: string, name: string, body: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  let thread = await supabase.from('chat_threads').select('id').eq('customer_id', userId).eq('restaurant_id', restaurantId).maybeSingle();
  if (thread.error) throw thread.error;
  if (!thread.data) {
    const created = await supabase.from('chat_threads').insert({ customer_id: userId, restaurant_id: restaurantId, customer_name: name || 'Customer' }).select('id').single();
    if (created.error?.code === '23505') thread = await supabase.from('chat_threads').select('id').eq('customer_id', userId).eq('restaurant_id', restaurantId).single();
    else { if (created.error) throw created.error; thread = created; }
  }
  if (!thread.data) throw new Error('Could not open conversation.');
  const renamed = await supabase.from('chat_threads').update({ customer_name: name.trim() || 'Customer' }).eq('id', thread.data.id);
  if (renamed.error) throw new Error('Could not update conversation. Check database setup.');
  return sendReply(userId, thread.data.id, body);
}
export async function sendReply(userId: string, threadId: string, body: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const result = await supabase.from('chat_messages').insert({ sender_id: userId, thread_id: threadId, body: body.trim() });
  if (result.error) throw new Error('Message was not sent. Please try again.');
}
