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

    <transition name="fade">
      <b-alert v-if="alert.show" :variant="alert.type" dismissible @dismissed="alert.show = false" class="alert-bottom-left">
        {{ alert.message }}
      </b-alert>
    </transition>

    <div class="table-container">
      <h3 class="mb-4">Resumen de Categorías</h3>
      <b-button variant="primary" class="mb-3" @click="toggleCreateForm">
        <i class="fas fa-plus"></i> Agregar Categoría
      </b-button>

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
            <br>
            <div class="button-group">
              <b-button variant="danger" @click="toggleCreateForm">Cancelar</b-button>
              <b-button variant="success" type="submit">Guardar</b-button>
            </div>
          </b-form>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="showEditForm" class="mb-4 form-container">
          <b-form @submit.prevent="updateCategoryStatus">
            <b-form-group label="ID de la Categoría:">
              <p>{{ editCategoryData.id }}</p>
            </b-form-group>
            <b-form-group label="Nombre de la Categoría">
              <p>{{ editCategoryData.name }}</p>
            </b-form-group>
            <b-form-group label="Estado de la Categoría">
              <b-form-select v-model="editCategoryData.status" :options="['Activo', 'Deshabilitada']"></b-form-select>
            </b-form-group>
            <br>
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

      <b-table v-else :items="categories" :fields="fields" responsive striped hover small>
        <template #cell(id)="row">
          <span>{{ row.item.id }}</span>
        </template>
        <template #cell(name)="row">
          <span>{{ row.item.name }}</span>
        </template>
        <template #cell(status)="row">
          <span>{{ row.item.status ? 'Habilitada' : 'Deshabilitada' }}</span>
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

      <b-button variant="outline-primary" class="btn-view-more mt-4" @click="goToFullCategoriesPage">
        Ver más
      </b-button>
    </div>
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
    const showCreateForm = ref(false);
    const showEditForm = ref(false);
    const isLoading = ref(true);
    const alert = reactive({ show: false, message: "", type: "success" });
    const newCategoryData = reactive({ name: "" });
    const editCategoryData = reactive({ id: 0, name: "", status: "Activo" });
    const categories = ref([]);
    const router = useRouter();

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const goToFullCategoriesPage = () => {
      router.push({ name: "fullcategories" });
    };

    const toggleCreateForm = () => {
      showCreateForm.value = !showCreateForm.value;
      newCategoryData.name = "";
    };

    const toggleEditForm = () => {
      showEditForm.value = !showEditForm.value;
      editCategoryData.id = 0;
      editCategoryData.name = "";
      editCategoryData.status = "Activo";
    };

    const createCategory = async () => {
      try {
        await categoryApi.createCategory({ name: newCategoryData.name });
        await fetchCategories();
        alert.message = "Categoría creada con éxito";
        alert.type = "success";
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);
        showCreateForm.value = false;
        newCategoryData.name = "";
      } catch (error) {
        alert.message = "Error al crear la categoría";
        alert.type = "danger";
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);
        console.error("Error al crear la categoría:", error);
      }
    };

    const openEditForm = (category: any) => {
      if(!category.id){
        console.error("ID de la categoría no encontrado", category);
        return;
      }
      editCategoryData.id = category.id;
      editCategoryData.name = category.name;
      editCategoryData.status = category.status;
      console.log("ID de la categoría:", editCategoryData.id);
      showEditForm.value = true;
    };

    const updateCategoryStatus = async () => {
      try {
        const status = editCategoryData.status === 'Activo';
        await categoryApi.updateCategoryStatus(editCategoryData.id, status);
        console.log("ID de la categoría:", editCategoryData.id);
        await fetchCategories();
        alert.message = "Estado de la categoría actualizado con éxito";
        alert.type = "success";
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);
        showEditForm.value = false;
      } catch (error) {
        alert.message = "Error al actualizar el estado de la categoría";
        alert.type = "danger";
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);
        console.error("Error al actualizar el estado de la categoría:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        isLoading.value = true;
        const data = await categoryApi.getAllCategories();
        const allCategories = Array.isArray(data.response.categories) ? data.response.categories.map((cat: { idCategory: any; name: any; status: any; }) => ({
          id: cat.idCategory,
          name: cat.name,
          status: cat.status
        })) : [];
        categories.value = allCategories.slice(-5);
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
        categories.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const fetchCategoryById = async (id: number) => {
      try {
        const data = await categoryApi.getCategoryById(id);
        return data.response.category;
      } catch (error) {
        console.error("Error al obtener la categoría:", error);
        return null;
      }
    };

    onMounted(() => {
      fetchCategories();
    });

    const fields = [
      { key: "id", label: "ID" },
      { key: "name", label: "Nombre de Categoría" },
      { key: "status", label: "Estado" },
      { key: "actions", label: "Acciones" }
    ];

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
      updateCategoryStatus,
      goToFullCategoriesPage,
      isLoading,
      fetchCategoryById,
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
</style>