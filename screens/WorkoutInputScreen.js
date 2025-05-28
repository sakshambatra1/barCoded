import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext'; 

const WorkoutInputScreen = () => {
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const { userEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartWorkout = async () => {
    if (!userEmail) {
      Alert.alert("Error", "User email not found. Please log in again.");
      return;
    }
    if (!exercise.trim() || !weight.trim() || !sets.trim() || !reps.trim()) {
      Alert.alert("Missing Information", "Please fill in all workout details.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://10.0.0.132:5000/api/workout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          workoutName: exercise,
          weight: parseFloat(weight),
          sets: parseInt(sets, 10),
          reps: parseInt(reps, 10),
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert("Success", responseData.message || "Workout added successfully!");
        setExercise('');
        setWeight('');
        setSets('');
        setReps('');
      } else {
        Alert.alert("Error", responseData.error || "Failed to add workout.");
      }
    } catch (error) {
      console.error("Error adding workout:", error);
      Alert.alert("Request Error", "An error occurred while sending workout data.");
    } finally {
      setIsLoading(false);
    }
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

      <Text style={styles.label}>Weight (kg)</Text>
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

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleStartWorkout}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? "Saving..." : "Start Workout"}</Text>
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
  disabledButton: {
    backgroundColor: '#555',
  }
});

export default WorkoutInputScreen;