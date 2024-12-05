<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />

    <div class="header" :class="{ 'header-collapsed': isSidebarOpen }">
      <div class="header-wrapper">
        <h3><i class="fas fa-chart-line"></i> Dashboard</h3>
        <h6>Sales overview & summary</h6>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-sm-3" v-for="card in cards" :key="card.id">
        <div class="card custom-card">
          <div class="card-body">
            <div class="row">
              <div class="col-sm-8">
                <h1 :id="card.id">{{ card.value }}</h1>
                <h6 class="title">{{ card.title }}</h6>
                <p class="text">{{ card.description }}</p>
              </div>
              <div class="col-sm-4 d-flex align-items-center justify-content-center">
                <i :class="card.iconClass" class="card-icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Grafic />
    <div class="logout-container">
      <button @click="logout" class="btn btn-danger">Cerrar sesión</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import Grafic from "../components/Grafic.vue";
import { userApi, apiShipments, apiOrden } from "../http-common";
import authService from "../authService";

export default defineComponent({
  name: "Dashboard",
  components: { Navbar, Sidebar, Grafic },
  setup() {
    const isSidebarOpen = ref(false);
    const isLoading = ref(true);
    const totalUsers = ref(0);
    const shipments = ref([]);
    const pedidosUsuario = ref([]); 
    const pendingOrders = ref(0);
    const totalSelling = ref(0);
    const totalErnings = ref(0);
    const router = useRouter();
    
    const cards = ref([
      {
        id: "active-users",
        value: "0",
        title: "Usuarios Totales",
        description: "Usuarios totales registrados durante el mes",
        iconClass: "fas fa-users icon-circle-users",
      },
      {
        id: "total-selling",
        value: "0",
        title: "Ventas Totales",
        description: "Ventas totales realizadas durante el mes",
        iconClass: "fas fa-shopping-cart icon-circle-sells",
      },
      {
        id: "pending-orders",
        value: "0",
        title: "Pedidos en Curso",
        description: "Pedidos pendientes de envío",
        iconClass: "fas fa-box-open icon-circle-orders",
      },
      {
        id: "total-earnings",
        value: "$0",
        title: "Ganancias Totales",
        description: "Total de ganancias obtenidas en el mes",
        iconClass: "fas fa-dollar-sign icon-circle-earnings",
      },
    ]);
    
    const checkAuthentication = () => {
      if (!authService.isAuthenticated()) {
        router.push("/login"); 
      }
    };
    
    const fetchUsers = async () => {
      try {
        const data = await userApi.getAllUsers();
        totalUsers.value = Array.isArray(data.response.users)
          ? data.response.users.length
          : 0;
        cards.value[0].value = totalUsers.value.toString();
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };

    const fetchShipments = async () => {
      try {
        const data = await apiShipments.getAllShipments();
        shipments.value = Array.isArray(data.response.shipments)
          ? data.response.shipments
          : [];

        pendingOrders.value = shipments.value.filter(
          (item: any) => item.status === 1
        ).length;

        totalSelling.value = shipments.value.filter(
          (item: any) => item.status === 2
        ).length;

        cards.value[1].value = totalSelling.value.toString();
        cards.value[2].value = pendingOrders.value.toString();
      } catch (error) {
        console.error("Error al cargar los envíos:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const data = await apiOrden.getAllOrdenes();
        pedidosUsuario.value = Array.isArray(data.response.pedidosUsuario)
          ? data.response.pedidosUsuario
          : [];

        totalErnings.value = pedidosUsuario.value.reduce(
          (sum: number, item: any) => sum + (item.total || 0),
          0
        );
        cards.value[3].value = `$${totalErnings.value.toFixed(2)}`;
      } catch (error) {
        console.error("Error al cargar las órdenes:", error);
      }
    };

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const logout = () => {
      authService.logout();
      router.push("/login");
    };
    
    onMounted(() => {
      checkAuthentication();
      fetchUsers();
      fetchShipments();
      fetchOrders();
      isLoading.value = false;
    });

    return {
      isSidebarOpen,
      cards,
      toggleSidebar,
      isLoading,
      logout,
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
  transition: margin-left 0.3s;
}

.header-shift {
  margin-left: 250px;
}

.card {
  height: 200px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.header-collapsed {
  margin-left: 250px;
}

.card.custom-card {
  background: #f9f9f9;
  border: 0;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

h1, h6, p {
  margin: 0;
}

.card-body .row {
  flex: 1;
  display: flex;
  align-items: center;
}

.icon-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  border-radius: 50%;
  padding: 15px;
  color: #ffffff;
}

.icon-circle-users,
.icon-circle-sells,
.icon-circle-orders,
.icon-circle-earnings {
  color: #fff;
  background-color: #44B7AC;
  border-radius: 50%;
  padding: 10px;
  font-size: 2.5rem;
  transition: background-color 0.3s;
}

.icon-circle-sells {
  background-color: #768ABA;
}

.icon-circle-orders {
  background-color: #30596B;
}

.icon-circle-earnings {
  background-color: #66CE76;
}

.icon-circle-users:hover,
.icon-circle-sells:hover,
.icon-circle-orders:hover,
.icon-circle-earnings:hover {
  background-color: #5EAED1;
}

.card-icon {
  max-width: 100%;
  max-height: 55px;
  object-fit: contain;
}
.logout-container {
  position: absolute;
  top: 20px;
  right: 20px;
}

@media (max-width: 768px) {
  .card-body {
    flex-direction: row;
  }

  .card-body .row {
    flex-direction: column;
  }
}
</style>
