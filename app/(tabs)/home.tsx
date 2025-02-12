import { View, Text, Button, Alert, Platform } from 'react-native';
import { supabase } from '../../supabase';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        await clearSessionData();
        router.replace('/login');
      }
    };
    
    checkSession();
  }, []);

  const clearSessionData = async () => {
    try {
      await AsyncStorage.removeItem('supabase-auth-token');
      await AsyncStorage.multiRemove([
        'user-session',
        'access-token',
      ]);
    } catch (error) {
      console.warn('Error clearing session data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const session = await supabase.auth.getSession();
      const token = session?.data?.session?.access_token;

      if (!token) {
        throw new Error('No active session found');
      }

      try {
        const response = await fetch("http://localhost:3000/auth/logout", {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.error) {
          console.warn('Backend logout warning:', data.error);
        }
      } catch (error) {
        console.warn('Backend logout failed:', error);
      }

      await clearSessionData();

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.replace('/login');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to Home!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}