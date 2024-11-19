<template>
    <div>
      <Navbar @toggle-sidebar="toggleSidebar" />
      <Sidebar :isOpen="isSidebarOpen" />
      <div class="dashboard d-flex justify-content-center">
        <b-card class="shadow-lg rounded modern-card w-100">
          <div class="d-flex justify-content-between mb-3">
            <h3 class="text-center mb-4">Usuarios</h3>
  
            <b-form-group
              label="Filtrar por estado: "
              class="filter-label d-flex align-items-center"
            >
              <b-form-select v-model="statusFilter" :options="statusFilterOptions" class="w-auto" />
            </b-form-group>
  
            <b-form-select v-model="itemsPerPage" :options="pageOptions" class="w-auto" />
          </div>
  
          <b-table :items="filteredUsers" :fields="fields" bordered hover responsive>
  <template #cell(status)="data">
    <span>
      {{ data.item.status ? "Habilitado" : "Deshabilitado" }}
    </span>
  </template>
  <template #cell(actions)="data">
    <b-button
      size="sm"
      :variant="data.item.status ? 'danger' : 'warning'"
      @click="toggleStatus(data.item)"
    >
      {{ data.item.status ? "Deshabilitar" : "Habilitar" }}
    </b-button>
  </template>
</b-table>

  
          <b-pagination
            v-model="currentPage"
            :total-rows="filteredUsers.length"
            :per-page="itemsPerPage"
            class="mt-3 justify-content-center"
          />
        </b-card>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, reactive, computed, onMounted } from "vue";
  import Navbar from "../components/Navbar.vue";
  import Sidebar from "../components/Sidebar.vue";
  import { useRouter } from "vue-router";
  import { userApi } from "../http-common";
  
  interface User {
    idUser: string;
    name: string;
    email: string;
    status: boolean;
  }
  
  export default defineComponent({
    name: "UsersTable",
    components: { Navbar, Sidebar },
    setup() {
      const isSidebarOpen = ref(false);
      const showModal = ref(false);
  
      const alert = reactive({ show: false, message: "", type: "success" });
      const selectedUser = reactive<User>({
        idUser: "",
        name: "",
        email: "",
        status: false,
      });
      const users = ref<User[]>([]);
      const statusFilter = ref<null | boolean>(null);
      const itemsPerPage = ref(10);
      const currentPage = ref(1);
      const router = useRouter();
  
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      const showUserModal = (user: User) => {
        Object.assign(selectedUser, user);
        showModal.value = true;
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

  
      // Filtrar usuarios por estado
      const filteredUsers = computed(() => {
        return users.value.filter((user) =>
          statusFilter.value === null ? true : user.status === statusFilter.value
        );
      });
  
      const fields = [
        { key: "idUser", label: "ID de Usuario", sortable: true },
        { key: "name", label: "Nombre", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "status", label: "Estado", sortable: true },
        { key: "actions", label: "Acciones" },
      ];
  
      const statusFilterOptions = [
        { value: null, text: "Todos los usuarios" },
        { value: true, text: "Habilitados" },
        { value: false, text: "Deshabilitados" },
      ];
  
      const pageOptions = ref([10, 20, 30]);
  
      onMounted(() => {
        fetchUsers();
      });
  
      return {
        isSidebarOpen,
        toggleSidebar,
        users,
        fields,
        showModal,
        selectedUser,
        alert,
        showUserModal,
        goToFullUsersPage,
        toggleStatus,
        statusFilter,
        statusFilterOptions,
        itemsPerPage,
        pageOptions,
        currentPage,
        filteredUsers,
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



h3 {
  font-size: 1.75rem;
  color: #333;
}

button {
  margin-right: 10px;
}
.btn{
    width: 7.5rem;
}
</style>  