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
      <b-table :items="orders" :fields="fields" responsive striped hover small>
        <template #cell(idOrden)="row">
          <b-button
            variant="link"
            class="text-primary"
            @click="showOrderModal(row.item)"
          >
            {{ row.item.idOrden }}
          </b-button>
        </template>
        <template #cell(status)="row">
          <span>{{ row.item.status ? "Activa" : "Inactiva" }}</span>
        </template>
      </b-table>

      <b-button @click="showCreateShipmentModal" variant="primary" class="mt-4">
        Crear Envío
      </b-button>
    </div>

    <!-- Modal para ver detalles de la orden -->
    <b-modal v-model="showModal" title="Información de la Orden">
      <div>
        <p><strong>ID de Orden:</strong> {{ selectedOrder.idOrden }}</p>
        <p><strong>Estado:</strong> {{ selectedOrder.status ? "Activa" : "Inactiva" }}</p>
        <p><strong>Total:</strong> ${{ selectedOrder.total }}</p>
        <p><strong>Fecha de Compra:</strong> {{ selectedOrder.purchase_day }}</p>
      </div>
    </b-modal>

    <!-- Modal para crear un nuevo envío -->
    <b-modal v-model="showCreateShipmentModal" title="Crear Nuevo Envío">
      <b-form @submit.prevent="createShipment">
        <b-form-group label="Fecha de Envío:" label-for="shipping-day">
          <b-form-input
            id="shipping-day"
            v-model="newShipment.shipping_day"
            type="date"
            required
          />
        </b-form-group>
        <b-form-group label="ID de Orden:" label-for="order-id">
          <b-form-input
            id="order-id"
            v-model="newShipment.idOrden"
            type="number"
            required
          />
        </b-form-group>
        <div class="text-right">
          <b-button type="submit" variant="success">Crear</b-button>
          <b-button variant="secondary" @click="showCreateShipmentModal = false">
            Cancelar
          </b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from "vue-router";
import { apiOrden } from "../http-common";
import { apiShipments } from "../http-common";

export default defineComponent({
  name: "Orders",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const showModal = ref(false);
    const isCreateShipmentModalVisible = ref(false); // Cambié el nombre
    const alert = reactive({ show: false, message: "", type: "success" });
    const selectedOrder = reactive({
      idOrden: "",
      status: false,
      total: 0,
      purchase_day: "",
    });
    const newShipment = reactive({ shipping_day: "", idOrden: null });
    const orders = ref([]);
    const router = useRouter();

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const showOrderModal = (order: any) => {
      Object.assign(selectedOrder, order);
      showModal.value = true;
    };

    const showCreateShipmentModal = () => {
      newShipment.shipping_day = "";
      newShipment.idOrden = null;
      isCreateShipmentModalVisible.value = true;
    };

    const fetchOrders = async () => {
      try {
        const data = await apiOrden.getAllOrdenes();
        orders.value = Array.isArray(data.response.ordenes)
          ? data.response.ordenes
          : [];
      } catch (error) {
        console.error("Error al obtener órdenes:", error);
        alert.show = true;
        alert.message = "Error al cargar las órdenes.";
        alert.type = "danger";
      }
    };

    const createShipment = async () => {
      try {
        await apiShipments.createShipment({
          shipping_day: newShipment.shipping_day,
          idOrden: newShipment.idOrden!,
        });
        alert.show = true;
        alert.message = "Envío creado exitosamente.";
        alert.type = "success";
        isCreateShipmentModalVisible.value = false;
        fetchOrders(); // Recargar las órdenes
      } catch (error) {
        console.error("Error al crear el envío:", error);
        alert.show = true;
        alert.message = "Error al crear el envío.";
        alert.type = "danger";
      }
    };

    onMounted(fetchOrders);

    const fields = [
      { key: "idOrden", label: "ID de Orden" },
      { key: "status", label: "Estado" },
      { key: "total", label: "Total" },
      { key: "purchase_day", label: "Fecha de Compra" },
    ];

    return {
      isSidebarOpen,
      toggleSidebar,
      orders,
      fields,
      showModal,
      isCreateShipmentModalVisible, // Uso del nuevo nombre
      selectedOrder,
      alert,
      newShipment,
      showOrderModal,
      showCreateShipmentModal,
      createShipment,
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
  