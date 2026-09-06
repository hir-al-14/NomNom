import { useState } from 'react';
import { Image, View, type ImageSourcePropType } from 'react-native';

export type PhotoKey = 'cafe' | 'toast' | 'cupcake' | 'latte';
// Clip the supplied reference images in layout to retain the exact food photos.
const source = require('../../assets/restaurant-profile-reference.png');
const toastSource = require('../../assets/restaurant-editor-reference.png');
const crops: Record<PhotoKey, [number, number, number, number]> = {
  cafe: [1309, 218, 434, 193], toast: [674, 245, 434, 196],
  cupcake: [1348, 644, 110, 96], latte: [1345, 779, 115, 96],
};

export function DesignPhoto({ photo, height, width = '100%', fitWidth = false }: {
  photo: PhotoKey; height: number; width?: number | `${number}%`; fitWidth?: boolean;
}) {
  const [measuredWidth, setWidth] = useState(typeof width === 'number' ? width : 375);
  const [x, y, w, h] = crops[photo];
  const displayHeight = height;
  const scale = Math.max(measuredWidth / w, displayHeight / h);
  return <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    style={{ width, height: displayHeight, overflow: 'hidden', borderRadius: 12 }}>
    <Image source={(photo === 'toast' ? toastSource : source) as ImageSourcePropType} accessibilityLabel={photo}
      style={{ position: 'absolute', width: (photo === 'toast' ? 1820 : 1794) * scale, height: (photo === 'toast' ? 1700 : 1248) * scale,
        left: -x * scale + (measuredWidth - w * scale) / 2,
        top: -y * scale + (displayHeight - h * scale) / 2 }} />
  </View>;
}
