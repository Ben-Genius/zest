import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

export const SearchBar = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (t: string) => void;
  }) => (
  
  <View style={styles.container}>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="Search students..."
      placeholderTextColor="#9CA3AF"
      style={styles.input}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
});
