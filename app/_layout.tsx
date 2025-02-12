import { Stack, Redirect } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/supabase';
import { View, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem('user-session');
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession);
          if (parsedSession.expires_at && new Date(parsedSession.expires_at) > new Date()) {
            setSession(parsedSession);
            setIsLoading(false);
            return;
          }
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session) {
          await AsyncStorage.setItem('user-session', JSON.stringify(session));
          setSession(session);
        } else {
          await AsyncStorage.removeItem('user-session');
          setSession(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        await AsyncStorage.removeItem('user-session');
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (session) {
        await AsyncStorage.setItem('user-session', JSON.stringify(session));
      } else {
        await AsyncStorage.removeItem('user-session');
      }
      setSession(session);
      setIsLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { access_token, refresh_token } = session;
          await AsyncStorage.setItem('supabase-auth-token', JSON.stringify({
            access_token,
            refresh_token
          }));
        }
      });
    }
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen 
          name="home"
          options={{ 
            headerShown: false,
            gestureEnabled: false 
          }}
        />
        {/* <Stack.Screen name="homee" options={{ headerShown: false }} /> */}
      </Stack>
      {session ? <Redirect href="/home" /> : <Redirect href="/login" />}
    </QueryClientProvider>
  );
}