import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function VerificationScreen({ route, navigation }) {
  const { email, password } = route.params;
  const [code, setCode] = useState('');
  const { login } = useAuth();

  const handleVerify = async () => {
    try {
      const response = await fetch('http://10.0.0.132:5000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, key: code }),
      });
      const data = await response.json();
      if (response.ok && data.response === "Success") {
        await login(data.refreshToken, email);
        navigation.navigate('ProfileSetup', { fromRegister: true });
      }
       else {
        Alert.alert('Verification Failed', data.response || 'Invalid verification code.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'An error occurred during email verification.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Email Verification</Text>
      <Text>Please enter the verification code sent to your email:</Text>
      <TextInput
        placeholder="Verification Code"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Verify" onPress={handleVerify} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
});
