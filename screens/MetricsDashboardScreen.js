// src/screens/MetricsDashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const MetricsDashboardScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Exercise Metrics Dashboard</Text>

      <Text style={styles.label}>Select Exercise</Text>
      <View style={styles.row}>
        {['Curls', 'Deadlift', 'Incline Press', 'Bench Press'].map((item) => (
          <TouchableOpacity key={item} style={styles.chip}><Text>{item}</Text></TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Select Metric</Text>
      <View style={styles.row}>
        {['Weight', 'Shake', 'Acceleration', 'Displacement'].map((item) => (
          <TouchableOpacity key={item} style={styles.chip}><Text>{item}</Text></TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Select Timeframe</Text>
      <View style={styles.row}>
        {['Set', 'A Week', 'A Month', '6 Months'].map((item) => (
          <TouchableOpacity key={item} style={styles.timeChip}><Text>{item}</Text></TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.applyButton}><Text style={styles.buttonText}>Apply</Text></TouchableOpacity>

      <Text style={styles.label}>Current Data Metrics</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}><Text style={styles.metricTitle}>Peak</Text><Text style={styles.metricValue}>0</Text><Text style={styles.metricChange}>+0%</Text></View>
        <View style={styles.metricBox}><Text style={styles.metricTitle}>Bottom</Text><Text style={styles.metricValue}>0</Text><Text style={styles.metricChange}>+0%</Text></View>
        <View style={styles.metricBox}><Text style={styles.metricTitle}>Average</Text><Text style={styles.metricValue}>0</Text><Text style={styles.metricChange}>+0%</Text></View>
        <View style={styles.metricBox}><Text style={styles.metricTitle}>Gain/Loss</Text><Text style={styles.metricValue}>0</Text><Text style={styles.metricChange}>+0%</Text></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 15, marginBottom: 5 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: '#eee', padding: 10, borderRadius: 10, marginRight: 10, marginBottom: 10 },
  timeChip: { backgroundColor: '#ddd', padding: 10, borderRadius: 10, marginRight: 10, marginBottom: 10 },
  applyButton: { backgroundColor: '#000', padding: 15, alignItems: 'center', borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  metricBox: { width: '47%', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 10, marginBottom: 10 },
  metricTitle: { fontSize: 14, color: '#555' },
  metricValue: { fontSize: 18, fontWeight: 'bold' },
  metricChange: { fontSize: 12, color: '#999' },
});

export default MetricsDashboardScreen;