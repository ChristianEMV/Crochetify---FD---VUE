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

    <!-- Buscador -->
    <div class="mb-3">
      <b-form-group label="Buscar órdenes:">
        <b-form-input
          v-model="searchQuery"
          placeholder="Buscar por ID o Producto..."
        ></b-form-input>
      </b-form-group>
    </div>

    <!-- Tabla con paginación -->
    <div class="table-container">
      <h3 class="mb-4">Resumen de Órdenes</h3>
      <b-table
        :items="filteredOrders"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        responsive
        striped
        hover
        small
      >
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
            ? row.item.ordenProducts
                .map((product: any) => product.product?.name || 'Producto desconocido')
                .join(', ')
            : 'No hay productos' }}
        </template>

        <template #cell(shipmentStatus)="row">
          <span
            :class="row.item.shipmentStatus === 1 || row.item.shipmentStatus === 2 ? 'text-success' : ''"
          >
            {{ row.item.shipmentStatus === 1 || row.item.shipmentStatus === 2
              ? 'Enviado'
              : 'Sin enviar' }}
          </span>
        </template>

        <template #cell(actions)="row">
          <b-button
            :disabled="row.item.shipmentStatus === 1 || row.item.shipmentStatus === 2"
            variant="success"
            @click="showCreateShipmentModal(row.item)"
          >
            {{ row.item.shipmentStatus === 1 || row.item.shipmentStatus === 2
              ? 'Enviado'
              : 'Enviar' }}
          </b-button>
        </template>
      </b-table>

      <!-- Paginador -->
      <b-pagination
        v-model="currentPage"
        :total-rows="filteredOrders.length"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
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
            <input
              type="date"
              v-model="newShipment.shipping_day"
              :min="new Date().toISOString().split('T')[0]"
              required
            />
          </b-form-group>
          <b-button type="submit" variant="success">Crear Envío</b-button>
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
          <li
            v-for="product in selectedOrder.ordenProducts || []"
            :key="product.product?.id || product.id"
          >
            {{ product.product?.name || 'Producto desconocido' }} - {{ product.quantity }}
          </li>
        </ul>
        <p>
          <strong>Estado del Envío:</strong>
          {{ selectedOrder.shipmentStatus === 1 || selectedOrder.shipmentStatus === 2
            ? 'Enviado'
            : 'No enviado' }}
        </p>
      </div>
      <div v-else>
        <p>No hay detalles disponibles para esta orden.</p>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
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
    const searchQuery = ref("");
    const currentPage = ref(1);
    const perPage = ref(5); // Número de órdenes por página
    const fields = [
      { key: "idOrden", label: "ID de Orden", sortable: true },
      { key: "total", label: "Total", sortable: true },
      { key: "ordenProducts", label: "Productos de la Orden", sortable: true },
      { key: "shipmentStatus", label: "Estado del Envío", sortable: true },
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
        const responseOrders = await apiOrden.getAllOrdenes();
        const responseShipments = await apiShipments.getAllShipments();

        const ordersData = responseOrders.response?.pedidosUsuario || [];
        const shipmentsData = responseShipments.response?.shipments || [];

        const shipmentMap = new Map(
          shipmentsData.map((shipment: any) => [shipment.idOrden, shipment.status || 0])
        );

        orders.value = ordersData.map((order: any) => ({
          ...order,
          shipmentStatus: shipmentMap.get(order.idOrden) || 0,
        }));
      } catch (error) {
        console.error("Error al cargar órdenes:", error);
        alert.show = true;
        alert.message = "Error al cargar las órdenes o envíos.";
        alert.type = "danger";
      }
    };

    const filteredOrders = computed(() => {
      const query = searchQuery.value.toLowerCase();
      return orders.value.filter(
        (order: any) =>
          order.idOrden.toString().includes(query) ||
          (order.ordenProducts &&
            order.ordenProducts.some((product: any) =>
              product.product?.name?.toLowerCase().includes(query)
            ))
      );
    });

    const showCreateShipmentModal = (order: any) => {
      if (typeof order.idOrden === "number") {
        newShipment.idOrden = order.idOrden;
        isCreateShipmentModalVisible.value = true;
      } else {
        console.error("idOrden no es válido.");
      }
    };

    const createShipment = async () => {
      if (newShipment.idOrden !== null && newShipment.shipping_day) {
        try {
          const response = await apiShipments.createShipment({
            idOrden: newShipment.idOrden,
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
      searchQuery,
      currentPage,
      perPage,
      fields,
      filteredOrders,
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
.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input-container {
  position: relative;
  flex-grow: 1;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #aaa;
}

.search-input {
  padding-left: 30px;
  border-radius: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #007bff;
  outline: none;
}

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

.b-table thead th {
  background-color: #f1f1f1;
  color: #333;
  font-weight: bold;
}

.b-table tbody tr:hover {
  background-color: #f7f7f7;
}

.b-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 5px;
}

.d-flex {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.btn-view-more {
  display: inline-block;
  padding: 10px 20px;
  font-size: 1rem;
  text-align: center;
  color: #007bff;
  background-color: white;
  border: 1px solid #007bff;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-decoration: none;
}

.btn-view-more {
  background-color: #007bff;
  color: white;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.custom-spinner {
  width: 3rem;
  height: 3rem;
  border-width: 0.3rem;
  color: #007bff;
}

.form-container {
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.alert-bottom-left {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1050;
}

.color-box {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.stock-name {
  cursor: pointer;
  color: #007bff;
}

.stock-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 10px;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-container {
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.image-preview {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.preview-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.drop-area {
  border: 2px dashed #007bff;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  color: #007bff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.drop-area:hover {
  background-color: #e9f5ff;
}

.b-form-group i {
  margin-right: 5px;
}
</style>