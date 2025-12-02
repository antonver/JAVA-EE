# 💡 Примеры использования

## 1. Доступ к данным пользователя

```javascript
import { useSelector } from 'react-redux';

function UserProfile() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <div>Не авторизован</div>;
  }

  return (
    <div>
      <h1>Привет, {user.fullName}!</h1>
      <p>Email: {user.email}</p>
      <p>Роль: {user.role}</p>
    </div>
  );
}
```

## 2. Проверка роли для условного рендеринга

```javascript
import { useSelector } from 'react-redux';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h1>Панель управления</h1>
      
      {/* Показывать только администраторам */}
      {user?.role === 'ADMIN' && (
        <AdminPanel />
      )}
      
      {/* Показывать всем авторизованным */}
      <UserContent />
    </div>
  );
}
```

## 3. Защищенный компонент

```javascript
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function AdminOnly({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return children;
}

// Использование
<Route path="/admin" element={
  <AdminOnly>
    <AdminPage />
  </AdminOnly>
} />
```

## 4. Выполнение защищенных запросов

```javascript
import api from './services/api';

async function fetchUserData() {
  try {
    // Токен добавляется автоматически
    const response = await api.get('/users/profile');
    console.log(response.data);
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

async function updateProfile(data) {
  try {
    const response = await api.put('/users/profile', data);
    return response.data;
  } catch (error) {
    console.error('Ошибка обновления:', error);
  }
}
```

## 5. Обработка ошибок входа

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from './store/slices/authSlice';

function LoginForm() {
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(loginUser({
      email: 'test@example.com',
      password: 'password'
    }));

    if (loginUser.fulfilled.match(result)) {
      console.log('Успешный вход!');
    } else {
      console.log('Ошибка:', result.payload);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* ... поля формы ... */}
      <button disabled={isLoading}>
        {isLoading ? 'Загрузка...' : 'Войти'}
      </button>
    </form>
  );
}
```

## 6. Программный выход

```javascript
import { useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return <button onClick={handleLogout}>Выйти</button>;
}
```

## 7. Декодирование токена вручную

```javascript
import { getUserFromToken, getUserRole, isTokenExpired } from './utils/jwtUtils';

function checkToken() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('Токен не найден');
    return;
  }

  if (isTokenExpired(token)) {
    console.log('Токен истек');
    localStorage.removeItem('token');
    return;
  }

  const userInfo = getUserFromToken(token);
  console.log('Информация о пользователе:', userInfo);

  const role = getUserRole(token);
  console.log('Роль:', role);
}
```

## 8. Кастомный хук для проверки роли

```javascript
import { useSelector } from 'react-redux';

function useRole() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const hasRole = (role) => {
    return isAuthenticated && user?.role === role;
  };

  const isAdmin = () => hasRole('ADMIN');
  const isUser = () => hasRole('USER');

  return { hasRole, isAdmin, isUser, currentRole: user?.role };
}

// Использование
function MyComponent() {
  const { isAdmin, hasRole } = useRole();

  if (isAdmin()) {
    return <AdminPanel />;
  }

  if (hasRole('MODERATOR')) {
    return <ModeratorPanel />;
  }

  return <UserPanel />;
}
```

## 9. Автоматическое обновление данных пользователя

```javascript
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from './services/api';

function useAutoRefreshProfile() {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Обновлять профиль каждые 5 минут
    const interval = setInterval(async () => {
      try {
        const response = await api.get('/users/profile');
        // Обновить профиль в store при необходимости
        console.log('Профиль обновлен:', response.data);
      } catch (error) {
        console.error('Ошибка обновления профиля:', error);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, dispatch]);
}
```

## 10. Регистрация с дополнительной валидацией

```javascript
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from './store/slices/authSlice';

function AdvancedRegisterForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.email.includes('@')) {
      newErrors.email = 'Неверный формат email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть минимум 6 символов';
    }

    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Введите имя';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      console.log('Регистрация успешна!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Полное имя"
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
      />
      {errors.fullName && <span>{errors.fullName}</span>}

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      {errors.email && <span>{errors.email}</span>}

      <input
        type="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {errors.password && <span>{errors.password}</span>}

      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}
```

## 11. Компонент с отображением времени истечения токена

```javascript
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

function TokenExpiryTimer() {
  const { user } = useSelector((state) => state.auth);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!user?.exp) return;

    const interval = setInterval(() => {
      const now = Date.now() / 1000;
      const secondsLeft = user.exp - now;

      if (secondsLeft <= 0) {
        setTimeLeft('Токен истек');
        return;
      }

      const hours = Math.floor(secondsLeft / 3600);
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = Math.floor(secondsLeft % 60);

      setTimeLeft(`${hours}ч ${minutes}м ${seconds}с`);
    }, 1000);

    return () => clearInterval(interval);
  }, [user?.exp]);

  if (!user?.exp) return null;

  return <div>Токен действителен еще: {timeLeft}</div>;
}
```

---

Все эти примеры можно использовать в вашем приложении!

