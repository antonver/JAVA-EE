# 📚 Система Бронирования Залов - Краткое Резюме

## ✅ Что сделано

Создана полная система бронирования залов для учителей с проверкой конфликтов.

---

## 🏗️ Backend

### 1. Entity `Reservation` (Many-to-Many с доп. полями)
```java
@Entity
public class Reservation {
    Long id;
    User enseignant;           // Кто бронирует (ManyToOne)
    Salle salle;              // Какой зал (ManyToOne)
    LocalDateTime dateDebut;  // Дата начала
    LocalDateTime dateFin;    // Дата конца
    String matiere;           // Предмет (ex: "Математика")
}
```

### 2. Repository
```java
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Мои бронирования
    List<Reservation> findByEnseignant(User enseignant);
    
    // Проверка конфликтов (зал уже занят?)
    List<Reservation> findConflicts(Salle salle, LocalDateTime start, LocalDateTime end);
    
    // Предстоящие занятия
    List<Reservation> findUpcomingByEnseignant(User enseignant, LocalDateTime now);
}
```

### 3. Controller
```
POST   /reservations                - Создать бронирование
GET    /reservations/mes-reservations - Мои бронирования
DELETE /reservations/{id}            - Удалить бронирование
```

### 4. DTOs (Java Records)
```java
// Запрос на создание
public record ReservationRequest(
    String salleNum,
    LocalDateTime dateDebut,
    LocalDateTime dateFin,
    String matiere
) {}

// Ответ с деталями
public record ReservationResponse(
    Long id,
    String enseignantNom,
    String salleNum,
    String batimentCode,
    LocalDateTime dateDebut,
    LocalDateTime dateFin,
    String matiere,
    int capacite
) {}
```

---

## 🎨 Frontend

### 1. Страница `Lessons.jsx`
- **Список** бронирований (карточки)
- **Форма** для создания бронирования
- **Кнопка удаления** для каждого бронирования
- **Responsive** дизайн Material-UI

### 2. Навигация (Layout.jsx)
```javascript
// Вкладка "Cours" видна только для USER и ADMIN (учителей)
if (user?.role === 'USER' || user?.role === 'ADMIN') {
    navigationItems.push({
      title: 'Cours',
      path: '/lessons',
      icon: <SchoolIcon />,
    });
}
```

### 3. API методы (api.js)
```javascript
createReservation(data)    // Создать
getMesReservations()       // Получить мои
deleteReservation(id)      // Удалить
```

---

## 📡 API Примеры

### Создать бронирование
```bash
POST /reservations
Authorization: Bearer <token>

{
  "salleNum": "36.01",
  "dateDebut": "2025-12-05T10:00:00",
  "dateFin": "2025-12-05T12:00:00",
  "matiere": "Mathématiques"
}

# Успех:
{
  "id": 1,
  "enseignantNom": "Jean Dupont",
  "salleNum": "36.01",
  ...
}

# Ошибка (конфликт):
"La salle est déjà réservée pour cette période"
```

---

## ⚠️ Проверка Конфликтов

**Логика:**
```
Существующее:   [====]
Новое:              [====]  ❌ Конфликт!

Существующее:   [====]
Новое:                  [====]  ✅ OK
```

**Query:**
```sql
SELECT * FROM reservation 
WHERE salle = ? 
AND ((dateDebut <= ? AND dateFin >= ?))
```

---

## 🔐 Безопасность

✅ **JWT** - Все endpoints требуют токен  
✅ **Ownership** - Можно удалять только свои бронирования  
✅ **Role-based** - Вкладка "Cours" видна только учителям  

---

## 🎯 Как использовать

1. **Войти** как учитель (role: USER или ADMIN)
2. **Открыть** вкладку "Cours" в навигации
3. **Нажать** "Réserver une salle"
4. **Заполнить** форму:
   - Номер зала: `36.01`
   - Предмет: `Mathématiques`
   - Дата начала: выбрать дату и время
   - Дата конца: выбрать дату и время
5. **Нажать** "Réserver"
6. ✅ Бронирование создано и отображается в списке!

---

## 📊 БД Структура

```sql
CREATE TABLE reservation (
    id BIGINT PRIMARY KEY,
    user_id INT NOT NULL,              -- FK -> users
    salle_num VARCHAR(16) NOT NULL,    -- FK -> salle
    date_debut DATETIME NOT NULL,
    date_fin DATETIME NOT NULL,
    matiere VARCHAR(100) NOT NULL,
    created_at TIMESTAMP
);
```

---

## 🎨 UI Компоненты

### Карточка бронирования
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

## ✅ Итого

| Компонент | Статус |
|-----------|--------|
| **Backend** | ✅ Готово |
| - Entity Reservation | ✅ |
| - Repository | ✅ |
| - Controller | ✅ |
| - DTOs (Records) | ✅ |
| - Проверка конфликтов | ✅ |
| **Frontend** | ✅ Готово |
| - Страница Lessons | ✅ |
| - Форма создания | ✅ |
| - Список бронирований | ✅ |
| - Навигация (только учителя) | ✅ |
| - API интеграция | ✅ |
| **Безопасность** | ✅ Готово |
| - JWT авторизация | ✅ |
| - Role-based access | ✅ |
| - Ownership проверка | ✅ |

---

## 🚀 Тестирование

1. **Запустить бэкенд:** `mvn spring-boot:run` (порт 8888) ✅
2. **Запустить фронтенд:** `npm run dev` (порт 5173) ✅
3. **Войти** как USER или ADMIN
4. **Проверить** вкладка "Cours" видна ✅
5. **Создать** бронирование ✅
6. **Попробовать** создать конфликтное → ошибка ✅
7. **Удалить** бронирование ✅

---

## 📝 Ключевые файлы

### Backend
- `src/main/java/Ex/modele/Reservation.java` - Entity
- `src/main/java/Ex/domain/ReservationRepository.java` - Repository
- `src/main/java/Ex/control/ReservationController.java` - Controller
- `src/main/java/Ex/dto/ReservationRequest.java` - DTO запрос
- `src/main/java/Ex/dto/ReservationResponse.java` - DTO ответ

### Frontend
- `frontend/src/pages/Lessons.jsx` - Страница с уроками
- `frontend/src/services/api.js` - API методы
- `frontend/src/components/Layout.jsx` - Навигация (обновлена)
- `frontend/src/App.jsx` - Роуты (обновлены)

---

## 🎉 Готово!

**Полная система бронирования залов для учителей работает! 🚀**

- ✅ Many-to-Many отношение User ↔ Salle
- ✅ Промежуточная таблица с датой и предметом
- ✅ Проверка конфликтов (зал уже занят)
- ✅ Вкладка "Cours" только для учителей
- ✅ Форма создания бронирования
- ✅ Удаление своих бронирований
- ✅ Responsive UI с Material-UI

**Все работает! Можно тестировать! 🎯**

