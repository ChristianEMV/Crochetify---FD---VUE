import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoryApi = {
  // Obtener todas las categorías
  getAllCategories: async () => {
    try {
      const response = await instance.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      throw error;
    }
  },

  // Registrar una nueva categoría
  createCategory: async (newCategory: { nombre: string; state: string }) => {
    try {
      const response = await instance.post('/categories', newCategory);
      return response.data;
    } catch (error) {
      console.error('Error al registrar la categoría:', error);
      throw error;
    }
  },

  // Actualizar una categoría existente
  updateCategory: async (id: number, updatedCategory: { nombre: string; state: string }) => {
    try {
      const response = await instance.put(`/categories/${id}`, updatedCategory);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      throw error;
    }
  },

  // Eliminar una categoría
  deleteCategory: async (id: number) => {
    try {
      const response = await instance.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      throw error;
    }
  }
};

export default instance;
