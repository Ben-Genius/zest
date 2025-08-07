import React from "react";
import { View, StyleSheet } from "react-native";

export const ProgressBar = ({
  progress,
  color,
}: {
  progress: number;
  color: string;
}) => (
  <View style={styles.track}>
    <View
      style={[styles.fill, { width: `${progress}%`, backgroundColor: color }]}
    />
  </View>
);

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
});
