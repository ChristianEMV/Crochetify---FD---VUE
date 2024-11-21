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

export const productApi = {
  createProduct: async (productCreateRequest: {name: string; description: string; categoryIds: number[] }) => {
    try {
      const response = await instance.post('/products', productCreateRequest);
      console.log('Producto creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw error;
    }
  },

  updateProduct: async (idProduct: number, productCreateRequest: { name: string; description: string; categoryIds: number[] }) => {
    try {
      const response = await instance.put(`/products/${idProduct}`, productCreateRequest);
      console.log('Producto actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw error;
    }
  },

  getProductById: async (idProduct: number) => {
    try {
      const response = await instance.get(`/products/${idProduct}`);
      console.log('Producto obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      throw error;
    }
  },

  getProducts: async () => {
    try {
      const response = await instance.get('/products');
      console.log('Productos obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw error;
    }
  }
};


export default instance;