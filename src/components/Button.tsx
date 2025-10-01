import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import theme from '../styles/theme';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, disabled, style, ...props }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        disabled && styles.disabled,
        style
      ]} 
      disabled={disabled}
      {...props}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: theme.colors.secondary,
    opacity: 0.7,
  },
  disabledText: {
    color: theme.colors.text,
  },
});
