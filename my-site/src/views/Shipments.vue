<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />
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
        <template #cell(idShipment)="row">
          <span @click="openShipmentModal(row.item)" class="shipment-id">{{ row.item.idShipment }}</span>
        </template>
        <template #cell(status)="row">
          <span>
            {{ row.item.status === 1 ? 'Enviado' : row.item.status === 2 ? 'Entregado' : 'Pendiente' }}
          </span>
        </template>
        <template #cell(shipping_day)="row">
          <span>{{ row.item.shipping_day || 'No asignada' }}</span>
        </template>
        <template #cell(delivery_day)="row">
          <span>{{ row.item.delivery_day || 'No asignada' }}</span>
        </template>
      </b-table>

      <!-- Paginación -->
      <b-pagination 
        v-model="currentPage" 
        :total-rows="shipments.length" 
        :per-page="perPage" 
        align="center" 
        class="mt-3"
      ></b-pagination>
    </div>

    <b-modal v-model="showShipmentModal" title="Detalles del Envío" hide-footer>
      <div v-if="selectedShipment">
        <p><strong>ID de la Orden:</strong> {{ selectedShipment.orden?.idOrden || 'N/A' }}</p>
        <p><strong>Estado de la Orden:</strong> {{ selectedShipment.orden?.status || 'No entregada' }}</p>
        <p><strong>Total de la Orden:</strong> {{ selectedShipment.orden?.total || 'N/A' }}</p>
        <p><strong>Fecha de Compra:</strong> {{ selectedShipment.orden?.purchase_day || 'N/A' }}</p>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { apiShipments } from "../http-common";

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

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const openShipmentModal = (shipment: any) => {
      selectedShipment.value = null;
      setTimeout(() => {
        selectedShipment.value = shipment;
        showShipmentModal.value = true;
      }, 0);
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

    const paginatedShipments = computed(() => {
      const start = (currentPage.value - 1) * perPage.value;
      const end = start + perPage.value;
      return shipments.value.slice(start, end);
    });

    onMounted(fetchShipments);

    const fields = [
      { key: "idShipment", label: "ID", sortable: true },
      { key: "status", label: "Estado", sortable: true },
      { key: "shipping_day", label: "Fecha de Envío", sortable: true },
      { key: "delivery_day", label: "Fecha de Entrega", sortable: true },
    ];

    return {
      isSidebarOpen,
      toggleSidebar,
      shipments,
      paginatedShipments,
      fields,
      isLoading,
      alert,
      openShipmentModal,
      showShipmentModal,
      selectedShipment,
      currentPage,
      perPage,
    };
  },
});
</script>


<style scoped>
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

.shipment-id {
  cursor: pointer;
  color: #007bff;
}
</style>
