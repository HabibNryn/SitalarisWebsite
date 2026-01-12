// lib/auth.ts - Simplified version (NO 2-year storage)
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('user_data');
    if (!userData) return null;
    
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('auth_token');
  if (!token) return false;
  
  // Check expiry if stored
  const expiry = localStorage.getItem('token_expiry');
  if (expiry && new Date(expiry) < new Date()) {
    clearAuthData();
    return false;
  }
  
  return true;
}

export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  
  // Clear localStorage
  const keys = [
    'auth_token',
    'refresh_token',
    'user_data',
    'token_expiry',
    'session_id',
    'user_preferences'
  ];
  
  keys.forEach(key => localStorage.removeItem(key));
  
  // Clear all auth-related localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith('auth_') || 
      key.startsWith('user_') || 
      key.includes('token')
    )) {
      localStorage.removeItem(key);
    }
  }
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear cookies
  const cookies = document.cookie.split(';');
  const expiry = new Date(0).toUTCString();
  
  cookies.forEach(cookie => {
    const name = cookie.split('=')[0].trim();
    if (name.includes('auth') || name.includes('token') || name.includes('session')) {
      document.cookie = `${name}=; expires=${expiry}; path=/`;
    }
  });
}

export async function logout(): Promise<boolean> {
  try {
    // Call logout API
    const token = localStorage.getItem('auth_token');
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    // Clear client data regardless of API response
    clearAuthData();
    
    return response.ok;
  } catch (error) {
    console.error('Logout error:', error);
    clearAuthData(); // Still clear data on error
    return false;
  }
}