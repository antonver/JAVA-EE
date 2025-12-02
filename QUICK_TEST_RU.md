# 🧪 Быстрый Тест Системы Бронирования

## ✅ Что исправлено:

1. ✅ Роль `ENSEIGNANT` теперь видит вкладку "Cours"
2. ✅ Autocomplete без ошибок дублирующихся ключей
3. ✅ Ошибки отображаются как текст (не объект)
4. ✅ Проверка: нельзя вести один курс в двух залах одновременно

---

## 🚀 Как протестировать:

### 1. Обнови страницу
```
F5 или Ctrl+R
```

### 2. Проверь вкладку "Cours"
Теперь должна быть видна! 🎓

### 3. Открой форму бронирования
Нажми **"Réserver une salle"**

### 4. Выбери зал из списка
Кликни на поле **"Salle"** → увидишь список:
```
36.01 [amphi] - 150 places
07.102 [td] - 30 places
05.Dumoulin [amphi] - 400 places
...
```

### 5. Заполни форму
```
Salle:        36.01
Matière:      Mathématiques
Date début:   2025-12-05 10:00
Date fin:     2025-12-05 12:00
```

### 6. Нажми "Réserver"

---

## 📊 Ожидаемые результаты:

### ✅ Успех
```
Бронирование создано и появилось в списке!
```

### ❌ Ошибка 1: Сала занята
```
"La salle est déjà réservée pour cette période"
```

### ❌ Ошибка 2: Уже ведешь этот курс
```
"Vous avez déjà un cours de Mathématiques prévu à cette période"
```

---

## 🔍 Если все еще 500 ошибка:

### Проверь в консоли браузера (F12):

1. **Network** → клик на запрос `reservations`
2. **Response** → что вернул бэкенд?

**Возможные причины:**
- Таблица `reservation` не создана в БД
- Проблема с датой (формат LocalDateTime)
- Проблема с Foreign Keys

### Покажи мне что в Response:
```
Status: 500
Response: {
  "timestamp": "...",
  "message": "...",  // ← Это важно!
  "error": "..."
}
```

---

## 📝 Что проверить в БД (если 500):

```sql
-- Проверить существует ли таблица
SHOW TABLES LIKE 'reservation';

-- Если нет - создать вручную
CREATE TABLE reservation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    salle_num VARCHAR(16) NOT NULL,
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NOT NULL,
    matiere VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (salle_num) REFERENCES salle(numS)
);
```

---

## 🎯 Для отладки запросов:

### В консоли браузера (F12 → Network):

Должны видеть запросы:
```
GET  /salles                      - Загрузка списка залов
POST /reservations                - Создание бронирования
GET  /reservations/mes-reservations - Загрузка моих бронирований
```

**Для каждого запроса проверь:**
- Status (200 = OK, 500 = ошибка бэкенда)
- Response (что вернул сервер)
- Request Payload (что отправили)

---

## 🎉 Если работает:

Ты увидишь:
1. ✅ Вкладка "Cours" в навигации
2. ✅ Список залов в Autocomplete
3. ✅ Созданное бронирование в виде карточки:

```
┌────────────────────────────┐
│ Mathématiques    [36.01]   │
├────────────────────────────┤
│ 📅 05/12/2025 10:00        │
│ 📅 Fin: 05/12/2025 12:00   │
│ 📍 Bâtiment: TRI_36        │
│ 📚 Capacité: 150 places    │
├────────────────────────────┤
│                       [🗑️] │
└────────────────────────────┘
```

---

**Попробуй и дай знать что получилось! 🚀**

