import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api/crochetify',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoryApi = {
  getAllCategories: async () => {
    try {
      const response = await instance.get('/categories');
      console.log('Datos obtenidos de la API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      throw error;
    }
  },

  createCategory: async ({ name }: { name: string }) => {
    try {
      const response = await instance.post('/categories', { name });
      console.log("Categoria creada", response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear la categoria:', error);
      throw error;
    }
  },

  updateCategoryStatus: async (id: number, status: boolean) => {
    try {
      const response = await instance.put(`/categories/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el estado de la categoría:', error);
      throw error;
    }
  },

  getCategoryById: async (id: number) => {
    try {
      const response = await instance.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la categoría:', error);
      throw error;
    }
  }
};

export const userApi = {
  getAllUsers: async () => {
    try {
      const response = await instance.get('/users');
      console.log('Usuarios obtenidos de la API:', response.data);
      return response.data; // Retorna una lista de `UserDto`
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error;
    }
  },

  updateUserStatus: async (idUser: number, status: boolean) => {
    try {
      const response = await instance.put(`/users/${idUser}/status`, { status });
      console.log("Estado del usuario actualizado:", response.data);
      return response.data; // Retorna el `UserDto` con el estado actualizado
    } catch (error) {
      console.error('Error al actualizar el estado del usuario:', error);
      throw error;
    }
  },

  getUserById: async (idUser: number) => {
    try {
      const response = await instance.get(`/users/${idUser}`);
      console.log('Usuario obtenido:', response.data);
      return response.data; // Retorna un único `UserDto`
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      throw error;
    }
  }
};


export default instance;