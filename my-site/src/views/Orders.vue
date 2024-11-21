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
        <b-table
          :items="orders"
          :fields="fields"
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
        </b-table>
  
        <b-button
          variant="outline-primary"
          class="btn-view-more mt-4"
          @click="goToFullOrdersPage"
        >
          Ver más
        </b-button>
      </div>
  
      <!-- Modal para ver detalles de la orden -->
      <b-modal v-model="showModal" title="Información de la Orden">
        <div>
          <p><strong>ID de Orden:</strong> {{ selectedOrder.idOrden }}</p>
          <p><strong>Status:</strong> {{ selectedOrder.status ? 'Activa' : 'Inactiva' }}</p>
          <p><strong>Total:</strong> ${{ selectedOrder.total }}</p>
          <p><strong>Fecha de Compra:</strong> {{ selectedOrder.purchase_day }}</p>
        </div>
      </b-modal>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from "vue";
  import Navbar from "../components/Navbar.vue";
  import Sidebar from "../components/Sidebar.vue";
  import { useRouter } from "vue-router";
  
  export default defineComponent({
    name: "orders",
    components: { Navbar, Sidebar },
    setup() {
      const isSidebarOpen = ref(false);
      const showModal = ref(false);
      const alert = reactive({ show: false, message: "", type: "success" });
      const selectedOrder = reactive({ idOrden: "", status: false, total: 0, purchase_day: "" });
      const orders = ref([]);
      const router = useRouter();
  
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      const showOrderModal = (order: any) => {
        Object.assign(selectedOrder, order);
        showModal.value = true;
      };
  
      const goToFullOrdersPage = () => {
        router.push({ name: "fullorders" });
      };
  
      const fields = [
        { key: "idOrden", label: "ID de Orden" },
        { key: "status", label: "Estado" },
        { key: "total", label: "Total" },
        { key: "purchase_day", label: "Fecha de Compra" }
      ];
  
      return {
        isSidebarOpen,
        toggleSidebar,
        orders,
        fields,
        showModal,
        selectedOrder,
        alert,
        showOrderModal,
        goToFullOrdersPage
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
  