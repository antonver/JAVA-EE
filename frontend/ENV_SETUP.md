# Настройка переменных окружения

## Создайте файл .env в папке frontend

```bash
cd frontend
touch .env
```

## Содержимое файла .env

```env
# URL вашего бэкенд API (БЕЗ /api на конце)
VITE_API_URL=http://localhost:8888
```

## Важно!

- Файл `.env` не будет коммититься в git (он в .gitignore)
- После изменения `.env` перезапустите dev-сервер
- Для Vite все переменные должны начинаться с `VITE_`

## Проверка

Чтобы убедиться, что переменная загружена:

```javascript
console.log(import.meta.env.VITE_API_URL);
```

