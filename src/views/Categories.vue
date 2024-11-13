<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />
    <div class="header" :class="{ 'header-collapsed': isSidebarOpen }">
      <div class="header-wrapper">
        <h3><i class="fas fa-layer-group"></i> Categorías</h3>
        <h6>Gestión de las categorías</h6>
      </div>
    </div>

    <b-alert v-if="alert.show" :variant="alert.type" dismissible>
  {{ alert.message }}
</b-alert>


    <div class="table-container">
      <h3 class="mb-4">Resumen de Categorías</h3>
      <b-table
        :items="categories"
        :fields="fields"
        responsive
        striped
        hover
        small
      >
        <template #cell(name)="row">
          <b-button
            variant="link"
            class="text-primary"
            @click="showCategoryModal(row.item)"
          >
            {{ row.item.name }}
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
              @click="deleteCategory(row.item.id)"
            >
              <i class="fas fa-trash"></i>
            </b-button>
          </div>
        </template>
      </b-table>

      <b-button
        variant="outline-primary"
        class="btn-view-more mt-4"
        @click="goToFullCategoriesPage"
      >
        Ver más
      </b-button>
    </div>

    <b-modal v-model="showModal" title="Información de la Categoría">
      <div>
        <p><strong>Nombre:</strong> {{ selectedCategory.name }}</p>
        <p><strong>Estado:</strong> {{ selectedCategory.status }}</p>
      </div>
    </b-modal>

    <b-modal v-model="showEditModal" title="Editar Categoría">
      <div>
        <b-form>
          <b-form-group label="Nombre de Categoría">
            <b-form-input v-model="editCategoryData.name"></b-form-input>
          </b-form-group>
          <b-form-group label="Estado de la Categoría">
            <b-form-select
              v-model="editCategoryData.status"
              :options="['Activo', 'Deshabilitada']"
            ></b-form-select>
          </b-form-group>
        </b-form>
      </div>
      <template #modal-footer>
        <b-button variant="success" @click="updateCategory"
          >Guardar Cambios</b-button
        >
        <b-button variant="danger" @click="showEditModal = false"
          >Cancelar</b-button
        >
      </template>
    </b-modal>

    <b-button
      class="floating-button"
      variant="primary"
      @click="showRegisterModal = true"
    >
      <i class="fas fa-plus"></i>
    </b-button>

    <b-modal v-model="showRegisterModal" title="Registrar Categoría">
      <div>
        <b-form>
          <b-form-group label="Nombre de Categoría">
            <b-form-input v-model="newCategory.name"></b-form-input>
          </b-form-group>
         
        </b-form>
      </div>
      <template #modal-footer>
        <b-button variant="success" @click="addCategory">Agregar</b-button>
        <b-button variant="danger" @click="showRegisterModal = false"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from "vue-router";
import { categoryApi } from "../http-common";

export default defineComponent({
  name: "categories",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const showModal = ref(false);
    const showRegisterModal = ref(false);
    const showEditModal = ref(false);
    const alert = reactive({ show: false, message: "", type: "success" });
    const selectedCategory = reactive({ name: "", status: "" });
    const editCategoryData = reactive({ id: 0, name: "", status: "Activo" });
    const newCategory = reactive({ name: "" });
    const categories = ref([]);
    const router = useRouter();

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const showCategoryModal = (category: any) => {
      selectedCategory.name = category.name;
      selectedCategory.status = category.status;
      showModal.value = true;
    };

    const goToFullCategoriesPage = () => {
      router.push({ name: "fullcategories" });
    };

    const addCategory = async () => {
      try {
        if (newCategory.name.trim() === "") {
          alert.message = "El nombre de la categoría no puede estar vacío";
          alert.type = "danger";
          alert.show = true;
          return;
        }

        await categoryApi.createCategory({ name: newCategory.name });
        await fetchCategories();
        alert.message = "Categoría agregada con éxito";
        alert.type = "success";
        alert.show = true;
        newCategory.name = ""; // Limpiar el campo de nombre
        showRegisterModal.value = false;
      } catch (error) {
        alert.message = "Error al agregar la categoría";
        alert.type = "danger";
        alert.show = true;
        console.error("Error al agregar la categoría:", error);
      }
    };
    const openEditModal = (category: any) => {
      editCategoryData.id = category.id;
      editCategoryData.name = category.name;
      editCategoryData.status = category.status;
      showEditModal.value = true;
    };

    const updateCategory = async () => {
  try {
    await categoryApi.updateCategory(editCategoryData.id, {
      name: editCategoryData.name,
      status: editCategoryData.status,
    });
    await fetchCategories();
    alert.message = "Categoría actualizada con éxito";
    alert.type = "success";
    alert.show = true;
    showEditModal.value = false;
  } catch (error) {
    alert.message = "Error al actualizar la categoría";
    alert.type = "danger";
    alert.show = true;
    console.error("Error al actualizar la categoría:", error);
  }
};


    const deleteCategory = async (id: number) => {
      try {
        await categoryApi.deleteCategory(id);
        await fetchCategories();
        alert.message = "Categoría eliminada con éxito";
        alert.type = "success";
        alert.show = true;
      } catch (error) {
        alert.message = "Error al eliminar la categoría";
        alert.type = "danger";
        alert.show = true;
        console.error("Error al eliminar la categoría:", error);
      }
    };

    const fetchCategories = async () => {
  try {
    const data = await categoryApi.getAllCategories();
    console.log("Datos recibidos en fetchCategories:", data);
    // Accede a response.categories para obtener el array de categorías
    categories.value = Array.isArray(data.response.categories) ? data.response.categories : [];
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    categories.value = []; // Valor predeterminado en caso de error
  }
};




    onMounted(() => {
      fetchCategories();
    });

    const fields = [
  { key: "idCategory", label: "ID" },
  { key: "name", label: "Nombre de Categoría" },
  { key: "status", label: "Estado" },
  { key: "actions", label: "Acciones" }
];


    return {
      isSidebarOpen,
      toggleSidebar,
      categories,
      fields,
      showModal,
      showRegisterModal,
      showEditModal,
      selectedCategory,
      editCategoryData,
      newCategory,
      alert,
      showCategoryModal,
      goToFullCategoriesPage,
      addCategory,
      openEditModal,
      updateCategory,
      deleteCategory,
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

.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
