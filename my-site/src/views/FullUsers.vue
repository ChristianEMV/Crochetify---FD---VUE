<template>
    <div>
      <Navbar @toggle-sidebar="toggleSidebar" />
      <Sidebar :isOpen="isSidebarOpen" />
      <div class="dashboard d-flex justify-content-center">
        <b-card class="shadow-lg rounded modern-card w-100">
          <div class="d-flex justify-content-between mb-3">
            <h3 class="text-center mb-4">Usuarios</h3>
  
            <b-form-group label="Filtrar por estado: " class="filter-label d-flex align-items-center">
              <b-form-select v-model="statusFilter" :options="statusFilterOptions" class="w-auto" @change="applyFilters" />
            </b-form-group>
  
            <b-form-select v-model="itemsPerPage" :options="pageOptions" class="w-auto" />
          </div>
  
          <!-- Tabla de usuarios -->
          <b-table :items="filteredUsers" :fields="fields" bordered hover responsive>
            <template #cell(acciones)="data">
              <b-button
                size="sm"
                :variant="data.item.status ? 'danger' : 'warning'"
                @click="toggleStatus(data.item)"
              >
                {{ data.item.status ? 'Bloquear' : 'Desbloquear' }}
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
  
  <script>
  import { ref, computed } from 'vue';
  import Navbar from '@/components/Navbar.vue';
  import Sidebar from '@/components/Sidebar.vue';
  
  export default {
    name: 'UsersTable',
    components: { Navbar, Sidebar },
    setup() {
      const isSidebarOpen = ref(false);
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      const fields = [
        { key: 'idUser', label: 'ID de Usuario', sortable: true },
        { key: 'name', label: 'Nombre', sortable: true },
        { key: 'email', label: 'Correo Electrónico', sortable: true },
        { key: 'status', label: 'Estado', sortable: true },
        { key: 'acciones', label: 'Acciones' }
      ];
  
      const users = ref([
        {
          idUser: 'U001',
          name: 'John Doe',
          email: 'john.doe@example.com',
          status: true, // true: desbloqueado, false: bloqueado
          image: 'https://via.placeholder.com/100'
        },
        {
          idUser: 'U002',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          status: false,
          image: 'https://via.placeholder.com/100'
        }
      ]);
  
      const statusFilter = ref(null);
      const itemsPerPage = ref(10);
  
      const toggleStatus = (user) => {
        user.status = !user.status;
        console.log(`Usuario ${user.idUser} actualizado a estado: ${user.status ? 'Desbloqueado' : 'Bloqueado'}`);
      };
  
      const statusFilterOptions = [
        { value: null, text: 'Todos los usuarios' },
        { value: true, text: 'Desbloqueados' },
        { value: false, text: 'Bloqueados' }
      ];
  
      const pageOptions = ref([10, 20, 30]);
  
      const filteredUsers = computed(() => {
        return users.value.filter((user) => {
          if (statusFilter.value === null) {
            return true;
          }
          return user.status === statusFilter.value;
        });
      });
  
      return {
        isSidebarOpen,
        toggleSidebar,
        fields,
        users,
        statusFilter,
        statusFilterOptions,
        itemsPerPage,
        pageOptions,
        filteredUsers,
        toggleStatus
      };
    }
  };
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