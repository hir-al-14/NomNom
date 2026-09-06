import { Image } from 'react-native';
import { dishImages, restaurantImages } from '../demo/images';
import type { Dish } from '../domain';
import { DesignPhoto, type PhotoKey } from './DesignPhoto';

export function DishPhoto({ dish, height, width = '100%' }: {
  dish: Dish; height: number; width?: number | `${number}%`;
}) {
  const photo = (dish as Dish & { photo?: PhotoKey }).photo;
  if (photo) return <DesignPhoto photo={photo} height={height} width={width} />;
  return <Image source={dishImages[dish.id] ?? restaurantImages[dish.restaurantId]}
    style={{ width, height, borderRadius: 12 }} />;
}
