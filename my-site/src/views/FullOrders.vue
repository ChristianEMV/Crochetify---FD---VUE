<template>
    <div>
      <Navbar @toggle-sidebar="toggleSidebar" />
      <Sidebar :isOpen="isSidebarOpen" />
      <div class="dashboard d-flex justify-content-center">
        <b-card class="shadow-lg rounded modern-card w-100">
          <div class="d-flex justify-content-between mb-3">
            <h3 class="text-center mb-4">Órdenes</h3>
            <b-form-select v-model="itemsPerPage" :options="pageOptions" class="w-auto" />
          </div>
  
          <!-- Tabla de órdenes -->
          <b-table :items="filteredOrders" :fields="fields" bordered hover responsive />
  
          <b-pagination
            v-model="currentPage"
            :total-rows="filteredOrders.length"
            :per-page="itemsPerPage"
            class="mt-3 justify-content-center"
          />
        </b-card>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from "vue";
  import Navbar from "@/components/Navbar.vue";
  import Sidebar from "@/components/Sidebar.vue";
  
  export default {
    name: "OrdersTable",
    components: { Navbar, Sidebar },
    setup() {
      const isSidebarOpen = ref(false);
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      const fields = [
        { key: "idOrden", label: "ID de Orden", sortable: true },
        { key: "status", label: "Estado", sortable: true },
        { key: "total", label: "Total", sortable: true },
        { key: "purchase_day", label: "Fecha de Compra", sortable: true }
      ];
  
      const orders = ref([
        {
          idOrden: "ORD001",
          status: true, // true: activa, false: inactiva
          total: 1250.50,
          purchase_day: "2024-11-01"
        },
        {
          idOrden: "ORD002",
          status: false,
          total: 500.00,
          purchase_day: "2024-11-02"
        }
      ]);
  
      const itemsPerPage = ref(10);
      const currentPage = ref(1);
  
      const pageOptions = ref([10, 20, 30]);
  
      const filteredOrders = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return orders.value.slice(start, end);
      });
  
      return {
        isSidebarOpen,
        toggleSidebar,
        fields,
        orders,
        itemsPerPage,
        currentPage,
        pageOptions,
        filteredOrders
      };
    }
  };
  </script>
  
  <style scoped>
  .modern-card {
    border-radius: 15px;
  }
  
  h3 {
    font-size: 1.75rem;
    color: #333;
  }
  
  button {
    margin-right: 10px;
  }
  </style>
  