import axios from 'axios';


// Crear instancia de Axios
const instance = axios.create({
  baseURL: 'http://54.146.53.211:8087/api/crochetify', // Base URL de la API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitudes: Agregar token y manejar offline
instance.interceptors.request.use(
  async (config) => {
    // Agregar token de autorización si está disponible
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Verificar conexión a Internet
    if (!navigator.onLine) {
      const pendingRequest = {
        _id: new Date().toISOString(), // ID único basado en el timestamp
        method: config.method,
        url: config.url,
        data: config.data || null,
        params: config.params || null,
      };

      // Guardar la solicitud en PouchDB
      await pendingRequestsDB.put(pendingRequest);
      console.log('Solicitud guardada localmente en PouchDB:', pendingRequest);

      // Rechazar la solicitud con un error controlado
      return Promise.reject(new Error('Sin conexión a Internet. La solicitud se guardará localmente.'));
    }

    return config;
  },
  (error) => Promise.reject(error) // Manejo de errores en el interceptor
);

// Función para sincronizar las solicitudes pendientes
const syncPendingRequests = async () => {
  if (!navigator.onLine) return; // Solo sincronizar si hay conexión

  const pendingRequests = await pendingRequestsDB.allDocs({ include_docs: true });

  if (!pendingRequests.rows.length) {
    console.log('No hay solicitudes pendientes para sincronizar.');
    return;
  }

  console.log(`Sincronizando ${pendingRequests.rows.length} solicitudes pendientes...`);
  for (const { doc } of pendingRequests.rows) {
    try {
      const response = await axios({
        method: doc.method,
        url: doc.url.startsWith('http') ? doc.url : `${instance.defaults.baseURL}${doc.url}`,
        data: doc.data,
        params: doc.params,
      });

      if (response.status >= 200 && response.status < 300) {
        console.log('Solicitud sincronizada exitosamente:', response.data);
        await pendingRequestsDB.remove(doc); // Eliminar solicitud sincronizada
      } else {
        console.error('Error al sincronizar la solicitud. Código:', response.status);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al sincronizar la solicitud:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
    }
  }
};

// Escuchar eventos para la sincronización automática
window.addEventListener('online', async () => {
  console.log('Conexión restaurada, sincronizando datos...');
  await syncPendingRequests();
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

  updateCategoryName: async (idCategory: number, name: string) => {
    try {
      const response = await instance.put('/categories', { idCategory, name });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el nombre de la categoría:', error);
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

  updateStock: async (
    idStock: number,
    stockData: { color?: string; price?: number; quantity?: number; status?: boolean; images?: string[] } // Cambiado a array de strings
  ) => {
    try {
      // Ya no necesitas transformar imágenes aquí si el front las envía correctamente
      const response = await instance.put(`/stock/${idStock}`, stockData);
      console.log("Stock actualizado:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error al actualizar el stock:", error.response?.data || error.message);
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
      // Validar formato de shipping_day
      if (!/^\d{4}-\d{2}-\d{2}$/.test(shipping_day)) {
        throw new Error('Formato de fecha inválido. Debe ser YYYY-MM-DD');
      }
  
      if (!Number.isInteger(idOrden) || idOrden <= 0) {
        throw new Error('El idOrden debe ser un número entero positivo');
      }
  
      const response = await instance.post('/shipment', { shipping_day, idOrden });
      console.log('Envío registrado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear el envío:', error.response?.data || error.message);
      throw error;
    }
  }  
  
  
};


export const apiOrden = {
  getAllOrdenes: async () => {
    try {
      const response = await instance.get('/orden');
      console.log('Órdenes obtenidas:', response.data);
  
      return response.data;  // Return the full response, not just pedidosUsuario
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