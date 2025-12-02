import { jwtDecode } from 'jwt-decode';

/**
 * Декодирует JWT токен и извлекает информацию о пользователе
 * @param {string} token - JWT токен
 * @returns {object|null} - Декодированная информация пользователя или null
 */
export const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Ошибка декодирования токена:', error);
    return null;
  }
};

/**
 * Получает роль пользователя из токена
 * @param {string} token - JWT токен
 * @returns {string|null} - Роль пользователя или null
 */
export const getUserRole = (token) => {
  const decoded = decodeToken(token);
  
  // Бэкенд сохраняет роль как "roles" с префиксом "ROLE_"
  // Например: "ROLE_USER" или "ROLE_ADMIN" или "ROLE_USER,ROLE_ADMIN"
  if (decoded?.roles) {
    // Если несколько ролей через запятую, берем первую
    const firstRole = decoded.roles.split(',')[0].trim();
    // Убираем префикс "ROLE_" если он есть
    const role = firstRole.replace('ROLE_', '');
    return role;
  }
  
  // Fallback для других форматов
  return decoded?.role || decoded?.authorities?.[0] || null;
};

/**
 * Проверяет, истек ли токен
 * @param {string} token - JWT токен
 * @returns {boolean} - true если токен истек
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Получает информацию о пользователе из токена
 * @param {string} token - JWT токен
 * @returns {object|null} - Информация о пользователе
 */
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Debug: выводим декодированный токен в консоль
  console.log('🔍 Декодированный JWT токен:', decoded);
  console.log('🔍 Роль извлеченная:', getUserRole(token));
  console.log('🔍 FullName из токена:', decoded.fullName);
  console.log('🔍 Все поля decoded:', Object.keys(decoded));

  return {
    email: decoded.sub || decoded.email,
    role: getUserRole(token),
    fullName: decoded.fullName || decoded.name || decoded.full_name || 'Utilisateur',
    exp: decoded.exp,
  };
};

