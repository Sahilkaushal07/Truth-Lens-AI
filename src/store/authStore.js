import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  initialize: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const { data } = await axios.get('/api/auth/me');
      set({ isAuthenticated: true, user: data.user, isLoading: false });
    } catch {
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('auth_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    set({ isAuthenticated: true, user: data.user });
    return data.user;
  },

  signup: async (username, email, password) => {
    const { data } = await axios.post('/api/auth/signup', { username, email, password });
    localStorage.setItem('auth_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    set({ isAuthenticated: true, user: data.user });
    return data.user;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common['Authorization'];
    set({ isAuthenticated: false, user: null });
  },
}));
