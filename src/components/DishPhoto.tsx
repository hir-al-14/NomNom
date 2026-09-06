import { Image, View } from 'react-native';
import { Utensils } from 'lucide-react-native';
import { dishImages, restaurantImages } from '../demo/images';
import type { Dish } from '../domain';
import { DesignPhoto, type PhotoKey } from './DesignPhoto';

export function DishPhoto({ dish, height, width = '100%', fitWidth = false }: {
  dish: Dish; height: number; width?: number | `${number}%`; fitWidth?: boolean;
}) {
  const photo = (dish as Dish & { photo?: string }).photo;
  if (dish.imageUrl) return <Image source={{ uri: dish.imageUrl }} resizeMode={fitWidth ? 'contain' : 'cover'} style={{ width, height, borderRadius: 12 }} />;
  if (!photo && !dishImages[dish.id] && !restaurantImages[dish.restaurantId]) return <View style={{ width, height, backgroundColor: '#E1EEF0', alignItems: 'center', justifyContent: 'center' }}><Utensils size={32} color="#4D8194" /></View>;
  if (photo && !dishImages[photo]) return <DesignPhoto photo={photo as PhotoKey} height={height} width={width} fitWidth={fitWidth} />;
  return <Image source={dishImages[photo ?? dish.id] ?? dishImages[dish.id] ?? restaurantImages[dish.restaurantId]}
    resizeMode={fitWidth ? 'contain' : 'cover'} style={{ width, height, borderRadius: 12 }} />;
}
