// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { logout } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Home Screen</Text>

      <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
      <Button title="Workout Input" onPress={() => navigation.navigate('WorkoutInput')} />
      <Button title="Difficulty Scale" onPress={() => navigation.navigate('DifficultyScale')} />
      <Button title="Metrics Dashboard" onPress={() => navigation.navigate('MetricsDashboard')} />

      <View style={styles.logoutButton}>
        <Button title="Logout" onPress={logout} color="#d9534f" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 20,
  },
});
