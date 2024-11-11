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
  { id: 2, categoryName: 'Categoría 2', products: 8, stock: 50, avgPrice: 15, totalSales: 20, revenue: 300, state: 'Inactivo', lastUpdate: '2024-11-02' },
  { id: 3, categoryName: 'Categoría 3', products: 12, stock: 150, avgPrice: 25, totalSales: 10, revenue: 250, state: 'Activo', lastUpdate: '2024-10-30' },
  { id: 4, categoryName: 'Categoría 4', products: 5, stock: 20, avgPrice: 10, totalSales: 5, revenue: 50, state: 'Inactivo', lastUpdate: '2024-11-05' },
  { id: 5, categoryName: 'Categoría 5', products: 20, stock: 200, avgPrice: 30, totalSales: 25, revenue: 750, state: 'Activo', lastUpdate: '2024-11-03' },
  { id: 6, categoryName: 'Categoría 6', products: 7, stock: 35, avgPrice: 18, totalSales: 12, revenue: 216, state: 'Activo', lastUpdate: '2024-10-29' },
  { id: 7, categoryName: 'Categoría 7', products: 15, stock: 80, avgPrice: 22, totalSales: 18, revenue: 396, state: 'Activo', lastUpdate: '2024-11-07' },
  { id: 8, categoryName: 'Categoría 8', products: 9, stock: 60, avgPrice: 19, totalSales: 14, revenue: 266, state: 'Inactivo', lastUpdate: '2024-11-04' },
  { id: 9, categoryName: 'Categoría 9', products: 6, stock: 40, avgPrice: 12, totalSales: 9, revenue: 108, state: 'Activo', lastUpdate: '2024-11-06' },
  { id: 10, categoryName: 'Categoría 10', products: 18, stock: 130, avgPrice: 28, totalSales: 20, revenue: 560, state: 'Activo', lastUpdate: '2024-11-08' },
  // Registros adicionales
  { id: 11, categoryName: 'Categoría 11', products: 8, stock: 45, avgPrice: 14, totalSales: 10, revenue: 140, state: 'Activo', lastUpdate: '2024-11-02' },
  { id: 12, categoryName: 'Categoría 12', products: 14, stock: 90, avgPrice: 21, totalSales: 17, revenue: 357, state: 'Inactivo', lastUpdate: '2024-11-01' },
  { id: 13, categoryName: 'Categoría 13', products: 4, stock: 15, avgPrice: 8, totalSales: 5, revenue: 40, state: 'Activo', lastUpdate: '2024-11-04' },
  { id: 14, categoryName: 'Categoría 14', products: 22, stock: 110, avgPrice: 35, totalSales: 30, revenue: 1050, state: 'Activo', lastUpdate: '2024-10-28' },
  { id: 15, categoryName: 'Categoría 15', products: 11, stock: 70, avgPrice: 16, totalSales: 13, revenue: 208, state: 'Activo', lastUpdate: '2024-11-09' },
  { id: 16, categoryName: 'Categoría 16', products: 5, stock: 25, avgPrice: 11, totalSales: 7, revenue: 77, state: 'Inactivo', lastUpdate: '2024-11-06' },
  { id: 17, categoryName: 'Categoría 17', products: 17, stock: 95, avgPrice: 24, totalSales: 22, revenue: 528, state: 'Activo', lastUpdate: '2024-11-05' },
  { id: 18, categoryName: 'Categoría 18', products: 20, stock: 150, avgPrice: 29, totalSales: 27, revenue: 783, state: 'Activo', lastUpdate: '2024-10-31' },
  { id: 19, categoryName: 'Categoría 19', products: 9, stock: 55, avgPrice: 18, totalSales: 15, revenue: 270, state: 'Inactivo', lastUpdate: '2024-11-03' },
  { id: 20, categoryName: 'Categoría 20', products: 13, stock: 85, avgPrice: 20, totalSales: 16, revenue: 320, state: 'Activo', lastUpdate: '2024-11-04' },
  { id: 21, categoryName: 'Categoría 21', products: 6, stock: 30, avgPrice: 12, totalSales: 8, revenue: 96, state: 'Activo', lastUpdate: '2024-10-30' },
  { id: 22, categoryName: 'Categoría 22', products: 16, stock: 100, avgPrice: 26, totalSales: 19, revenue: 494, state: 'Activo', lastUpdate: '2024-11-08' },
  { id: 23, categoryName: 'Categoría 23', products: 3, stock: 10, avgPrice: 7, totalSales: 4, revenue: 28, state: 'Inactivo', lastUpdate: '2024-11-05' },
  { id: 24, categoryName: 'Categoría 24', products: 19, stock: 120, avgPrice: 33, totalSales: 24, revenue: 792, state: 'Activo', lastUpdate: '2024-11-03' },
  { id: 25, categoryName: 'Categoría 25', products: 7, stock: 40, avgPrice: 15, totalSales: 11, revenue: 165, state: 'Activo', lastUpdate: '2024-11-06' },
  { id: 26, categoryName: 'Categoría 26', products: 10, stock: 65, avgPrice: 19, totalSales: 14, revenue: 266, state: 'Inactivo', lastUpdate: '2024-11-02' },
  { id: 27, categoryName: 'Categoría 27', products: 18, stock: 130, avgPrice: 27, totalSales: 20, revenue: 540, state: 'Activo', lastUpdate: '2024-11-01' },
  { id: 28, categoryName: 'Categoría 28', products: 11, stock: 60, avgPrice: 17, totalSales: 9, revenue: 153, state: 'Activo', lastUpdate: '2024-11-08' },
  { id: 29, categoryName: 'Categoría 29', products: 14, stock: 95, avgPrice: 23, totalSales: 21, revenue: 483, state: 'Activo', lastUpdate: '2024-11-07' },
  { id: 30, categoryName: 'Categoría 30', products: 4, stock: 15, avgPrice: 9, totalSales: 6, revenue: 54, state: 'Inactivo', lastUpdate: '2024-11-05' },
  { id: 31, categoryName: 'Categoría 31', products: 12, stock: 75, avgPrice: 20, totalSales: 14, revenue: 280, state: 'Activo', lastUpdate: '2024-10-29' },
  { id: 32, categoryName: 'Categoría 32', products: 22, stock: 150, avgPrice: 32, totalSales: 26, revenue: 832, state: 'Activo', lastUpdate: '2024-11-06' },
  { id: 33, categoryName: 'Categoría 33', products: 8, stock: 45, avgPrice: 14, totalSales: 10, revenue: 140, state: 'Inactivo', lastUpdate: '2024-11-03' },
  { id: 34, categoryName: 'Categoría 34', products: 5, stock: 20, avgPrice: 11, totalSales: 7, revenue: 77, state: 'Activo', lastUpdate: '2024-11-01' },
  { id: 35, categoryName: 'Categoría 35', products: 17, stock: 100, avgPrice: 24, totalSales: 22, revenue: 528, state: 'Activo', lastUpdate: '2024-11-04' },
  { id: 36, categoryName: 'Categoría 36', products: 20, stock: 160, avgPrice: 29, totalSales: 28, revenue: 812, state: 'Activo', lastUpdate: '2024-11-02' },
  { id: 37, categoryName: 'Categoría 37', products: 9, stock: 50, avgPrice: 18, totalSales: 12, revenue: 216, state: 'Inactivo', lastUpdate: '2024-10-31' },
  { id: 38, categoryName: 'Categoría 38', products: 13, stock: 85, avgPrice: 21, totalSales: 17, revenue: 357, state: 'Activo', lastUpdate: '2024-10-30' },
  { id: 39, categoryName: 'Categoría 39', products: 7, stock: 35, avgPrice: 16, totalSales: 11, revenue: 176, state: 'Activo', lastUpdate: '2024-11-09' },
  { id: 40, categoryName: 'Categoría 40', products: 15, stock: 80, avgPrice: 22, totalSales: 18, revenue: 396, state: 'Activo', lastUpdate: '2024-11-08' }
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
