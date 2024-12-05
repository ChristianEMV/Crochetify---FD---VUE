<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />
    <div class="header" :class="{ 'header-collapsed': isSidebarOpen }">
      <div class="header-wrapper">
        <h3><i class="fas fa-box"></i> Órdenes</h3>
        <h6>Gestión de órdenes</h6>
      </div>
    </div>

    <b-alert v-if="alert.show" :variant="alert.type" dismissible>
      {{ alert.message }}
    </b-alert>

    <div class="table-container">
      <h3 class="mb-4">Resumen de Órdenes</h3>
      <b-table :items="orders" :fields="fields" responsive striped hover small>
        <template #cell(idOrden)="row">
          <b-button
            variant="link"
            class="text-primary"
            @click="showOrderModal(row.item)"
          >
            {{ row.item.idOrden }}
          </b-button>
        </template>

        <template #cell(ordenProducts)="row">
          {{ row.item.ordenProducts && Array.isArray(row.item.ordenProducts)
            ? row.item.ordenProducts.map((product: any) => product.product?.name || 'Producto desconocido').join(', ')
            : 'No hay productos' }}
        </template>

        <template #cell(shipmentStatus)="row">
  <span :class="row.item.shipmentStatus === 1 ? 'text-success' : ''">
    {{ row.item.shipmentStatus === 1 ? "Enviado" : "Sin enviar" }}
  </span>
</template>


        <template #cell(actions)="row">
          <b-button
            :disabled="row.item.shipmentStatus === 1"
            variant="success"
            @click="showCreateShipmentModal(row.item)"
          >
            {{ row.item.shipmentStatus === 1 ? "Enviado" : "Enviar" }}
          </b-button>
        </template>
      </b-table>
    </div>

    <!-- Modal para crear un shipment (enviar) -->
    <b-modal
      v-model="isCreateShipmentModalVisible"
      title="Crear Envío"
      @hide="resetShipmentForm"
    >
      <div>
        <b-form @submit.prevent="createShipment">
          <b-form-group label="Fecha de Envío">
            <b-form-group label="Fecha de Envío">
  <input
    type="date"
    v-model="newShipment.shipping_day"
    :min="new Date().toISOString().split('T')[0]"  
    required
  />
</b-form-group>

          </b-form-group>

          <b-button type="submit" variant="success" >
            Crear Envío
          </b-button>
        </b-form>
      </div>
      
    </b-modal>

    <!-- Modal de Detalles de la Orden -->
    <b-modal
      v-model="isOrderModalVisible"
      title="Detalles de la Orden"
      @hide="selectedOrder = null"
    >
      <div v-if="selectedOrder">
        <p><strong>ID de Orden:</strong> {{ selectedOrder.idOrden }}</p>
        <p><strong>Total:</strong> {{ selectedOrder.total }}</p>
        <p><strong>Productos:</strong></p>
        <ul>
          <li v-for="product in selectedOrder.ordenProducts || []" :key="product.product?.id || product.id">
            {{ product.product?.name || 'Producto desconocido' }} - {{ product.quantity }}
          </li>
        </ul>
        <p>
          <strong>Estado del Envío:</strong>
          {{ selectedOrder.shipmentStatus === 1 ? "Enviado" : "No enviado" }}
        </p>
      </div>
      <div v-else>
        <p>No hay detalles disponibles para esta orden.</p>
      </div>
      
    </b-modal>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { apiOrden, apiShipments } from "../http-common";

