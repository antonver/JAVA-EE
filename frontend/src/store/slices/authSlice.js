import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../../services/api';
import { getUserFromToken, isTokenExpired } from '../../utils/jwtUtils';

// Async thunks для авторизации
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiLogin(credentials);
      const token = response.token;
      
      // Сохраняем токен
      localStorage.setItem('token', token);
      
      // Декодируем токен и получаем информацию о пользователе
      const userInfo = getUserFromToken(token);
      
      return { token, user: userInfo };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка входа'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiRegister(userData);
      const token = response.token;
      
      // Сохраняем токен
      localStorage.setItem('token', token);
      
      // Декодируем токен и получаем информацию о пользователе
      const userInfo = getUserFromToken(token);
      
      return { token, user: userInfo };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Ошибка регистрации'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiLogout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка выхода');
    }
  }
);

// Проверяем наличие токена при инициализации
const token = localStorage.getItem('token');
let initialUser = null;

if (token && !isTokenExpired(token)) {
  initialUser = getUserFromToken(token);
} else if (token) {
  // Токен истек, удаляем его
  localStorage.removeItem('token');
}

const initialState = {
  user: initialUser,
  token: token && !isTokenExpired(token) ? token : null,
  isLoading: false,
  error: null,
  isAuthenticated: !!initialUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    // Action для обновления токена и пользователя (например, после обновления профиля)
    login: (state, action) => {
      const token = action.payload.token;
      localStorage.setItem('token', token);
      
      const userInfo = getUserFromToken(token);
      state.token = token;
      state.user = userInfo;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { clearError, logout, login } = authSlice.actions;
export default authSlice.reducer;

