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
    const isCreateShipmentModalVisible = ref(false); // Nombre consistente
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
        isCreateShipmentModalVisible.value = false; // Cambio en nombre
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
      isCreateShipmentModalVisible,
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
  