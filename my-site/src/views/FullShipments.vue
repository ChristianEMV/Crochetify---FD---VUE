<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />
    <div class="dashboard d-flex justify-content-center">
      <b-card class="shadow-lg rounded modern-card w-100">
    <div class="d-flex justify-content-between mb-3">
      <h3 class="text-center mb-4">Envíos</h3>

      <b-form-group label="Filtrar por:" class="filter-label d-flex align-items-center ">
        
        <b-form-select v-model="dateFilter" :options="dateFilterOptions" class="w-auto" @change="applyFilters" />
        
 
        
      </b-form-group>
      <b-form-select v-model="itemsPerPage" :options="pageOptions" class="w-auto" />
    </div>

    <!-- Tabla de envíos -->
    <b-table :items="filteredShipments" :fields="fields" bordered hover responsive>
      <template #cell(detalles)="data">
        <b-button size="sm" variant="info" @click="openModal(data.item)">
          Ver <i class="fas fa-eye"></i>
        </b-button>
      </template>
    </b-table>

    <!-- Modal de Detalles del Envío -->
    <b-modal v-model="isModalOpen" title="Detalles del Envío">
      <p><strong>ID del Envío:</strong> {{ selectedShipment.idShipment }}</p>
      <p><strong>Estado:</strong> {{ selectedShipment.status }}</p>

      <b-form-group label="Fecha de Envío">
        <b-form-input type="date" v-model="selectedShipment.shipping_day"></b-form-input>
      </b-form-group>
      <b-form-group label="Fecha de Entrega">
        <b-form-input type="date" v-model="selectedShipment.delivery_day"></b-form-input>
      </b-form-group>

      <h5>Productos en el Envío</h5>
      <ul>
        <li v-for="product in selectedShipment.products" :key="product.id">
          <a href="">{{ product.name }} - Cantidad: {{ product.quantity }}</a>
        </li>
      </ul>

      <!-- Botones para guardar o cancelar cambios -->
      <template #modal-footer>
        <b-button variant="success" @click="updateShipment">Guardar Cambios</b-button>
        <b-button variant="danger" @click="isModalOpen = false">Cancelar</b-button>
      </template>
    </b-modal>
  </b-card>
  </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';

export default {
  name: 'ShipmentsTable',
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const fields = [
      { key: 'idShipment', label: 'ID de Envío', sortable: true },
      { key: 'status', label: 'Estado', sortable: true },
      { key: 'shipping_day', label: 'Fecha de Envío', sortable: true },
      { key: 'delivery_day', label: 'Fecha de Entrega', sortable: true },
      { key: 'detalles', label: 'Detalles' }
    ];

    const shipments = ref([
      {
        idShipment: 'A123',
        status: 'En tránsito',
        shipping_day: '2024-11-10',
        delivery_day: '2024-11-15',
        products: [
          { id: 'P1', name: 'Producto 1', quantity: 2 },
          { id: 'P2', name: 'Producto 2', quantity: 1 }
        ]
      },
      {
        idShipment: 'B456',
        status: 'Entregado',
        shipping_day: null,
        delivery_day: '2024-11-09',
        products: [
          { id: 'P3', name: 'Producto 3', quantity: 5 }
        ]
      }
    ]);

    const isModalOpen = ref(false);
    const selectedShipment = ref({});
    const itemsPerPage = ref(10);
    const dateFilter = ref(null);

    const openModal = (shipment) => {
      selectedShipment.value = shipment;
      isModalOpen.value = true;
    };

    const updateShipment = () => {
      console.log('Envío actualizado:', selectedShipment.value);
      isModalOpen.value = false;
    };

    // Opciones de filtro para "Sin fecha de envío" y "Sin fecha de entrega"
    const dateFilterOptions = [
      { value: null, text: 'Todos los envíos' },
      { value: 'no_shipping_date', text: 'Sin fecha de envío' },
      { value: 'no_delivery_date', text: 'Sin fecha de entrega' }
    ];

    const pageOptions = ref([10, 20, 30]);

    const filteredShipments = computed(() => {
      return shipments.value.filter((shipment) => {
        if (dateFilter.value === 'no_shipping_date' && shipment.shipping_day) {
          return false;
        }
        if (dateFilter.value === 'no_delivery_date' && shipment.delivery_day) {
          return false;
        }
        return true;
      });
    });

    return {
      isSidebarOpen,
      toggleSidebar,
      fields,
      shipments,
      isModalOpen,
      selectedShipment,
      itemsPerPage,
      pageOptions,
      dateFilter,
      dateFilterOptions,
      openModal,
      updateShipment,
      filteredShipments
    };
  }
};
</script>

<style scoped>
.modern-card {
  border-radius: 15px;
}

.modern-table th, .modern-table td {
  text-align: center;
}

.filter-label {
  font-weight: bold;
}



h3 {
  font-size: 1.75rem;
  color: #333;
}

button {
  margin-right: 10px;
}
</style>
