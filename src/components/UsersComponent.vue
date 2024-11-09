<template>
    <div>

      <div class="header">
        <div class="header-wrapper">
          <h3><i class="fas fa-users"></i> Usuarios</h3>
        </div>
        <div class="container mt-2 bg-light">
          <div class="table-responsive">
            <table class="table table-striped table-hover table-sm">
              <thead>
                <tr>
                  <th class="text-muted small">ID</th>
                  <th class="text-muted small">
                    <select v-model="sortColumn" @change="sortTable" class="form-select form-select-sm">
                      <option value="" disabled>Nombre</option>
                      <option value="name-asc">Ordenar Nombre A-Z</option>
                      <option value="name-desc">Ordenar Nombre Z-A</option>
                    </select>
                  </th>
                  <th class="text-muted small">
                    <select v-model="sortColumn" @change="sortTable" class="form-select form-select-sm">
                      <option value="" disabled>Email</option>
                      <option value="email-asc">Ordenar Email A-Z</option>
                      <option value="email-desc">Ordenar Email Z-A</option>
                    </select>
                  </th>
                  <th class="text-muted small">
                    <select v-model="sortColumn" @change="sortTable" class="form-select form-select-sm">
                      <option value="" disabled>Teléfono</option>
                      <option value="phone-asc">Ordenar Teléfono 0-9</option>
                      <option value="phone-desc">Ordenar Teléfono 9-0</option>
                    </select>
                  </th>
                  <th class="text-muted small">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.phone }}</td>
                  <td>
                    <button
                      :class="['btn', user.status === 'bloqueado' ? 'btn-warning' : 'btn-danger', 'btn-sm']"
                      @click="toggleStatus(user.id)"
                    >
                      <i :class="user.status === 'bloqueado' ? 'fas fa-unlock' : 'fas fa-lock'"></i>
                      {{ user.status === 'bloqueado' ? 'Desbloquear' : 'Bloquear' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Paginación -->
          <nav aria-label="Page navigation">
            <ul class="pagination pagination-sm justify-content-center">
              <li
                v-for="page in totalPages"
                :key="page"
                :class="['page-item', { active: page === currentPage }]"
              >
                <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from "vue";
  import Navbar from "@/components/Navbar.vue";
  import Sidebar from "@/components/Sidebar.vue";
  
  export default {
    components: { Navbar, Sidebar },
    setup() {
      const users = ref(
        Array.from({ length: 100 }, (v, i) => ({
          id: i + 1,
          name: `Usuario ${i + 1}`,
          email: `usuario${i + 1}@ejemplo.com`,
          phone: `123-456-789${i % 10}`,
          status: i % 2 === 0 ? "bloqueado" : "desbloqueado",
        }))
      );
  
      const rowsPerPage = ref(10);
      const currentPage = ref(1);
      const sortColumn = ref("");
      
      // Computed for sorted and paginated users
      const sortedUsers = computed(() => {
        if (!sortColumn.value) return users.value;
        const [column, order] = sortColumn.value.split("-");
        return [...users.value].sort((a, b) =>
          order === "asc" ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column])
        );
      });
  
      const paginatedUsers = computed(() => {
        const start = (currentPage.value - 1) * rowsPerPage.value;
        return sortedUsers.value.slice(start, start + rowsPerPage.value);
      });
  
      const totalPages = computed(() =>
        Math.ceil(users.value.length / rowsPerPage.value)
      );
  
      function sortTable() {
        currentPage.value = 1;
      }
  
      function toggleStatus(userId) {
        const user = users.value.find((user) => user.id === userId);
        if (user) user.status = user.status === "bloqueado" ? "desbloqueado" : "bloqueado";
      }
  
      function goToPage(page) {
        currentPage.value = page;
      }
  
      onMounted(() => {
        sortTable();
      });
  
      return {
        users,
        currentPage,
        paginatedUsers,
        totalPages,
        sortColumn,
        toggleStatus,
        goToPage,
        sortTable,
      };
    },
  };
  </script>
  
  <style scoped>
  .header {
    width: 100%;
    height: 25vh;
    background: linear-gradient(135deg, #30596B, #5EAED1);
    color: white;
    padding: 20px;
  }
  .btn{
    width: 7.5rem;
  }
  </style>
  