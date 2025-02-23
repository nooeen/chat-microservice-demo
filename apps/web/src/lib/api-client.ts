const API_URL = import.meta.env.VITE_API_URL;

interface LoginResponse {
  access_token: string;
  statusCode?: number;
  message?: string;
}

interface RegisterResponse {
  statusCode: number;
  message: string;
}

const hashPassword = async (password: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const apiClient = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const hashedPassword = await hashPassword(password);
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password: hashedPassword }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  },

  register: async (username: string, password: string): Promise<RegisterResponse> => {
    const hashedPassword = await hashPassword(password);

    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password: hashedPassword }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },
}; 