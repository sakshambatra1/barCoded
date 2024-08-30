import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CustomButton = ({ title, handlePress, containerStyle, textStyle, isLoading }) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        { backgroundColor: 'orange', borderRadius: 10, minHeight: 45, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
        containerStyle,
        isLoading && { opacity: 0.5 }
      ]}
      disabled={isLoading}
    >
      <Text style={[{ color: 'secondary', fontWeight: '500' }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;