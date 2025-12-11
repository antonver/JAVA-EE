import axios from 'axios';

// Базовый URL API (из .env или дефолтный порт 8888)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок ответа
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Регистрация нового пользователя
 * @param {Object} userData - { email, password, fullName }
 * @returns {Promise} - Ответ от сервера
 */
export const register = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

/**
 * Вход пользователя
 * @param {Object} credentials - { email, password }
 * @returns {Promise} - Ответ с токеном
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Выход пользователя (опционально, если требуется)
 * @returns {Promise}
 */
export const logout = async () => {
  // Если есть endpoint для выхода на бэкенде
  // await api.post('/auth/logout');
  
  // Очищаем локальное хранилище
  localStorage.removeItem('token');
};

/**
 * Получить список зданий для карты (доступно всем)
 * @returns {Promise} - Список зданий
 */
export const getBatiments = async () => {
  const response = await api.get('/api/data/batiments');
  return response.data;
};

/**
 * Получить полные данные зданий (только для админа)
 * @returns {Promise} - Список зданий с полной информацией
 */
export const getBatimentsAdmin = async () => {
  const response = await api.get('/admin/data/batiments');
  return response.data;
};

/**
 * Calculer la distance entre deux bâtiments
 * @param {string} code1 - Code du premier bâtiment
 * @param {string} code2 - Code du deuxième bâtiment
 * @returns {Promise} - Distance et informations
 */
export const getDistanceBetween = async (code1, code2) => {
  const response = await api.get('/distance/between', {
    params: { code1, code2 }
  });
  return response.data;
};

/**
 * Créer une réservation de salle
 * @param {Object} reservationData - { salleNum, dateDebut, dateFin, matiere }
 * @returns {Promise} - Réservation créée
 */
export const createReservation = async (reservationData) => {
  const response = await api.post('/reservations', reservationData);
  return response.data;
};

/**
 * Récupérer les réservations de l'enseignant connecté
 * @returns {Promise} - Liste des réservations
 */
export const getMesReservations = async () => {
  const response = await api.get('/reservations/mes-reservations');
  return response.data;
};

/**
 * Supprimer une réservation
 * @param {number} id - ID de la réservation
 * @returns {Promise}
 */
export const deleteReservation = async (id) => {
  const response = await api.delete(`/reservations/${id}`);
  return response.data;
};

// === USER PROFILE API ===
export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch('/users/me', profileData);
  return response.data;
};

// === ADMIN API ===
export const getCampus = async () => {
  const response = await api.get('/admin/data/campus');
  return response.data;
};

export const getAllReservations = async () => {
  const response = await api.get('/reservations');
  return response.data;
};

/**
 * Récupérer la liste de toutes les salles (pour tous les utilisateurs)
 * @returns {Promise} - Liste des salles
 */
export const getSalles = async () => {
  const response = await api.get('/api/data/salles');
  return response.data;
};

/**
 * Récupérer la liste de toutes les composantes (pour tous les utilisateurs)
 * @returns {Promise} - Liste des composantes
 */
export const getComposantes = async () => {
  const response = await api.get('/api/data/composantes');
  return response.data;
};

/**
 * Récupérer les salles (admin - données complètes)
 */
export const getSallesAdmin = async () => {
  const response = await api.get('/admin/data/salles');
  return response.data;
};

/**
 * Récupérer les composantes (admin - données complètes)
 */
export const getComposantesAdmin = async () => {
  const response = await api.get('/admin/data/composantes');
  return response.data;
};

export default api;

