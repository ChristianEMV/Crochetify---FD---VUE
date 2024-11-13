<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />
    <div class="header" :class="{ 'header-collapsed': isSidebarOpen }">
      <div class="header-wrapper">
        <h3><i class="fas fa-layer-group"></i> Productos</h3>
        <h6>Gestión de los productos</h6>
      </div>
    </div>

    <div class="table-container">
      <h3 class="mb-4">Resumen de Productos</h3>
      <b-table :items="categories" :fields="fields" responsive striped hover small>
        <template #cell(nombre)="row">
          <b-button variant="link" class="text-primary" @click="showCategoryModal(row.item)">
            {{ row.item.nombre }}
          </b-button>
        </template>
        <template #cell(actions)="">
          <div class="d-flex justify-content-between">
            <b-button variant="warning" size="sm" class="mr-2">
              <i class="fas fa-edit"></i>
            </b-button>
            <b-button variant="danger" size="sm">
              <i class="fas fa-trash"></i>
            </b-button>
          </div>
        </template>
      </b-table>

      <b-button variant="outline-primary" class="btn-view-more mt-4" @click="goToFullCategoriesPage">
        Ver más
      </b-button>
    </div>

    <b-modal v-model="showModal" title="Información de la Categoría">
      <div>
        <p><strong>Nombre:</strong> {{ selectedCategory.nombre }}</p>
        <p><strong>Estado:</strong> {{ selectedCategory.state }}</p>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from 'vue-router';

export default defineComponent({
  name: "Products",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const showModal = ref(false);
    const selectedCategory = reactive({ nombre: '', state: '' });
    const router = useRouter(); 

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const showCategoryModal = (category: any) => {
      selectedCategory.nombre = category.nombre;
      selectedCategory.state = category.state;
      showModal.value = true;
    };

    const goToFullCategoriesPage = () => {
      router.push({ name: 'fullcategories' });
    };

    const categories = reactive([
      {
        id: 1,
        nombre: 'Lanas y Hilos',
        productos: 120,
        stockTotal: 500,
        precioPromedio: '$8.50',
        ventasTotales: 150,
        ingresos: '$1275.00',
        state: 'Activo',
        ultimaActualizacion: '2024-11-09',
      },
      {
        id: 2,
        nombre: 'Agujas',
        productos: 60,
        stockTotal: 300,
        precioPromedio: '$3.75',
        ventasTotales: 90,
        ingresos: '$337.50',
        state: 'Activo',
        ultimaActualizacion: '2024-11-08',
      },
      {
        id: 3,
        nombre: 'Patrones',
        productos: 45,
        stockTotal: 120,
        precioPromedio: '$12.00',
        ventasTotales: 30,
        ingresos: '$360.00',
        state: 'Inactivo',
        ultimaActualizacion: '2024-11-07',
      },
      {
        id: 4,
        nombre: 'Botones',
        productos: 80,
        stockTotal: 250,
        precioPromedio: '$2.50',
        ventasTotales: 110,
        ingresos: '$275.00',
        state: 'Activo',
        ultimaActualizacion: '2024-11-10',
      },
      {
        id: 5,
        nombre: 'Cintas',
        productos: 35,
        stockTotal: 90,
        precioPromedio: '$5.00',
        ventasTotales: 50,
        ingresos: '$250.00',
        state: 'Activo',
        ultimaActualizacion: '2024-11-06',
      }
    ]);

    const fields = [
      { key: 'id', label: 'ID' },
      { key: 'nombre', label: 'Nombre de Categoría' },
      { key: 'productos', label: 'Productos' },
      { key: 'stockTotal', label: 'Stock Total' },
      { key: 'precioPromedio', label: 'Precio Promedio' },
      { key: 'ventasTotales', label: 'Ventas Totales' },
      { key: 'ingresos', label: 'Ingresos Generados' },
      { key: 'state', label: 'State' },
      { key: 'ultimaActualizacion', label: 'Última Actualización' },
      { key: 'actions', label: 'Acciones' }
    ];

    return {
      isSidebarOpen,
      toggleSidebar,
      categories,
      fields,
      showModal,
      selectedCategory,
      showCategoryModal,
      goToFullCategoriesPage,
    };
  }
});
</script>

<style scoped>
.header {
  width: 100%;
  height: 25vh;
  background: linear-gradient(135deg, #30596B, #5EAED1);
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

.btn-view-more:hover {
  background-color: #007bff;
  color: white;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}
</style>
