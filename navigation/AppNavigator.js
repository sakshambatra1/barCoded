import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileInfoScreen from '../screens/ProfileInfoScreen/ProfileInfoScreen';
import React from 'react';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Profile" component={ProfileInfoScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
