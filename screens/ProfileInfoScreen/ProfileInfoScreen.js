import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ProfileInfoScreen({ navigation }) {
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [selectedAgeRange, setSelectedAgeRange] = useState(null);
    const [selectedFitnessLevel, setSelectedFitnessLevel] = useState(null);
    const [selectedHealthCondition, setSelectedHealthCondition] = useState(null);
    const [selectedSex, setSelectedSex] = useState(null);

    const ageRanges = ['10-14', '15-20', '21-30', '31-40', '41-50'];
    const fitnessLevels = ['Beginner', 'Intermediate', 'Elite'];
    const healthConditions = ['Yes', 'No'];
    const sexes = ['Male', 'Female'];

    const handleSave = () => {
        if (!name || !weight || !selectedAgeRange || !selectedFitnessLevel || !selectedHealthCondition || !selectedSex) {
            Alert.alert("Missing Information", "Please fill out all fields before proceeding.");
            return;
        }

        Alert.alert("Profile Saved", "Your profile has been successfully saved.");
        navigation.navigate('Home');  
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Fitness Profile Page</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Weight</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your weight in kg"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />

            <Text style={styles.label}>Age Range</Text>
            <View style={styles.selectionContainer}>
                {ageRanges.map((range) => (
                    <TouchableOpacity
                        key={range}
                        style={[styles.option, selectedAgeRange === range && styles.selectedOption]}
                        onPress={() => setSelectedAgeRange(range)}
                    >
                        <Text style={styles.optionText}>{range}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Fitness Level</Text>
            <View style={styles.selectionContainer}>
                {fitnessLevels.map((level) => (
                    <TouchableOpacity
                        key={level}
                        style={[styles.option, selectedFitnessLevel === level && styles.selectedOption]}
                        onPress={() => setSelectedFitnessLevel(level)}
                    >
                        <Text style={styles.optionText}>{level}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Health Condition</Text>
            <View style={styles.selectionContainer}>
                {healthConditions.map((condition) => (
                    <TouchableOpacity
                        key={condition}
                        style={[styles.option, selectedHealthCondition === condition && styles.selectedOption]}
                        onPress={() => setSelectedHealthCondition(condition)}
                    >
                        <Text style={styles.optionText}>{condition}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Sex</Text>
            <View style={styles.selectionContainer}>
                {sexes.map((sex) => (
                    <TouchableOpacity
                        key={sex}
                        style={[styles.option, selectedSex === sex && styles.selectedOption]}
                        onPress={() => setSelectedSex(sex)}
                    >
                        <Text style={styles.optionText}>{sex}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginTop: 5,
    },
    selectionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    option: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedOption: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    optionText: {
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginRight: 10,
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#000',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#fff',
    },
});
