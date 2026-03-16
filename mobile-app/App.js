import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import Dashboard from './src/screens/Dashboard';
import Rooms from './src/screens/Rooms';
import Health from './src/screens/Health';
import Settings from './src/screens/Settings';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Rooms') iconName = focused ? 'bed' : 'bed-outline';
            else if (route.name === 'Health') iconName = focused ? 'heart' : 'heart-outline';
            else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: '#1C1C1E', borderTopColor: '#2C2C2E' },
          headerStyle: { backgroundColor: '#1C1C1E' },
          headerTintColor: 'white',
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: 'Ev' }} />
        <Tab.Screen name="Rooms" component={Rooms} options={{ title: 'Odalar' }} />
        <Tab.Screen name="Health" component={Health} options={{ title: 'Sağlık' }} />
        <Tab.Screen name="Settings" component={Settings} options={{ title: 'Ayarlar' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
