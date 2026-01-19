import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция для получения книг
export const fetchBooks = async () => {
  try {
    const response = await api.get('/books');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении книг:', error);
    return [];
  }
};

// Функция для получения пользователей (только для админа)
export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return [];
  }
};
