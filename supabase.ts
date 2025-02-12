import "react-native-url-polyfill/auto";
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = "https://wemfhaelwunbvuibfnee.supabase.co";
const supabaseAnonKey =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlbWZoYWVsd3VuYnZ1aWJmbmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5OTkwMDgsImV4cCI6MjA1MzU3NTAwOH0.o5U_sOzlztrFan7TgYmzMcnjn1ETmhrEKJpPRhLWgRU";

const supabaseClientConfig = Platform.select({
  web: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  },
  default: {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
});

export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  supabaseClientConfig
);