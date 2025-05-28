import React, { useEffect } from 'react';
import { ActivityIndicator, View, Button, StyleSheet, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';

import AuthScreen from '../screens/AuthScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ProfileInfoScreen from '../screens/ProfileInfoScreen';
import WorkoutInputScreen from '../screens/WorkoutInputScreen';
import DifficultyScaleScreen from '../screens/DifficultyScaleScreen';
import MetricsDashboardScreen from '../screens/MetricsDashboardScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { logout } = useAuth();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={styles.logoutButtonContainer}>
        <Button
          title="Logout"
          onPress={() => {
            logout();
          }}
          color="#c00"
        />
      </View>
    </DrawerContentScrollView>
  );
}

function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
         headerShown: true,
         headerTitle: '',
         headerStyle: {
           height: 100,
         }
      }}
    >
      <Drawer.Screen 
        name="WorkoutInput" 
        component={WorkoutInputScreen} 
        options={{ 
          title: 'Workout Input', 
        }} 
      />
      <Drawer.Screen 
        name="MyProfile" 
        component={ProfileInfoScreen} 
        options={{ 
          title: 'My Profile', 
        }} 
      />
      <Drawer.Screen 
        name="DifficultyScale" 
        component={DifficultyScaleScreen} 
        options={{ 
          title: 'Difficulty Scale', 
        }} 
      />
      <Drawer.Screen 
        name="MetricsDashboard" 
        component={MetricsDashboardScreen} 
        options={{ 
          title: 'Metrics Dashboard', 
        }} 
      />
    </Drawer.Navigator>
  );
}

function AuthFlowStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileInfoScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { refreshToken, isLoading, logout, userEmail } = useAuth();

  useEffect(() => {
    const validateSession = async () => {
      if (refreshToken && userEmail) {
        try {
          const response = await fetch(`http://10.0.0.132:5000/api/auth/check-session?email=${encodeURIComponent(userEmail)}`);
          if (!response.ok) {
            logout();
          }
        } catch (error) {
          logout(); 
        }
      }
    };
    validateSession();
  }, [refreshToken, userEmail, logout]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return refreshToken == null ? <AuthFlowStack /> : <AppDrawerNavigator />;
}

const styles = StyleSheet.create({
  logoutButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 10,
  },
});
