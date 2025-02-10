import { View, Text, Button, Alert } from 'react-native';
import { supabase } from '../supabase';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      }
    };
    
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      const session = await supabase.auth.getSession();
      const token = session?.data?.session?.access_token;
      
      if (!token) {
        throw new Error('No active session found');
      }
  
      // First, call backend logout
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
      // Then, sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
  
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
