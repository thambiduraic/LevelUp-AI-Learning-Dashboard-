const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getHeaders(): Promise<HeadersInit> {
  // Import dynamically to avoid server/client issues
  const { createClient } = await import('./supabase/client');
  const supabase = createClient();
  
  // getSession() returns the current session, but doesn't guarantee it's not expired.
  // getUser() is more reliable as it triggers a refresh if needed.
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting Supabase session:', error);
  }

  return {
    'Content-Type': 'application/json',
    ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
  };
}



export const api = {
  async get<T>(path: string): Promise<T> {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}${path}`, { headers });
    
    if (res.status === 401) {
      console.warn('Unauthorized request. Redirecting to login...');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (res.status === 401) {
      console.warn('Unauthorized request. Redirecting to login...');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (res.status === 401) {
      console.warn('Unauthorized request. Redirecting to login...');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

