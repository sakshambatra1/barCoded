import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Alert, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUser } from '../../lib/appwrite.js'; // Ensure this path is correct

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      // set it to global state 

      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            Sign Up
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={form.password}
            secureTextEntry
            onChangeText={(value) => handleChange('password', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={form.username}
            onChangeText={(value) => handleChange('username', value)}
          />
          <Button
            title={isSubmitting ? 'Submitting...' : 'Sign Up'}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#242424',
    height: '100%',
  },
  formContainer: {
    width: '100%',
    justifyContent: 'center',
    minHeight: '5%',
    paddingHorizontal: 20,
    marginVertical: 6,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: '600',
    marginTop: 10,
    fontFamily: 'psemibold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default SignUp;