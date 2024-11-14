import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://44.202.43.227:8080/api/crochetify',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoryApi = {
  // Obtener todas las categorías
  getAllCategories: async () => {
    try {
      const response = await instance.get('/categories');
      console.log('Datos obtenidos de la API:', response.data); // Verifica los datos aquí
      return response.data;
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      throw error;
    }
  },
  

  // Registrar una nueva categoría
  createCategory: async (newCategory: { name: string; }) => {
    try {
      const response = await instance.post('/categories', newCategory);
      return response.data;
    } catch (error) {
      console.error('Error al registrar la categoría:', error);
      throw error;
    }
  },

  // Actualizar una categoría existente
  updateCategory: async (id: number, updatedCategory: { name: string; status: string }) => {
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

export const productApi = {
  // Obtener todas las categorías
  getAllProducts: async () => {
    try {
      const response = await instance.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw error;
    }
  },

  // Registrar una nueva categoría
  createProduct: async (newProduct: { nombre: string; state: string }) => {
    try {
      const response = await instance.post('/categories', newProduct);
      return response.data;
    } catch (error) {
      console.error('Error al registrar la categoría:', error);
      throw error;
    }
  },

  // Actualizar una categoría existente
  updateProduct: async (id: number, updatedProduct: { name: string; status: string }) => {
    try {
      const response = await instance.put(`/products/${id}`, updatedProduct);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      throw error;
    }
  },

  // Eliminar una categoría
  deleteProducts: async (id: number) => {
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
