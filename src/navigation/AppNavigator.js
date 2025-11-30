import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/colors';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import PermissionsScreen from '../screens/auth/PermissionsScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import SelfSafetyScreen from '../screens/main/SelfSafetyScreen';
import GuardianModeScreen from '../screens/main/GuardianModeScreen';
import PoliceModeScreen from '../screens/main/PoliceModeScreen';
import GuardianAlertScreen from '../screens/main/GuardianAlertScreen';

// Menu Screens
import ProfileScreen from '../screens/menu/ProfileScreen';
import NetworkScreen from '../screens/menu/NetworkScreen';
import HowItWorksScreen from '../screens/menu/HowItWorksScreen';

const Stack = createStackNavigator();

// Screen options for consistent styling
const screenOptions = {
  headerStyle: {
    backgroundColor: colors.background,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: -0.3,
  },
  headerBackTitleVisible: false,
  cardStyle: {
    backgroundColor: colors.background,
  },
};

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ ...screenOptions, headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

// Main Stack
const MainStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="SelfSafety" 
      component={SelfSafetyScreen}
      options={{ 
        title: 'Self Safety Mode',
        headerStyle: {
          ...screenOptions.headerStyle,
          backgroundColor: colors.background,
        },
      }}
    />
    <Stack.Screen 
      name="GuardianMode" 
      component={GuardianModeScreen}
      options={{ 
        title: 'Guardian Mode',
        headerStyle: {
          ...screenOptions.headerStyle,
          backgroundColor: colors.background,
        },
      }}
    />
    <Stack.Screen 
      name="PoliceMode" 
      component={PoliceModeScreen}
      options={{ 
        title: 'Emergency',
        headerStyle: {
          ...screenOptions.headerStyle,
          backgroundColor: colors.background,
        },
      }}
    />
    <Stack.Screen 
      name="GuardianAlert" 
      component={GuardianAlertScreen}
      options={{ 
        title: 'Someone Needs Help',
        headerStyle: {
          ...screenOptions.headerStyle,
          backgroundColor: colors.background,
        },
      }}
    />
    <Stack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Profile Settings' }}
    />
    <Stack.Screen 
      name="Network" 
      component={NetworkScreen}
      options={{ title: 'Your Network' }}
    />
    <Stack.Screen 
      name="HowItWorks" 
      component={HowItWorksScreen}
      options={{ title: 'How SafeCircle Works' }}
    />
    <Stack.Screen 
      name="Permissions" 
      component={PermissionsScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  return <MainStack />;
}
