import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DifficultyScaleScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Difficulty Scale</Text>

      <Text style={styles.label}>Progress Tracker</Text>

      <View style={styles.option}><Text style={styles.level}>Level 1</Text><Text style={styles.subtext}>Easy</Text></View>
      <View style={styles.option}><Text style={styles.level}>Level 5</Text><Text style={styles.subtext}>Medium</Text></View>
      <View style={styles.option}><Text style={styles.level}>Level 10</Text><Text style={styles.subtext}>Hard</Text></View>

      <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Reset</Text></TouchableOpacity>
      <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.startButton]}><Text style={styles.startText}>Start</Text></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  option: { marginBottom: 15 },
  level: { fontSize: 16 },
  subtext: { fontSize: 14, color: '#666' },
  button: { borderWidth: 1, borderColor: '#000', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#000' },
  startButton: { backgroundColor: '#000' },
  startText: { color: '#fff' },
});

export default DifficultyScaleScreen;
