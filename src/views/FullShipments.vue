<template>
    <div>
      <Navbar @toggle-sidebar="toggleSidebar" />
      <Sidebar :isOpen="isSidebarOpen" />
      
      <!-- Tabla de envíos -->
      <b-table :items="shipments" :fields="fields" bordered hover responsive>
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
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import Navbar from "../components/Navbar.vue";
  import Sidebar from "../components/Sidebar.vue";
  
  export default {
    name: 'ShipmentsTable',
    components: { Navbar, Sidebar },
    setup() {
      const fields = [
        { key: 'idShipment', label: 'ID de Envío' },
        { key: 'status', label: 'Estado' },
        { key: 'shipping_day', label: 'Fecha de Envío' },
        { key: 'delivery_day', label: 'Fecha de Entrega' },
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
          shipping_day: '2024-11-05',
          delivery_day: '2024-11-09',
          products: [
            { id: 'P3', name: 'Producto 3', quantity: 5 }
          ]
        }
      ]);
  
      const isModalOpen = ref(false);
      const selectedShipment = ref({});
  
      const openModal = (shipment) => {
        selectedShipment.value = shipment;
        isModalOpen.value = true;
      };
  
      const updateShipment = () => {
        // Lógica para actualizar los datos del envío
        console.log('Envío actualizado:', selectedShipment.value);
        // Cierra el modal después de actualizar
        isModalOpen.value = false;
      };
  
      return {
        fields,
        shipments,
        isModalOpen,
        selectedShipment,
        openModal,
        updateShipment
      };
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    padding: 20px;
  }
  
  .modern-card {
    max-width: 1200px;
  }
  
  .filter-label {
    font-weight: bold;
  }
  
  .modern-table {
    background-color: #fff;
  }
  </style>
  