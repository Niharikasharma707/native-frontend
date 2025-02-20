// app/api/groups.ts
import { supabase } from '../../supabase';

const API_URL = 'http://localhost:3000'; // or your deployed URL

export const createGroup = async (name: string) => {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
  
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      console.log('Creating group with URL:', `${API_URL}/groups`); 
  
      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: name.trim() }) // Ensure it's properly formatted
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('Create group error:', error);
      throw error;
    }
  };
  

export const getUserGroups = async () => {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/groups`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Get groups error:', error);
    throw error;
  }
};

export const leaveGroup = async (groupId: string) => {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/groups/leave/${groupId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Leave group error:', error);
    throw error;
  }
};

export const deleteGroup = async (groupId: string) => {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Delete group error:', error);
    throw error;
  }
};