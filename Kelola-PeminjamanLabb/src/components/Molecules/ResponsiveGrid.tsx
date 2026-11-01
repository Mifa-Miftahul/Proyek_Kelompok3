import React, { useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';

type ResponsiveGridProps = {
  children: React.ReactNode;
  // Lebar minimal satu item. Jumlah kolom dihitung dari lebar area yang tersedia.
  minItemWidth?: number;
  maxColumns?: number;
  gap?: number;
};

// Menata item dalam 1 kolom di HP, 2-3 kolom di iPad / laptop.
// Jarak antar baris diatur oleh margin bawah tiap item (kartu sudah punya).
export default function ResponsiveGrid({
  children,
  minItemWidth = 320,
  maxColumns = 3,
  gap = 14,
}: ResponsiveGridProps) {
  const [width, setWidth] = useState(0);

  const columns = width
    ? Math.max(
        1,
        Math.min(maxColumns, Math.floor((width + gap) / (minItemWidth + gap))),
      )
    : 1;

  const itemWidth =
    columns === 1 ? '100%' : (width - gap * (columns - 1)) / columns;

  const items = React.Children.toArray(children);

  return (
    <View
      onLayout={(event: LayoutChangeEvent) =>
        setWidth(event.nativeEvent.layout.width)
      }
      style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: gap }}
    >
      {items.map((child, index) => (
        <View
          key={React.isValidElement(child) && child.key != null ? child.key : index}
          style={{ width: itemWidth }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
