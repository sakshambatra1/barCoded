import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
      <View style={styles.logoutButton}>
        <Button title="Logout" onPress={logout} color="#d9534f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 20,
  },
});
