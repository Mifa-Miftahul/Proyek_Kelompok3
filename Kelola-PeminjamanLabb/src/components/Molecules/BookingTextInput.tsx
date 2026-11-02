import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import FormLabel from './FormLabel';
import InputError from './InputError';

type Props = TextInputProps & {
  label: string;
  required?: boolean;
  error?: string;
};

export default function BookingTextInput({
  label,
  required = false,
  error,
  ...inputProps
}: Props) {
  return (
    <View style={styles.container}>
      <FormLabel label={label} required={required} />

      <TextInput
        {...inputProps}
        placeholderTextColor="#94A3B8"
        style={[
          styles.input,
          inputProps.multiline && styles.multiline,
          error && styles.inputError,
        ]}
      />

      <InputError message={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#1E293B',
    fontSize: 13,
    backgroundColor: '#FFFFFF',
  },
  multiline: {
    minHeight: 85,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#DC2626',
  },
});