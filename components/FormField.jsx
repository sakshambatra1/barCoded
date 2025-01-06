import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { icons } from '../constants';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={styles.label}>{title}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8b"}
          onChangeText={handleChangeText}
          secureTextEntry={title === "password" && !showPassword}
          {...props}
        />

        {title === "password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image source={showPassword ? icons.eye : icons.eyehide} style={styles.icon} resizeMode='contain' />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'pmedium',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    width: '100%',
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: '#000000',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: 'white',
    fontFamily: 'psemibold',
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default FormField; 