export default defineComponent({
  name: "Orders",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const alert = reactive({ show: false, message: "", type: "success" });
    const orders = ref([]);
    const fields = [
      { key: "idOrden", label: "ID de Orden" },
      { key: "total", label: "Total" },
      { key: "ordenProducts", label: "Productos de la Orden" },
      { key: "shipmentStatus", label: "Estado del Envío" },
      { key: "actions", label: "Acciones" },
    ];
    const isCreateShipmentModalVisible = ref(false);
    const newShipment = reactive<{
      shipping_day: string;
      idOrden: number | null;
    }>({
      shipping_day: "",
      idOrden: null,
    });
    const isOrderModalVisible = ref(false);
    const selectedOrder = ref<any>(null);

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const fetchOrders = async () => {
  try {
    // Hacer la solicitud para obtener las órdenes
    const responseOrders = await apiOrden.getAllOrdenes();
    
    // Verificar si la respuesta es válida
    console.log('Respuesta de órdenes:', responseOrders); // Inspecciona la respuesta completa

    // Comprobamos si `responseOrders` y `responseOrders.response` existen
    if (responseOrders && responseOrders.response && responseOrders.response.pedidosUsuario) {
      const ordersData = responseOrders.response.pedidosUsuario;
      console.log('Órdenes obtenidas:', ordersData); // Ver las órdenes obtenidas

      // Obtener los envíos
      const responseShipments = await apiShipments.getAllShipments();
      console.log('Respuesta de envíos:', responseShipments); // Ver la respuesta completa de envíos

      // Asegurarse de que los envíos existen
      const shipmentsData = responseShipments?.response?.shipments || [];
      const shipmentMap = new Map(
        shipmentsData.map((shipment: any) => [shipment.idOrden, shipment.status || 0])
      );

      // Asignar las órdenes mapeadas
      orders.value = ordersData.map((order: any) => ({
        ...order,
        shipmentStatus: shipmentMap.get(order.idOrden) || 0,
      }));
      console.log('Órdenes después del mapeo:', orders.value); // Ver las órdenes mapeadas
    } else {
      console.error('Error: La respuesta de órdenes no tiene la estructura esperada.');
      alert.show = true;
      alert.message = "No se encontraron órdenes.";
      alert.type = "danger";
      orders.value = [];
    }
  } catch (error) {
    console.error("Error al cargar órdenes o envíos:", error);
    alert.show = true;
    alert.message = "Error al cargar las órdenes o envíos.";
    alert.type = "danger";
    orders.value = [];
  }
};


    const showCreateShipmentModal = (order: any) => {
      if (typeof order.idOrden === "number") {
        newShipment.idOrden = order.idOrden;
        isCreateShipmentModalVisible.value = true;
      } else {
        console.error("idOrden no es válido.");
      }
    };

    const createShipment = async () => {
  // Asegurarse de que idOrden no sea null
  if (newShipment.idOrden !== null && newShipment.shipping_day) {
    try {
      const response = await apiShipments.createShipment({
        idOrden: newShipment.idOrden,  // Ahora idOrden es siempre un número
        shipping_day: newShipment.shipping_day,
      });
      alert.show = true;
      alert.message = response.message || "Envío creado exitosamente.";
      alert.type = "success";
      isCreateShipmentModalVisible.value = false;
      fetchOrders();
    } catch (error) {
      alert.show = true;
      alert.message = "Error al crear el envío.";
      alert.type = "danger";
    }
  } else {
    alert.show = true;
    alert.message = "Por favor, complete todos los campos.";
    alert.type = "danger";
  }
};


    const resetShipmentForm = () => {
      newShipment.shipping_day = "";
      newShipment.idOrden = null;
    };

    const showOrderModal = (order: any) => {
      selectedOrder.value = order;
      isOrderModalVisible.value = true;
    };

    onMounted(() => {
      fetchOrders();
    });

    return {
      isSidebarOpen,
      alert,
      orders,
      fields,
      isCreateShipmentModalVisible,
      newShipment,
      isOrderModalVisible,
      selectedOrder,
      toggleSidebar,
      showCreateShipmentModal,
      createShipment,
      resetShipmentForm,
      showOrderModal,
    };
  },
});
</script>

  <style scoped>
  /* Estilos similares, ajustando los títulos */
  .header {
    width: 100%;
    height: 25vh;
    background: linear-gradient(135deg, #30596b, #5eaed1);
    color: white;
    padding: 20px;
    transition: margin-left 0.3s;
  }
  
  .header-collapsed {
    margin-left: 250px;
  }
  
  .header-wrapper {
    padding: 20px;
  }
  
  .table-container {
    width: 98%;
    margin: 20px auto;
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  </style>
  