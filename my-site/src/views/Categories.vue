<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" @update:isOpen="toggleSidebar" />
    <div class="header" :class="{ 'header-collapsed': isSidebarOpen }">
      <div class="header-wrapper">
        <h3><i class="fas fa-layer-group"></i> Categorías</h3>
        <h6>Gestión de las categorías</h6>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="alert.show"
        :class="`alert alert-${alert.type} alert-dismissible fade show`"
        role="alert"
      >
        <strong>{{ alert.type === 'success' ? '¡Éxito!' : '¡Error!' }}</strong>
        {{ alert.message }}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          @click="alert.show = false"
        ></button>
      </div>
    </transition>

    <div class="table-container">
      <h3 class="mb-4">Tabla de Categorías</h3>
      <div class="d-flex mb-3">
        <b-button variant="primary" @click="toggleCreateForm">
          <i class="fas fa-plus"></i> Agregar Categoría
        </b-button>
        <div class="search-input-container">
          <i class="fas fa-search search-icon"></i>
          <b-form-input
            v-model="searchQuery"
            placeholder="Buscar..."
            class="search-input"
          ></b-form-input>
        </div>
      </div>

      <transition name="fade">
        <div v-if="showCreateForm" class="mb-4 form-container">
          <b-form @submit.prevent="createCategory">
            <b-form-group label="Nombre de Categoría" label-for="category-name-input">
              <b-form-input
                id="category-name-input"
                v-model="newCategoryData.name"
                required
                placeholder="Introduce el nombre de la categoría"
              ></b-form-input>
            </b-form-group>
            <br />
            <div class="button-group">
              <b-button variant="danger" @click="toggleCreateForm">Cancelar</b-button>
              <b-button variant="success" type="submit">Guardar</b-button>
            </div>
          </b-form>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="showEditForm" class="mb-4 form-container">
          <b-form @submit.prevent="updateCategoryName">
            <b-form-group label="ID de la Categoría:">
              <p>{{ editCategoryData.id }}</p>
            </b-form-group>
            <b-form-group label="Nuevo Nombre de la Categoría" label-for="edit-category-name-input">
              <b-form-input
                id="edit-category-name-input"
                v-model="editCategoryData.name"
                required
                placeholder="Introduce el nuevo nombre"
              ></b-form-input>
            </b-form-group>
            <br />
            <div class="button-group">
              <b-button variant="danger" @click="toggleEditForm">Cancelar</b-button>
              <b-button variant="success" type="submit">Guardar Cambios</b-button>
            </div>
          </b-form>
        </div>
      </transition>

      <div v-if="isLoading" class="spinner-container">
        <b-spinner class="custom-spinner" label="Loading..."></b-spinner>
      </div>

      <b-table v-else :items="paginatedCategories" :fields="fields" responsive striped hover small>
        <template #cell(id)="row">
          <span>{{ row.item.id }}</span>
        </template>
        <template #cell(name)="row">
          <span>{{ row.item.name }}</span>
        </template>
        <template #cell(actions)="row">
          <div class="d-flex justify-content-between">
            <b-button
              variant="warning"
              size="sm"
              class="mr-2"
              @click="openEditForm(row.item)"
            >
              <i class="fas fa-edit"></i>
              Editar Categoría
            </b-button>
          </div>
        </template>
      </b-table>
      <b-pagination
        v-model="currentPage"
        :total-rows="filteredCategories.length"
        :per-page="itemsPerPage"
        aria-controls="category-table"
        class="mt-3 justify-content-center"
      ></b-pagination>
    </div>

    <b-modal v-model="showCategoryModal" title="Detalles de la Categoría" hide-footer>
      <div v-if="selectedCategory">
        <p><strong>ID:</strong> {{ selectedCategory.id }}</p>
        <p><strong>Nombre:</strong> {{ selectedCategory.name }}</p>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { categoryApi } from "../http-common";

export default defineComponent({
  name: "categories",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const showCreateForm = ref(false);
    const showEditForm = ref(false);
    const isLoading = ref(true);
    const alert = reactive({ show: false, message: "", type: "success" });
    const newCategoryData = reactive({ name: "" });
    const editCategoryData = reactive({ id: 0, name: "" });
    const categories = ref([]);
    const searchQuery = ref("");
    const showCategoryModal = ref(false);
    const selectedCategory = ref<{ id: number; name: string } | null>(null);
    const currentPage = ref(1); // Página actual
    const itemsPerPage = ref(10); // Elementos por página

    const paginatedCategories = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredCategories.value.slice(start, end);
    });

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const toggleCreateForm = () => {
      showCreateForm.value = !showCreateForm.value;
      newCategoryData.name = "";
    };

    const toggleEditForm = () => {
      showEditForm.value = !showEditForm.value;
      editCategoryData.id = 0;
      editCategoryData.name = "";
    };

    const createCategory = async () => {
      try {
        await categoryApi.createCategory({ name: newCategoryData.name });
        await fetchCategories();
        showAlert("Categoría creada con éxito", "success");
        showCreateForm.value = false;
      } catch (error) {
        showAlert("Error al crear la categoría", "danger");
        console.error("Error al crear la categoría:", error);
      }
    };

    const openEditForm = (category: any) => {
      editCategoryData.id = category.id;
      editCategoryData.name = category.name;
      showEditForm.value = true;
    };

    const updateCategoryName = async () => {
  try {
    await categoryApi.updateCategoryName(editCategoryData.id, editCategoryData.name);
    await fetchCategories();
    showAlert("Nombre de la categoría actualizado con éxito", "success");
    showEditForm.value = false;
  } catch (error) {
    showAlert("Error al actualizar el nombre de la categoría", "danger");
    console.error("Error al actualizar el nombre de la categoría:", error);
  }
};


    const fetchCategories = async () => {
      try {
        isLoading.value = true;
        const data = await categoryApi.getAllCategories();
        categories.value = data.response.categories.map((cat: any) => ({
          id: cat.idCategory,
          name: cat.name
        }));
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
        categories.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchCategories();
    });

    const fields = [
      { key: "id", label: "ID", sortable: true },
      { key: "name", label: "Nombre de Categoría", sortable: true },
      { key: "actions", label: "Acciones" }
    ];

    const filteredCategories = computed(() => {
      return categories.value.filter((category: { id: number; name: string }) => {
        return (
          category.id.toString().includes(searchQuery.value) ||
          category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      });
    });

    const showAlert = (message: string, type: string) => {
      alert.message = message;
      alert.type = type;
      alert.show = true;
      setTimeout(() => {
        alert.show = false;
      }, 5000);
    };

    return {
      isSidebarOpen,
      toggleSidebar,
      categories,
      fields,
      showCreateForm,
      showEditForm,
      newCategoryData,
      editCategoryData,
      alert,
      toggleCreateForm,
      toggleEditForm,
      createCategory,
      openEditForm,
      updateCategoryName,
      fetchCategories,
      isLoading,
      showCategoryModal,
      selectedCategory,
      searchQuery,
      filteredCategories,
      paginatedCategories,
      currentPage,
      itemsPerPage
    };
  }
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

.category-name {
  cursor: pointer;
  color: #007bff;
}

</style>
