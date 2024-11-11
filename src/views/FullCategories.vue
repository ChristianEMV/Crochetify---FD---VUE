<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />
    <div class="dashboard d-flex justify-content-center">
      <b-card class="shadow-lg rounded modern-card w-100">
        <div class="d-flex justify-content-between mb-3">
          <h3 class="text-center mb-4">Categorías</h3>

          <b-form-group label="Filtrar por rango de fechas:" class="filter-label d-flex align-items-center">
            <input type="date" v-model="startDate" @change="filterByDateRange" placeholder="Fecha inicio" class="me-2" />
            <input type="date" v-model="endDate" @change="filterByDateRange" placeholder="Fecha fin" />
          </b-form-group>

          <b-form-select v-model="itemsPerPage" :options="pageOptions" class="w-auto" />
        </div>


        <b-table
          :items="filteredItems"
          :fields="fields"
          :per-page="itemsPerPage"
          :current-page="currentPage"
          @sort-changed="sortChanged"
          bordered
          hover
          responsive
          class="modern-table"
        >
          <template #cell(actions)="data">
            <b-button size="sm" variant="outline-primary" @click="editItem(data.item)" class="me-2">
              <i class="fa fa-edit"></i>
            </b-button>
            <b-button size="sm" variant="outline-danger" @click="deleteItem(data.item)">
              <i class="fa fa-trash"></i>
            </b-button>
          </template>
        </b-table>

        <b-pagination
          v-model="currentPage"
          :total-rows="filteredItems.length"
          :per-page="itemsPerPage"
          class="mt-3 justify-content-center"
        />
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

export default defineComponent({
  name: "FullCategories",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const items = ref([
      { id: 1, categoryName: 'Categoría 1', products: 10, stock: 100, avgPrice: 20, totalSales: 15, revenue: 300, state: 'Activo', lastUpdate: '2024-11-01' },
     
    ]);

    const fields = ref([
      { key: "id", label: "ID" },
      { key: "categoryName", label: "Nombre de Categoría" },
      { key: "products", label: "Productos" },
      { key: "stock", label: "Stock Total" },
      { key: "avgPrice", label: "Precio promedio" },
      { key: "totalSales", label: "Ventas Totales" },
      { key: "revenue", label: "Ingresos generados" },
      { key: "state", label: "State" },
      { key: "lastUpdate", label: "Última Actualización" },
      { key: "actions", label: "Acciones" }
    ]);

    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const pageOptions = ref([10, 20, 30]);

    const startDate = ref<string | null>(null);
    const endDate = ref<string | null>(null);

    const filteredItems = computed(() => {
      if (startDate.value && endDate.value) {
        return items.value.filter(item => {
          return startDate.value && endDate.value && item.lastUpdate >= startDate.value && item.lastUpdate <= endDate.value;
        });
      }
      return items.value;
    });

    const filterByDateRange = () => {
      currentPage.value = 1;
    };

    const sortChanged = (ctx: { sortBy: string; sortDesc: boolean }) => {
      console.log(`Orden cambiado: ${ctx.sortBy} en orden ${ctx.sortDesc ? 'descendente' : 'ascendente'}`);
    };

    const editItem = (item: { id: number; categoryName: string; products: number; stock: number; avgPrice: number; totalSales: number; revenue: number; state: string; lastUpdate: string }) => {
      console.log('Editar:', item);
    };

    const deleteItem = (item: { id: number; categoryName: string; products: number; stock: number; avgPrice: number; totalSales: number; revenue: number; state: string; lastUpdate: string }) => {
      console.log('Eliminar:', item);
    };

    return {
      isSidebarOpen,
      toggleSidebar,
      items,
      fields,
      currentPage,
      itemsPerPage,
      pageOptions,
      startDate,
      endDate,
      filteredItems,
      filterByDateRange,
      sortChanged,
      editItem,
      deleteItem,
    };
  },
});
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

input[type="date"] {
  width: 150px;
  padding: 0.375rem 0.75rem;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

h3 {
  font-size: 1.75rem;
  color: #333;
}

button {
  margin-right: 10px;
}
</style>
