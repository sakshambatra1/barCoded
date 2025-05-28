import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const validateEmail = (email) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return regex.test(password);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch('http://10.0.0.132:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        await login(data.refreshToken, email);
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login.');
    }
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }
    try {
      const response = await fetch('http://10.0.0.132:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.response === "Success") {
        Alert.alert('Registration Success', 'A verification email has been sent. Please verify your email.');
        navigation.navigate('Verification', { email, password });
      } else {
        Alert.alert('Registration Failed', data.response || 'Error during registration.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An error occurred during registration.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isLogin ? 'Login' : 'Register'}</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      {isLogin ? (
        <Button title="Login" onPress={handleLogin} />
      ) : (
        <Button title="Register" onPress={handleRegister} />
      )}
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
        <Text style={styles.toggleText}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
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
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  toggleButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  toggleText: {
    color: 'blue',
  },
});
