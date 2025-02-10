import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://wemfhaelwunbvuibfnee.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlbWZoYWVsd3VuYnZ1aWJmbmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5OTkwMDgsImV4cCI6MjA1MzU3NTAwOH0.o5U_sOzlztrFan7TgYmzMcnjn1ETmhrEKJpPRhLWgRU";

export const supabase = createClient(supabaseUrl, supabaseKey);


// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
// AppState.addEventListener('change', (state) => {
//   if (state === 'active') {
//     supabase.auth.startAutoRefresh()
//   } else {
//     supabase.auth.stopAutoRefresh()
//   }
// })