import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://100.27.71.83:8087/api/crochetify',
  headers: {
    'Content-Type': 'application/json',
  },
});
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Agregar token al header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


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

  updateProduct: async (idProduct: number, productUpdateRequest: { name: string; description: string; categoryIds: number[] }) => {
    try {
      const response = await instance.put(`/products/${idProduct}`, productUpdateRequest);
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

export const stockApi = {
  createStock: async (stockData: { productId: number; color: string; price: number; quantity: number; images?: string[] }) => {
    try {
      const response = await instance.post('/stock', stockData);
      console.log('Stock creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear el stock:', error);
      throw error;
    }
  },

  getStocks: async () => {
    try {
      const response = await instance.get('/stock');
      console.log('Stocks obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los stocks:', error);
      throw error;
    }
  },

  getStockById: async (idStock: number) => {
    try {
      const response = await instance.get(`/stock/${idStock}`);
      console.log('Stock obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el stock:', error);
      throw error;
    }
  },

  updateStock: async (idStock: number, stockData: { color?: string; price?: number; quantity?: number; status?: boolean; images?: string[] }) => {
    try {
      const response = await instance.put(`/stock/${idStock}`, stockData);
      console.log('Stock actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el stock:', error);
      throw error;
    }
  }
};
export const userApi = {
  getAllUsers: async () => {
    try {
      const response = await instance.get('/users');
      console.log('Datos obtenidos de la API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error;
    }
  },

  updateUserStatus: async (id: number, status: boolean) => {
    try {
      const response = await instance.put(`/users/${id}/status`, { status });
      console.log("Estado del usuario actualizado:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el estado del usuario:', error);
      throw error;
    }
  },

  getUserById: async (id: number) => {
    try {
      const response = await instance.get(`/users/${id}`);
      console.log("Usuario obtenido:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      throw error;
    }
  }
};

export const apiShipments = {  
  getAllShipments: async () => {
    try {
      const response = await instance.get('/shipment');
      console.log('Datos obtenidos de la API:', response.data);

      // Verifica si la respuesta indica que no hay datos registrados
      if (response.data.success === false && response.data.message === "No existen shipments registrados") {
        console.warn('No hay shipments registrados. Retornando un arreglo vacío.');
        return { shipments: [] }; // Retorna un arreglo vacío en este caso
      }

      // Asegura que siempre se retorne un arreglo para evitar errores
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener los envíos:', error);

      // Manejo de errores específicos
      if (error.response?.status === 404) {
        console.warn('El endpoint /shipment no existe o no está disponible. Retornando un arreglo vacío.');
        return { shipments: [] }; // Retorna un arreglo vacío si el endpoint no existe
      }

      throw error; // Propagar otros errores
    }
  },
  getShipmentById: async (id: number) => {
    try {
      const response = await instance.get(`/shipment/${id}`);
      console.log("Envío obtenido:", response.data);
      return response.data || null; // Retornar null si no se obtiene un envío
    } catch (error) {
      console.error('Error al obtener el envío:', error);
      throw error;
    }
  },

  createShipment: async ({ shipping_day, idOrden }: { shipping_day: string; idOrden: number }) => {
    try {
      const response = await instance.post('/shipment', { shipping_day, idOrden });
      console.log('Envío registrado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear el envío:', error);
      throw error;
    }
  },
};


export const apiOrden = {
  getAllOrdenes: async () => {
    try {
      const response = await instance.get('/orden');
      console.log('Órdenes obtenidas:', response.data);

      // Asegurar que siempre retorne un arreglo vacío si el dato esperado no existe
      return response.data?.pedidosUsuario || [];
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
      throw error;
    }
  },

  getOrdenById: async (id: number) => {
    try {
      const response = await instance.get(`/orden/${id}`);
      console.log('Orden obtenida:', response.data);
      return response.data || null; // Retornar null si no se obtiene una orden
    } catch (error) {
      console.error('Error al obtener la orden:', error);
      throw error;
    }
  },
};


export default instance;
