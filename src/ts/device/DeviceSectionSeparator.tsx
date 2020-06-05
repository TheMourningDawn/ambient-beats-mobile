import React from 'react';
import { StyleSheet, View } from 'react-native';

export function DeviceSectionSeparator() {
  const style = StyleSheet.create({});

  return (
    <View
      style={{
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 12,
        marginBottom: 12,
      }}
    />
  );
}
