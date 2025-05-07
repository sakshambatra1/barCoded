// src/screens/WorkoutInputScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const WorkoutInputScreen = () => {
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const handleStartWorkout = () => {
    // Add logic to process and validate input
    console.log({ exercise, weight, sets, reps });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>BarCoded</Text>

      <Text style={styles.label}>Exercise</Text>
      <TextInput
        placeholder="Enter exercise"
        style={styles.input}
        value={exercise}
        onChangeText={setExercise}
      />
      <Text style={styles.hint}>Choose from dropdown</Text>

      <Text style={styles.label}>Weight</Text>
      <TextInput
        placeholder="Enter weight lifted"
        style={styles.input}
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <Text style={styles.hint}>Numbers only</Text>

      <Text style={styles.label}>Select Workout Duration</Text>

      <TextInput
        placeholder="Enter No. Sets"
        style={styles.input}
        keyboardType="numeric"
        value={sets}
        onChangeText={setSets}
      />
      <TextInput
        placeholder="Enter No. Reps"
        style={styles.input}
        keyboardType="numeric"
        value={reps}
        onChangeText={setReps}
      />
      <Text style={styles.hint}>Numbers only</Text>

      <TouchableOpacity style={styles.button} onPress={handleStartWorkout}>
        <Text style={styles.buttonText}>Start Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 5 },
  hint: { color: '#888', fontSize: 12, marginBottom: 10 },
  button: { backgroundColor: '#000', padding: 15, alignItems: 'center', borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default WorkoutInputScreen;