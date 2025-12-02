# 🔧 Исправление JWT парсинга роли

## ❌ Проблема

JWT токен плохо парсился на фронтенде - роль не извлекалась.

**Причина:** 
- Backend сохраняет роль как `roles` (например: `"ROLE_USER"`)
- Frontend искал `role` (единственное число)

---

## ✅ Что исправлено

### 1. Frontend (`jwtUtils.js`)

**Было:**
```javascript
export const getUserRole = (token) => {
  const decoded = decodeToken(token);
  return decoded?.role || decoded?.authorities?.[0] || null;
};
```

**Стало:**
```javascript
export const getUserRole = (token) => {
  const decoded = decodeToken(token);
  
  // Бэкенд сохраняет роль как "roles" с префиксом "ROLE_"
  if (decoded?.roles) {
    // Убираем префикс "ROLE_"
    const role = decoded.roles.replace('ROLE_', '');
    return role;  // Вернет "USER" или "ADMIN"
  }
  
  return decoded?.role || decoded?.authorities?.[0] || null;
};
```

### 2. Backend (`JwtService.java`)

Добавлен `fullName` в JWT токен:

```java
public String generateToken(UserDetails userDetails) {
    Map<String, Object> claims = new HashMap<>();

    String roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(","));
    claims.put("roles", roles);
    
    // Добавляем fullName
    if (userDetails instanceof Ex.modele.User) {
        Ex.modele.User user = (Ex.modele.User) userDetails;
        claims.put("fullName", user.getFullName());
    }

    return generateToken(claims, userDetails);
}
```

### 3. Debug вывод

Добавлен console.log для отладки:

```javascript
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Debug: выводим декодированный токен в консоль
  console.log('🔍 Декодированный JWT токен:', decoded);
  console.log('🔍 Роль извлеченная:', getUserRole(token));

  return {
    email: decoded.sub || decoded.email,
    role: getUserRole(token),
    fullName: decoded.fullName || decoded.name,
    exp: decoded.exp,
  };
};
```

---

## 🧪 Как проверить исправление

### 1. Выйти и войти заново

**Важно:** Старый токен не содержит правильный формат!

1. **Выйти** из приложения (Déconnexion)
2. **Войти** снова (логин/пароль)
3. Новый JWT токен будет сгенерирован с правильным форматом

### 2. Проверить консоль браузера

После логина откройте консоль браузера (`F12` → Console):

```javascript
🔍 Декодированный JWT токен: {
  sub: "user@example.com",
  roles: "ROLE_USER",       // ← Роль с префиксом
  fullName: "Jean Dupont",  // ← Имя пользователя
  iat: 1733...,
  exp: 1733...
}
🔍 Роль извлеченная: USER  // ← Роль БЕЗ префикса
```

### 3. Проверить Redux DevTools

Установите [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd):

1. Откройте Redux DevTools
2. Перейдите в `State` → `auth`
3. Проверьте:

```javascript
{
  auth: {
    user: {
      email: "user@example.com",
      role: "USER",          // ← Должна быть роль!
      fullName: "Jean Dupont",
      exp: 1733...
    },
    isAuthenticated: true,
    token: "eyJhbGci..."
  }
}
```

### 4. Проверить вкладку "Cours"

Если роль = **USER** или **ADMIN**:
- ✅ Вкладка "Cours" должна быть видна в навигации

Если роль другая или отсутствует:
- ❌ Вкладка "Cours" не будет видна

---

## 📊 Формат JWT токена

### До исправления ❌
```json
{
  "sub": "user@example.com",
  "roles": "ROLE_USER",
  "iat": 1733...,
  "exp": 1733...
}
```
**Проблема:** Нет `fullName`, роль искалась неправильно

### После исправления ✅
```json
{
  "sub": "user@example.com",
  "roles": "ROLE_USER",
  "fullName": "Jean Dupont",
  "iat": 1733...,
  "exp": 1733...
}
```
**Решение:** Добавлен `fullName`, роль извлекается правильно

---

## 🔍 Troubleshooting

### Проблема: Роль все еще `null`

**Решение:**
1. **Выйти** из приложения
2. **Очистить localStorage:**
   - Открыть консоль: `F12`
   - Выполнить: `localStorage.clear()`
   - Обновить страницу: `F5`
3. **Войти** заново

### Проблема: Вкладка "Cours" не видна

**Проверить:**
1. Роль в Redux: должна быть `"USER"` или `"ADMIN"`
2. Консоль браузера: есть ли ошибки?
3. Layout.jsx: условие показа вкладки

**Код в Layout.jsx:**
```javascript
// Вкладка "Cours" для USER и ADMIN
if (user?.role === 'USER' || user?.role === 'ADMIN') {
    navigationItems.push({
      title: 'Cours',
      path: '/lessons',
      icon: <SchoolIcon />,
    });
}
```

### Проблема: `fullName` показывает `undefined`

**Решение:**
1. Backend перезапущен? ✅
2. Выйти и войти заново (новый токен)
3. Проверить консоль: `console.log('🔍 Декодированный JWT токен:', decoded)`

---

## 📝 Измененные файлы

### Backend (1 файл)
- `src/main/java/Ex/service/JwtService.java`
  - Добавлен `fullName` в claims

### Frontend (1 файл)
- `frontend/src/utils/jwtUtils.js`
  - Исправлен `getUserRole()` для поиска `roles` вместо `role`
  - Добавлено удаление префикса `ROLE_`
  - Добавлен debug вывод

---

## ✅ Checklist

Проверьте что все работает:

- [ ] Backend перезапущен (port 8888)
- [ ] Frontend работает (port 5173)
- [ ] Выход из приложения
- [ ] Вход заново
- [ ] Консоль браузера: видны debug логи с токеном
- [ ] Redux DevTools: `user.role` не `null`
- [ ] Вкладка "Cours" видна в навигации (для USER/ADMIN)
- [ ] Можно создать бронирование

---

## 🎯 Ожидаемый результат

### В консоли браузера:
```
🔍 Декодированный JWT токен: {sub: "user@example.com", roles: "ROLE_USER", fullName: "Jean Dupont", ...}
🔍 Роль извлеченная: USER
```

### В Redux:
```javascript
user: {
  email: "user@example.com",
  role: "USER",            // ✅ Роль есть!
  fullName: "Jean Dupont", // ✅ Имя есть!
  exp: 1733...
}
```

### В UI:
- ✅ В AppBar отображается имя: "Jean Dupont"
- ✅ Роль отображается: "USER"
- ✅ Вкладка "Cours" видна

---

## 🚀 Все готово!

После перезапуска backend и re-login проблема должна быть решена! 🎉

**Не забудьте выйти и войти заново для получения нового JWT токена!**

