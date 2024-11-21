<template>
  <div>
    <div class="header">
      <div class="header-wrapper">
        <h3><i class="fas fa-users"></i> Usuarios</h3>
        <h6>Gestión de usuarios</h6>
      </div>
    </div>

    <div class="table-container">
      <h3>Usuarios</h3>

<b-table
  :items="users"
  :fields="fields"
  :per-page="rowsPerPage"
  :current-page="currentPage"
  @sort-changed="onSortChange"
  @filtered="onFiltered"
  small
  striped
  hover
  responsive="sm"
>
  <template #cell(actions)="row">
    <button
      :class="['btn', row.item.status === 'bloqueado' ? 'btn-warning' : 'btn-danger', 'btn-sm']"
      @click="toggleStatus(row.item.id)"
    >
      <i :class="row.item.status === 'bloqueado' ? 'fas fa-unlock' : 'fas fa-lock'"></i>
      {{ row.item.status === 'bloqueado' ? 'Desbloquear' : 'Bloquear' }}
    </button>
  </template>
</b-table>

<!-- Paginación -->
<b-pagination
  v-model="currentPage"
  :total-rows="totalRows"
  :per-page="rowsPerPage"
  align="center"
  size="sm"
></b-pagination>
    </div>
  

  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default {
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
    const totalRows = ref(users.value.length);

    const fields = [
      { key: "id", label: "ID" },
      { key: "name", label: "Nombre", sortable: true },
      { key: "email", label: "Email", sortable: true },
      { key: "phone", label: "Teléfono", sortable: true },
      { key: "actions", label: "Acciones" },
    ];

    function onSortChange({ sortBy, sortDesc }) {
      users.value.sort((a, b) => {
        if (a[sortBy] === undefined || b[sortBy] === undefined) return 0;
        return sortDesc
          ? String(b[sortBy]).localeCompare(String(a[sortBy]))
          : String(a[sortBy]).localeCompare(String(b[sortBy]));
      });
    }

    function onFiltered(filteredItems) {
      totalRows.value = filteredItems.length;
    }

    function toggleStatus(userId) {
      const user = users.value.find((user) => user.id === userId);
      if (user) {
        user.status = user.status === "bloqueado" ? "desbloqueado" : "bloqueado";
      }
    }

    return {
      users,
      rowsPerPage,
      currentPage,
      totalRows,
      fields,
      toggleStatus,
      onSortChange,
      onFiltered,
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
