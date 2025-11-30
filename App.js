import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Fix web scrolling
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.id = 'safecircle-scroll-fix';
      style.textContent = `
        /* Ensure ScrollView components can scroll */
        div[style*="flex: 1"] {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          -webkit-overflow-scrolling: touch !important;
        }
        /* Horizontal ScrollViews */
        div[style*="flex-direction: row"][style*="flex: 1"] {
          overflow-y: hidden !important;
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }
      `;
      document.head.appendChild(style);
      return () => {
        const existing = document.getElementById('safecircle-scroll-fix');
        if (existing) existing.remove();
      };
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LocationProvider>
          <View style={styles.container}>
            <NavigationContainer>
              <AppNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
            
            {showSplash && (
              <SplashScreen onFinish={handleSplashFinish} />
            )}
          </View>
        </LocationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(Platform.OS === 'web' && { 
      height: '100vh',
      overflow: 'hidden',
    }),
  },
});
