import { supabase } from '../../supabase';

export const logoutFromBackend = async () => {
  try {
    const session = await supabase.auth.getSession();
    const token = session?.data?.session?.access_token;

    if (!token) {
      throw new Error('No active session found');
    }

    const response = await fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    await supabase.auth.signOut();
  } catch (error) {
    console.warn('Logout failed:', error);
    throw error; 
  }
};

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message);

  const token = data.session?.access_token;
  if (!token) throw new Error('No access token received');

  const response = await fetch('http://localhost:3000/auth/verify', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const backendData = await response.json();

  if (backendData.error) {
    await supabase.auth.signOut(); 
    throw new Error(backendData.error);
  }

  return data;
};

export const signUpUser = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
};
