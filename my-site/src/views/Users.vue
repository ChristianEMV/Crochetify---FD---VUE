<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />
    <div class="header" :class="{ 'header-collapsed': isSidebarOpen }">
      <div class="header-wrapper">
        <h3><i class="fas fa-layer-user"></i> Usuarios</h3>
        <h6>Gestión de los usuarios</h6>
      </div>
    </div>

    <transition name="fade">
      <b-alert v-if="alert.show" :variant="alert.type" dismissible @dismissed="alert.show = false" class="alert-bottom-left">
        {{ alert.message }}
      </b-alert>
    </transition>

    <div class="table-container">
      <h3 class="mb-4">Resumen de Usuarios</h3>

      <div v-if="isLoading" class="spinner-container">
        <b-spinner class="custom-spinner" label="Loading..."></b-spinner>
      </div>

      <!-- La tabla -->
      <b-table v-else :items="users" :fields="fields" responsive striped hover small>
        <template #cell(idUser)="row">
          <span>{{ row.item.idUser }}</span>
        </template>
        <template #cell(name)="row">
          <span>{{ row.item.name }}</span>
        </template>
        <template #cell(email)="row">
          <span>{{ row.item.email }}</span>
        </template>
        <template #cell(status)="row">
          <span>{{ row.item.status ? 'Habilitada' : 'Deshabilitada' }}</span>
        </template>
        <template #cell(actions)="row">
          <div class="d-flex justify-content-between">
            <b-button
              size="sm"
              :variant="row.item.status ? 'danger' : 'warning'"
              @click="toggleStatus(row.item)"
            >
            <span>{{ row.item.status ? 'Deshabilitada' : 'Habilitada' }}</span>
            </b-button>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from "vue-router";
import {userApi} from "../http-common";


export default defineComponent({
  name: "Users",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const isLoading = ref(true);
    const alert = reactive({ show: false, message: "", type: "success" });
    const users = ref([]);
    const router = useRouter();

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const goToFullUsersPage = () => {
      router.push({ name: "fullusers" });
    };

    // Función para obtener los usuarios
    const fetchUsers = async () => {
      try {
        const data = await userApi.getAllUsers();
        console.log("Datos recibidos:", data);
        users.value = Array.isArray(data.response.users) ? data.response.users : [];
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
        alert.show = true;
        alert.message = "Error al cargar los usuarios.";
        alert.type = "danger";
        users.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(fetchUsers);

    // Función para cambiar el estado del usuario
    const toggleStatus = async (user: any) => {
      if (!user.idUser) {
        alert.message = "El ID del usuario no está disponible.";
        alert.type = "danger";
        alert.show = true;
        return;
      }

      try {
        const newStatus = !user.status;
        const response = await userApi.updateUserStatus(user.idUser, newStatus);
        if (response && response.success) {
          user.status = newStatus; // Actualizar el estado localmente
          alert.message = "Estado del usuario actualizado con éxito";
          alert.type = "success";
        } else {
          throw new Error("La respuesta de la API no es la esperada");
        }
      } catch (error) {
        console.error("Error al actualizar el estado:", error);
        alert.message = "Error al actualizar el estado del usuario";
        alert.type = "danger";
      } finally {
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);
      }
    };

    const fields = [
      { key: "idUser", label: "ID", sortable:true },
      { key: "name", label: "Nombre", sortable:true },
      { key: "email", label: "Email", sortable:true },
      { key: "status", label: "Estado", sortable:true },
      { key: "actions", label: "Acciones" },
    ];

    return {
      isSidebarOpen,
      toggleSidebar,
      users,
      fields,
      isLoading,
      alert,
      toggleStatus,
      goToFullUsersPage,
    };
  },
});
</script>


<style scoped>
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

.btn-view-more {
  background-color: #007bff;
  color: white;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.custom-spinner {
  width: 3rem;
  height: 3rem;
  border-width: 0.3rem;
  color: #007bff;
}

.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.alert-bottom-left {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1050;
}
.btn{
  width: 7.5rem;
}
</style>