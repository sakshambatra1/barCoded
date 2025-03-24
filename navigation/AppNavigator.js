import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from '../screens/AuthScreen';
import VerificationScreen from '../screens/VerificationScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileInfoScreen from '../screens/ProfileInfoScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { refreshToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {refreshToken == null ? (
        <>
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Verification" component={VerificationScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileInfoScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}
