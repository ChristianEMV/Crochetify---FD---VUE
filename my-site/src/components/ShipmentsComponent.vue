<template>
  <div>
    <!-- Encabezado y tarjetas permanecen sin cambios -->
    <div class="header">
      <div class="header-wrapper">
        <h3><i class="fas fa-truck"></i> Envíos</h3>
        <h6>Gestión de envíos</h6>
      </div>
    </div>


  <div class="table-container text-center">
    <h3>Envíos</h3>

    <!-- Tabla de envíos con columna Detalles -->
    <div class="container mt-2 bg-light d-flex justify-content-center">
      <div class="table-responsive w-100" style="max-width: 1200px;">
        <b-table
          striped
          hover
          small
          :items="paginatedShipments"
          :fields="[
            { key: 'id', label: 'ID Pedido', sortable: true, class: 'text-muted small' },
            { key: 'shippingDate', label: 'Fecha Envío', sortable: true, class: 'text-muted small' },
            { key: 'deliveryDate', label: 'Fecha Entrega', sortable: true, class: 'text-muted small' },
            { key: 'confirmation', label: 'Confirmación', sortable: true, class: 'text-muted small' },
            { key: 'details', label: 'Detalles', class: 'text-muted small' }
          ]"
          @sort-changed="onSortChanged"
        >
          <template #cell(details)="data">
            <button class="btn btn-primary btn-sm" @click="openModal(data.item)">
              Ver Detalles
            </button>
          </template>
        </b-table>
      </div>
    </div>

    <!-- Paginación -->
    <nav aria-label="Page navigation">
      <ul class="pagination pagination-sm justify-content-center">
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: page === currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
      </ul>
    </nav>

    <!-- Modal de detalles del envío -->
    <b-modal v-if="selectedShipment" v-model="isModalOpen" title="Detalles del Envío" hide-footer>
      <div v-if="selectedShipment">
        <p><strong>ID del envío:</strong> {{ selectedShipment.id }}</p>
        
        <!-- Inputs de fecha de envío y fecha de entrega -->
        <div class="form-group">
          <label for="shippingDate"><strong>Fecha de envío:</strong></label>
          <input
            id="shippingDate"
            type="date"
            v-model="selectedShipment.shippingDate"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="deliveryDate"><strong>Fecha de entrega:</strong></label>
          <input
            id="deliveryDate"
            type="date"
            v-model="selectedShipment.deliveryDate"
            class="form-control"
          />
        </div>

        <p><strong>Confirmación:</strong> {{ selectedShipment.confirmation }}</p>

        <p><strong>Productos:</strong></p>
        <ul>
          <li v-for="product in selectedShipment.products" :key="product.id">
            {{ product.name }} - Cantidad: {{ product.quantity }}
          </li>
        </ul>
      </div>
    </b-modal>
  </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

// Definimos la interfaz Shipment con los campos que necesitamos
interface Product {
  id: number;
  name: string;
  quantity: number;
}

interface Shipment {
  id: number;
  shippingDate: string;
  deliveryDate: string;
  confirmation: string;
  products: Product[];
}

export default defineComponent({
  name: "Dashboard",
  setup() {
    const shipments = ref<Shipment[]>(
      Array.from({ length: 100 }, (v, i) => ({
        id: i + 1,
        shippingDate: "",
        deliveryDate: "",
        confirmation: i % 2 === 0 ? "confirmado" : "sin confirmar",
        products: [
          { id: 1, name: "Producto A", quantity: 2 },
          { id: 2, name: "Producto B", quantity: 5 },
        ],
      }))
    );

    const rowsPerPage = ref(10);
    const currentPage = ref(1);
    const isModalOpen = ref(false);
    const selectedShipment = ref<Shipment | null>(null);
    const sortBy = ref<string | null>(null); // Campo por el cual se ordenará
    const sortDesc = ref(false); // Dirección de la ordenación (ascendente o descendente)

    // Función para ordenar los envíos
    const sortedShipments = computed(() => {
      let sorted = [...shipments.value];
      if (sortBy.value) {
        sorted.sort((a, b) => {
          const valA = a[sortBy.value as keyof Shipment];
          const valB = b[sortBy.value as keyof Shipment];
          if (valA < valB) return sortDesc.value ? 1 : -1;
          if (valA > valB) return sortDesc.value ? -1 : 1;
          return 0;
        });
      }
      return sorted;
    });

    // Función para aplicar la paginación
    const paginatedShipments = computed(() => {
      const start = (currentPage.value - 1) * rowsPerPage.value;
      return sortedShipments.value.slice(start, start + rowsPerPage.value);
    });

    const totalPages = computed(() => {
      return Math.ceil(sortedShipments.value.length / rowsPerPage.value);
    });

    const goToPage = (page: number) => {
      currentPage.value = page;
    };

    const openModal = (shipment: Shipment) => {
      selectedShipment.value = shipment;
      isModalOpen.value = true;
    };

    // Función para manejar el cambio de orden
    const onSortChanged = ({ field, isDescending }: { field: string; isDescending: boolean }) => {
      sortBy.value = field;
      sortDesc.value = isDescending;
    };

    return {
      shipments,
      rowsPerPage,
      currentPage,
      paginatedShipments,
      totalPages,
      goToPage,
      isModalOpen,
      selectedShipment,
      openModal,
      onSortChanged,
    };
  },
});
</script>

  
  <style scoped>

.header {
  width: 100%;
  height: 25vh;
  background: linear-gradient(135deg, #30596B, #5EAED1);
  color: white;
  padding: 20px;
}
.btn {
  width: 7.5rem;
}

.table-container {
  width: 98%;
  margin: 20px auto;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.table-container {
  text-align: center;
}

.table-responsive {
  max-width: 100%;
  margin: 0 auto;
}

.pagination {
  justify-content: center;
}

.form-group {
  margin-bottom: 1rem;
}

.w-100 {
  width: 100%;
}

@media (max-width: 768px) {
  .table-responsive {
    max-width: 100%;
  }
}
  </style>
  
