import React, { useState } from 'react';
import { 
  View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, 
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, signUpUser } from './api/Auth';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  // Automatically check session
  // useQuery({
  //   queryKey: ['session'],
  //   queryFn: checkSession,
  //   onSuccess: (session) => {
  //     if (session) router.replace('/home');
  //   },
  // });

  const loginMutation = useMutation({
    mutationFn: () => loginUser(email, password),
    onSuccess: async () => {
      await AsyncStorage.multiRemove(['supabase-auth-token', 'user-session', 'access-token']);
      Alert.alert('Success', 'Logged in successfully!');
      router.replace('/home');
    },
    onError: (error) => {
      Alert.alert('Error', error instanceof Error ? error.message : 'Something went wrong');
    },
  });

  const signupMutation = useMutation({
    mutationFn: () => signUpUser(email, password),
    onSuccess: () => {
      Alert.alert(
        'Success', 
        'Please check your email for verification!',
        [{ text: 'OK', onPress: () => setIsLogin(true) }]
      );
    },
    onError: (error) => {
      Alert.alert('Error', error instanceof Error ? error.message : 'Something went wrong');
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
            <Text style={styles.subtitle}>{isLogin ? 'Sign in to continue' : 'Sign up to get started'}</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
            
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#666"
              />
            )}

            <TouchableOpacity 
              style={styles.button}
              onPress={isLogin ? () => loginMutation.mutate() : () => signupMutation.mutate()}
              disabled={loginMutation.isPending || signupMutation.isPending}
            >
              <Text style={styles.buttonText}>
                {loginMutation.isPending || signupMutation.isPending ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => {
                setIsLogin(!isLogin);
                setPassword('');
                setConfirmPassword('');
              }}
            >
              <Text style={styles.switchButtonText}>
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  formContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  input: { height: 50, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, fontSize: 16, marginBottom: 15, color: '#333' },
  button: { backgroundColor: '#0284c7', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  switchButton: { marginTop: 10, padding: 10 },
  switchButtonText: { color: '#0284c7', textAlign: 'center', fontSize: 16 },
});
