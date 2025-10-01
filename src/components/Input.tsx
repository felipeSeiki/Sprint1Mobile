import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import theme from '../styles/theme';

export const Input: React.FC<TextInputProps> = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={theme.colors.text}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
});
