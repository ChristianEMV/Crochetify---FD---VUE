<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" @update:isOpen="toggleSidebar"/>
    <div class="header" :class="{ 'header-collapsed': isSidebarOpen }">
      <div class="header-wrapper">
        <h3><i class="fas fa-truck"></i> Envíos</h3>
        <h6>Gestión de envíos</h6>
      </div>
    </div>

    <transition name="fade">
      <b-alert 
        v-if="alert.show" 
        :variant="alert.type" 
        dismissible 
        @dismissed="alert.show = false" 
        class="alert-bottom-left"
      >
        {{ alert.message }}
      </b-alert>
    </transition>

    <div class="table-container">
      <h3 class="mb-4">Resumen de Envíos</h3>

      <!-- Buscador -->
      <div class="d-flex mb-3">
        <div class="search-input-container">
          <i class="fas fa-search search-icon"></i>
          <b-form-input
            v-model="searchQuery"
            placeholder="Buscar envíos..."
            class="search-input"
          ></b-form-input>
        </div>
      </div>

      <div v-if="isLoading" class="spinner-container">
        <b-spinner class="custom-spinner" label="Loading..."></b-spinner>
      </div>

      <!-- Tabla de envíos -->
      <b-table 
        v-else 
        :items="paginatedShipments" 
        :fields="fields" 
        responsive 
        striped 
        hover 
        small
      >
        <template #cell(idOrden)="row">
          <span @click="openShipmentModal(row.item)" class="shipment-id">{{ row.item.idOrden }}</span>
        </template>
        <template #cell(status)="row">
          <span
            :style="{
              backgroundColor: row.item.status === 1 ? 'yellow' : 'transparent',
              padding: '2px 5px',
              borderRadius: '4px',
            }"
          >
            {{ row.item.status === 1 ? 'Entrega pendiente' : row.item.status === 2 ? 'Entregado' : 'Error' }}
          </span>
        </template>
        <template #cell(shipping_day)="row">
          <span>{{ row.item.shipping_day || 'No asignada' }}</span>
        </template>
        <template #cell(delivery_day)="row">
          <span>{{ row.item.delivery_day || 'No asignada' }}</span>
        </template>
      </b-table>

      <!-- Paginador -->
      <b-pagination 
        v-model="currentPage" 
        :total-rows="filteredShipments.length" 
        :per-page="perPage" 
        align="center" 
        class="mt-3"
      ></b-pagination>
    </div>

    <!-- Modal de detalles del envío -->
    <b-modal v-model="showShipmentModal" title="Detalles del Envío" hide-footer>
      <div v-if="selectedShipment">
        <p><strong>ID de la Orden:</strong> {{ selectedShipment.idOrden }}</p>
        <p><strong>Total de la Orden:</strong> {{ selectedShipment.total }}</p>

        <p><strong>Productos:</strong></p>
        <ul>
          <li v-for="product in selectedShipment?.orderDetails?.ordenProducts || []" :key="product.stockId">
            <strong>{{ product.product.name }}</strong> (ID: {{ product.product.idProduct }})
            <br>Descripción: {{ product.product.description }}
            <br>Cantidad: {{ product.quantity }}
            <br>Color: <span :style="{ backgroundColor: product.color }" class="product-color"></span>
          </li>
        </ul>

        <p>
          <strong>Estado del Envío:</strong>
          {{ selectedShipment.status === 1 ? "Pendiente envío" : selectedShipment.status === 2 ? "Entregado" : "Error" }}
        </p>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { apiShipments, apiOrden } from "../http-common";

export default defineComponent({
  name: "Shipments",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const isLoading = ref(true);
    const alert = reactive({ show: false, message: "", type: "success" });
    const shipments = ref([]);
    const showShipmentModal = ref(false);
    const selectedShipment = ref<any>(null);

    const currentPage = ref(1);
    const perPage = ref(10);
    const searchQuery = ref(""); // Nueva variable para el texto de búsqueda

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const openShipmentModal = async (shipment: any) => {
      selectedShipment.value = { ...shipment };
      try {
        const orderData = await apiOrden.getOrdenById(shipment.idOrden);
        if (orderData.response?.pedido?.ordenProducts) {
          selectedShipment.value.orderDetails = orderData.response.pedido;
        } else {
          console.error("Detalles de la orden no disponibles");
        }
      } catch (error) {
        console.error("Error al cargar los detalles de la orden:", error);
        alert.show = true;
        alert.message = "Error al cargar los detalles de la orden.";
        alert.type = "danger";
      } finally {
        showShipmentModal.value = true;
      }
    };

    const fetchShipments = async () => {
      try {
        const data = await apiShipments.getAllShipments();
        shipments.value = Array.isArray(data.response.shipments) ? data.response.shipments : [];
      } catch (error) {
        console.error("Error al cargar los envíos:", error);
        alert.show = true;
        alert.message = "Error al cargar los envíos.";
        alert.type = "danger";
      } finally {
        isLoading.value = false;
      }
    };

    const filteredShipments = computed(() => {
      return shipments.value.filter((shipment: any) => {
        return (
          shipment.idOrden.toString().includes(searchQuery.value) ||
          shipment.shipping_day?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          shipment.delivery_day?.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      });
    });

    const paginatedShipments = computed(() => {
      const start = (currentPage.value - 1) * perPage.value;
      const end = start + perPage.value;
      return filteredShipments.value.slice(start, end);
    });

    onMounted(fetchShipments);

    const fields = [
      { key: "idOrden", label: "ID", sortable: true },
      { key: "status", label: "Estado", sortable: true },
      { key: "shipping_day", label: "Fecha de Envío", sortable: true },
      { key: "delivery_day", label: "Fecha de Entrega", sortable: true },
    ];

    return {
      isSidebarOpen,
      toggleSidebar,
      shipments,
      filteredShipments,
      paginatedShipments,
      fields,
      isLoading,
      alert,
      openShipmentModal,
      showShipmentModal,
      selectedShipment,
      currentPage,
      perPage,
      searchQuery,
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
