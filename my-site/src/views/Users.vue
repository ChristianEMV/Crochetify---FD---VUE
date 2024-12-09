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

      <!-- Buscador -->
      <div class="d-flex mb-3">
        <div class="search-input-container">
          <i class="fas fa-search search-icon"></i>
          <b-form-input
            v-model="searchQuery"
            placeholder="Buscar usuarios..."
            class="search-input"
          ></b-form-input>
        </div>
      </div>

      <div v-if="isLoading" class="spinner-container">
        <b-spinner class="custom-spinner" label="Loading..."></b-spinner>
      </div>

      <!-- Tabla -->
      <b-table v-else :items="paginatedUsers" :fields="fields" responsive striped hover small>
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

      <!-- Paginador -->
      <b-pagination 
        v-model="currentPage" 
        :total-rows="filteredUsers.length" 
        :per-page="perPage" 
        align="center" 
        class="mt-3"
      ></b-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from "vue-router";
import { userApi } from "../http-common";

export default defineComponent({
  name: "Users",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const isLoading = ref(true);
    const alert = reactive({ show: false, message: "", type: "success" });
    const users = ref([]);
    const currentPage = ref(1); // Página actual
    const perPage = ref(10); // Usuarios por página
    const searchQuery = ref(""); // Texto del buscador
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
        users.value = Array.isArray(data.response.users)
          ? data.response.users.filter((user: any) => user.idUser !== 1)
          : [];
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
        users.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    // Filtrar usuarios según el texto del buscador
    const filteredUsers = computed(() => {
      return users.value.filter((user: any) => {
        return (
          user.idUser.toString().includes(searchQuery.value) ||
          user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      });
    });

    // Paginación de usuarios
    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * perPage.value;
      const end = start + perPage.value;
      return filteredUsers.value.slice(start, end);
    });

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
      { key: "idUser", label: "ID", sortable: true },
      { key: "name", label: "Nombre", sortable: true },
      { key: "email", label: "Email", sortable: true },
      { key: "status", label: "Estado", sortable: true },
      { key: "actions", label: "Acciones" },
    ];

    return {
      isSidebarOpen,
      toggleSidebar,
      users,
      filteredUsers,
      paginatedUsers,
      fields,
      isLoading,
      alert,
      toggleStatus,
      goToFullUsersPage,
      currentPage,
      perPage,
      searchQuery,
    };
  },
});
</script>


<style scoped>
.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input-container {
  position: relative;
  flex-grow: 1;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #aaa;
}

.search-input {
  padding-left: 30px;
  border-radius: 20px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #007bff;
  outline: none;
}

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
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.alert-bottom-left {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1050;
}

.color-box {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.stock-name {
  cursor: pointer;
  color: #007bff;
}

.stock-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 10px;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-container {
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
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

.image-preview {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.preview-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.drop-area {
  border: 2px dashed #007bff;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  color: #007bff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.drop-area:hover {
  background-color: #e9f5ff;
}

.b-form-group i {
  margin-right: 5px;
}
</style>