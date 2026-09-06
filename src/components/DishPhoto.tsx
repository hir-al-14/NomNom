import { Image } from 'react-native';
import { dishImages, restaurantImages } from '../demo/images';
import type { Dish } from '../domain';
import { DesignPhoto, type PhotoKey } from './DesignPhoto';

export function DishPhoto({ dish, height, width = '100%', fitWidth = false }: {
  dish: Dish; height: number; width?: number | `${number}%`; fitWidth?: boolean;
}) {
  const photo = (dish as Dish & { photo?: PhotoKey }).photo;
  if (photo) return <DesignPhoto photo={photo} height={height} width={width} fitWidth={fitWidth} />;
  return <Image source={dishImages[dish.id] ?? restaurantImages[dish.restaurantId]}
    resizeMode={fitWidth ? 'contain' : 'cover'} style={{ width, height, borderRadius: 12 }} />;
}
