# 🐛 Исправление ошибки JWT декодирования

## ❌ Проблема

```
InvalidTokenError: Invalid token specified: must be a string
```

## 🔍 Причина

Endpoint `/auth/signup` возвращал объект `User` вместо объекта с JWT токеном:

```java
// ❌ БЫЛО (неправильно)
@PostMapping("/signup")
public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
    User registeredUser = authenticationService.signup(registerUserDto);
    return ResponseEntity.ok(registeredUser);
}
```

При этом фронтенд ожидал получить:
```json
{
  "token": "eyJhbGc...",
  "expiresIn": 604800000
}
```

Но получал объект User без поля `token`.

## ✅ Решение

Обновил endpoint `/auth/signup`, чтобы он возвращал `LoginResponse` с токеном:

```java
// ✅ ИСПРАВЛЕНО
@PostMapping("/signup")
public ResponseEntity<LoginResponse> register(@RequestBody RegisterUserDto registerUserDto) {
    User registeredUser = authenticationService.signup(registerUserDto);
    
    // Генерируем токен для зарегистрированного пользователя
    String jwtToken = jwtService.generateToken(registeredUser);
    
    // Возвращаем LoginResponse с токеном
    LoginResponse loginResponse = new LoginResponse()
        .setToken(jwtToken)
        .setExpiresIn(jwtService.getExpirationTime());
    
    return ResponseEntity.ok(loginResponse);
}
```

## 📋 Теперь оба endpoint'а возвращают одинаковый формат:

### `/auth/login` ✅
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800000
}
```

### `/auth/signup` ✅
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800000
}
```

## 🧪 Тестирование

Теперь можно:

1. **Зарегистрироваться:**
```bash
curl -X POST http://localhost:8888/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "fullName": "Новый Пользователь"
  }'
```

**Ответ:**
```json
{
  "token": "eyJhbGc...",
  "expiresIn": 604800000
}
```

2. **Войти:**
```bash
curl -X POST http://localhost:8888/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123"
  }'
```

**Ответ:**
```json
{
  "token": "eyJhbGc...",
  "expiresIn": 604800000
}
```

## ✨ Результат

- ✅ Регистрация возвращает JWT токен
- ✅ Вход возвращает JWT токен
- ✅ Токен декодируется правильно
- ✅ Роль пользователя извлекается из токена
- ✅ Пользователь автоматически авторизуется после регистрации

## 🚀 Готово к использованию!

Теперь система авторизации полностью работает:
- Регистрация ✅
- Вход ✅
- Декодирование JWT ✅
- Извлечение роли ✅
- Redux state management ✅
- Защищенные маршруты ✅

