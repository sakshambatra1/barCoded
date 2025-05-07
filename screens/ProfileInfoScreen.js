// src/screens/ProfileInfoScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, 
  KeyboardAvoidingView, Platform, ScrollView, SafeAreaView 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';  

export default function ProfileInfoScreen({ navigation }) {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [age, setAge] = useState(0);
  const [sport, setSport] = useState('');
  const [selectedHealthCondition, setSelectedHealthCondition] = useState(null);
  const [selectedSex, setSelectedSex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { userEmail } = useAuth();  

  const healthConditions = ['Yes', 'No'];
  const sexes = ['Male', 'Female'];

  const dateToAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    let computedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      computedAge--;
    }
    return computedAge;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      setAge(dateToAge(selectedDate));
    }
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (userEmail) {
      const fetchUserInfo = async () => {
        try {
          const response = await fetch(`http://10.0.0.132:5000/api/userInfo/getUserInfo?email=${encodeURIComponent(userEmail)}`);
          if (response.ok) {
            const data = await response.json();
            setName(data.name || '');
            setWeight(data.weight ? String(data.weight) : '');
            setSport(data.sport || '');
            setAge(data.age || 0);
            setSelectedHealthCondition(data.healthCondition ? 'Yes' : 'No');
            setSelectedSex(data.sex || '');
            if (data.dateOfBirth) {
              setDateOfBirth(new Date(data.dateOfBirth));
            }
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
      fetchUserInfo();
    }
  }, [userEmail]);

  const handleSave = async () => {
    const errors = [];

    if (!name.trim()) errors.push("Name is required.");
    if (!weight.trim()) errors.push("Weight is required.");
    if (!dateOfBirth) errors.push("Date of Birth is required.");
    if (!sport.trim()) errors.push("Sport is required.");
    if (!selectedHealthCondition) errors.push("Health condition is required.");
    if (!selectedSex) errors.push("Sex is required.");

    const numericWeight = parseFloat(weight);
    if (isNaN(numericWeight) || numericWeight <= 0) {
      errors.push("Please enter a valid weight in kilograms.");
    }

    let computedAge = 0;
    if (dateOfBirth) {
      computedAge = dateToAge(dateOfBirth);
      if (computedAge < 10 || computedAge > 100) {
        errors.push("Please enter a valid age between 10 and 100 years.");
      }
    }

    if (errors.length > 0) {
      Alert.alert("Validation Errors", errors.join("\n"));
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('http://10.0.0.132:5000/api/userInfo/addUserInfo', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail,
          username: name,
          weight: numericWeight,
          age: computedAge,
          sport: sport,
          healthCondition: selectedHealthCondition === "Yes",
          sex: selectedSex,
          dateOfBirth: dateOfBirth
        })
      });
      if (!response.ok) {
        const data = await response.json();
        Alert.alert("Error", data.error || "An error occurred while saving your profile.");
      } else {
        Alert.alert("Profile Saved", "Your profile has been successfully saved.", [
          { text: "OK", onPress: () => navigation.navigate('Home') }
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while saving your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Fitness Profile Page</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            accessibilityLabel="Name Input"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your weight in kg"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            accessibilityLabel="Weight Input"
          />

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
              accessibilityLabel="Date of Birth Input"
            >
              <Text style={dateOfBirth ? styles.dateText : styles.placeholderText}>
                {dateOfBirth ? formatDate(dateOfBirth) : 'Select your date of birth'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dateOfBirth || new Date(2000, 0, 1)}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            )}
          </View>

          <Text style={styles.label}>Sport</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the sport you play"
            value={sport}
            onChangeText={setSport}
            accessibilityLabel="Sport Input"
            autoCapitalize="words"
          />

          <Text style={styles.label}>Health Condition</Text>
          <View style={styles.selectionContainer}>
            {healthConditions.map((condition) => (
              <TouchableOpacity
                key={condition}
                style={[
                  styles.option, 
                  selectedHealthCondition === condition && styles.selectedOption
                ]}
                onPress={() => setSelectedHealthCondition(condition)}
                accessibilityLabel={`Select Health Condition ${condition}`}
              >
                <Text style={[
                  styles.optionText, 
                  selectedHealthCondition === condition && styles.selectedOptionText
                ]}>
                  {condition}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Sex</Text>
          <View style={styles.selectionContainer}>
            {sexes.map((sex) => (
              <TouchableOpacity
                key={sex}
                style={[
                  styles.option, 
                  selectedSex === sex && styles.selectedOption
                ]}
                onPress={() => setSelectedSex(sex)}
                accessibilityLabel={`Select Sex ${sex}`}
              >
                <Text style={[
                  styles.optionText, 
                  selectedSex === sex && styles.selectedOptionText
                ]}>
                  {sex}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => navigation.goBack()}
              disabled={isSaving}
              accessibilityLabel="Cancel Button"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.disabledButton]} 
              onPress={handleSave}
              disabled={isSaving}
              accessibilityLabel="Save Button"
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  keyboardAvoidingView: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, marginTop: 5 },
  fieldContainer: { marginTop: 10 },
  dateInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginTop: 5, justifyContent: 'center' },
  dateText: { fontSize: 16, color: '#000' },
  placeholderText: { fontSize: 16, color: '#888' },
  selectionContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  option: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 15, marginRight: 8, marginBottom: 8 },
  selectedOption: { backgroundColor: '#000', borderColor: '#000' },
  selectedOptionText: { color: '#fff' },
  optionText: { fontSize: 16, color: '#000' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  cancelButton: { flex: 1, borderWidth: 1, borderColor: '#000', borderRadius: 8, padding: 12, alignItems: 'center', marginRight: 10 },
  cancelButtonText: { fontSize: 16, color: '#000' },
  saveButton: { flex: 1, backgroundColor: '#000', borderRadius: 8, padding: 12, alignItems: 'center' },
  disabledButton: { backgroundColor: '#555' },
  saveButtonText: { fontSize: 16, color: '#fff' },
});
