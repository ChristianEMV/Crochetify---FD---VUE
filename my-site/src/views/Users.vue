<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />
    <div class="header" :class="{ 'header-collapsed': isSidebarOpen }">
      <div class="header-wrapper">
        <h3><i class="fas fa-user"></i> Usuarios</h3>
        <h6>Gestión de usuarios</h6>
      </div>
    </div>

    <b-alert v-if="alert.show" :variant="alert.type" dismissible>
      {{ alert.message }}
    </b-alert>

    <div class="table-container">
      <h3 class="mb-4">Resumen de Usuarios</h3>
      <b-table
        :items="users"
        :fields="fields"
        responsive
        striped
        hover
        small
      >
        <template #cell(idUser)="row">
          <b-button
            variant="link"
            class="text-primary"
            @click="showUserModal(row.item)"
          >
            {{ row.item.idUser }}
          </b-button>
        </template>
        <template #cell(actions)="row">
          <div class="d-flex justify-content-between">
            <b-button
              variant="warning"
              size="sm"
              class="mr-2"
              @click="openEditModal(row.item)"
            >
              <i class="fas fa-edit"></i>
            </b-button>
            <b-button
              variant="danger"
              size="sm"
              @click="deleteUser(row.item.idUser)"
            >
              <i class="fas fa-trash"></i>
            </b-button>
          </div>
        </template>
      </b-table>

      <b-button
        variant="outline-primary"
        class="btn-view-more mt-4"
        @click="goToFullUsersPage"
      >
        Ver más
      </b-button>
    </div>

    <!-- Modal para ver detalles del usuario -->
    <b-modal v-model="showModal" title="Información del Usuario">
      <div>
        <p><strong>ID de Usuario:</strong> {{ selectedUser.idUser }}</p>
        <p><strong>Nombre:</strong> {{ selectedUser.name }}</p>
        <p><strong>Email:</strong> {{ selectedUser.email }}</p>
        <p><strong>Estado:</strong> {{ selectedUser.status ? 'Activo' : 'Inactivo' }}</p>
      </div>
    </b-modal>

    <!-- Modal para editar un usuario -->
    <b-modal v-model="showEditModal" title="Editar Usuario">
      <div>
        <b-form>
          <b-form-group label="ID de Usuario">
            <b-form-input v-model="editUserData.idUser" readonly></b-form-input>
          </b-form-group>
          <b-form-group label="Nombre">
            <b-form-input v-model="editUserData.name"></b-form-input>
          </b-form-group>
          <b-form-group label="Email">
            <b-form-input type="email" v-model="editUserData.email"></b-form-input>
          </b-form-group>
          <b-form-group label="Contraseña">
            <b-form-input type="password" v-model="editUserData.password"></b-form-input>
          </b-form-group>
          <b-form-group label="Estado">
            <b-form-select
              v-model="editUserData.status"
              :options="[true, false]"
            ></b-form-select>
          </b-form-group>
        </b-form>
      </div>
      <template #modal-footer>
        <b-button variant="success" @click="updateUser">Guardar Cambios</b-button>
        <b-button variant="danger" @click="showEditModal = false">Cancelar</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from "vue-router";
import { userApi } from "../http-common";

export default defineComponent({
  name: "users",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const showModal = ref(false);
    const showEditModal = ref(false);
    const alert = reactive({ show: false, message: "", type: "success" });
    const selectedUser = reactive({ idUser: "", name: "", email: "", password: "", status: false });
    const editUserData = reactive({ idUser: "", name: "", email: "", password: "", status: false });
    const users = ref([]);
    const router = useRouter();

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const showUserModal = (user: any) => {
      Object.assign(selectedUser, user);
      showModal.value = true;
    };

    const goToFullUsersPage = () => {
      router.push({ name: "fullusers" });
    };

    const openEditModal = (user: any) => {
      Object.assign(editUserData, user);
      showEditModal.value = true;
    };

    const updateUser = async () => {
      // Lógica para actualizar un usuario
      // ...
    };

    const deleteUser = async (id: string) => {
      // Lógica para eliminar un usuario
      // ...
    };

    const fetchUsers = async () => {
      // Lógica para obtener los usuarios
      // ...
    };

    onMounted(() => {
      fetchUsers();
    });

    const fields = [
      { key: "idUser", label: "ID de Usuario" },
      { key: "name", label: "Nombre" },
      { key: "email", label: "Email" },
      { key: "status", label: "Estado" },
      { key: "actions", label: "Acciones" }
    ];

    return {
      isSidebarOpen,
      toggleSidebar,
      users,
      fields,
      showModal,
      showEditModal,
      selectedUser,
      editUserData,
      alert,
      showUserModal,
      goToFullUsersPage,
      openEditModal,
      updateUser,
      deleteUser,
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

.b-table thead th {
  background-color: #f1f1f1;
  color: #333;
  font-weight: bold;
}

.b-table tbody tr:hover {
  background-color: #f7f7f7;
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
</style>
