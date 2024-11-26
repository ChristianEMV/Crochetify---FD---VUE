<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />
    <div class="header" :class="{ 'header-collapsed': isSidebarOpen }">
      <div class="header-wrapper">
        <h3><i class="fas fa-box"></i> Productos</h3>
        <h6>Gestión de los productos</h6>
      </div>
    </div>

    <transition name="fade">
      <b-alert v-if="alert.show" :variant="alert.type" dismissible @dismissed="alert.show = false" class="alert-bottom-left">
        {{ alert.message }}
      </b-alert>
    </transition>

    <div class="table-container">
      <h3 class="mb-4">Resumen de Productos</h3>
      <b-button variant="primary" class="mb-3" @click="toggleCreateForm">
        <i class="fas fa-plus"></i> Agregar Producto
      </b-button>

      <transition name="fade">
        <div v-if="showCreateForm" class="mb-4 form-container">
          <b-form @submit.prevent="createProduct">
            <b-form-group label="Nombre del Producto" label-for="product-name-input">
              <b-form-input
                id="product-name-input"
                v-model="newProductData.name"
                required
                placeholder="Introduce el nombre del producto"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Descripción del Producto" label-for="product-description-input">
              <b-form-input
                id="product-description-input"
                v-model="newProductData.description"
                required
                placeholder="Introduce la descripción del producto"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Categorías" label-for="product-categories-input">
              <b-form-checkbox-group
                id="product-categories-input"
                v-model="newProductData.categoryIds"
                :options="categories"
                name="categories"
                stacked
              ></b-form-checkbox-group>
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
          <b-form @submit.prevent="updateProduct">
            <b-form-group label="ID del Producto:">
              <p>{{ editProductData.id }}</p>
            </b-form-group>
            <b-form-group label="Nombre del Producto">
              <b-form-input
                v-model="editProductData.name"
                required
                placeholder="Introduce el nombre del producto"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Descripción del Producto">
              <b-form-input
                v-model="editProductData.description"
                required
                placeholder="Introduce la descripción del producto"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Categorías">
              <b-form-checkbox-group
                v-model="editProductData.categoryIds"
                :options="categories"
                name="categories"
                stacked
              ></b-form-checkbox-group>
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

      <b-table v-else :items="products" :fields="fields" responsive striped hover small>
        <template #cell(id)="row">
          <span>{{ row.item.id }}</span>
        </template>
        <template #cell(name)="row">
          <span @click="openProductModal(row.item)" class="product-name">{{ row.item.name }}</span>
        </template>
        <template #cell(description)="row">
          <span>{{ row.item.description }}</span>
        </template>
        <template #cell(categories)="row">
          <span>{{ row.item.categories.map(category => category.name).join(', ') }}</span>
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
              Editar Producto
            </b-button>
          </div>
        </template>
      </b-table>
    </div>

    <b-modal v-model="showProductModal" title="Detalles del Producto" hide-footer>
      <div v-if="selectedProduct">
        <p><strong>ID:</strong> {{ selectedProduct.idProduct }}</p>
        <p><strong>Nombre:</strong> {{ selectedProduct.name }}</p>
        <p><strong>Descripción:</strong> {{ selectedProduct.description }}</p>
        <p><strong>Categorías:</strong> {{ selectedProduct.categories.map(category => category.name).join(', ') }}</p>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from "vue-router";
import { productApi, categoryApi } from "../http-common";

export interface Category {
  id: number;
  name: string;
}

export default defineComponent({
  name: "products",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const showCreateForm = ref(false);
    const showEditForm = ref(false);
    const isLoading = ref(true);
    const alert = reactive({ show: false, message: "", type: "success" });
    const newProductData = reactive({ name: "", description: "", categoryIds: [] as number[] });
    const editProductData = reactive({ id: 0, name: "", description: "", categoryIds: [] as number[] });
    const products = ref([]);
    const categories = ref<Category[]>([]);
    const router = useRouter();
    const showProductModal = ref(false);
    const selectedProduct = ref<{ idProduct: number; name: string; description: string; categories: Category[] } | null>(null);

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const goToFullProductsPage = () => {
      router.push({ name: "fullproductos" });
    };

    const toggleCreateForm = () => {
      showCreateForm.value = !showCreateForm.value;
      newProductData.name = "";
      newProductData.description = "";
      newProductData.categoryIds = [];
    };

    const toggleEditForm = () => {
      showEditForm.value = !showEditForm.value;
      editProductData.id = 0;
      editProductData.name = "";
      editProductData.description = "";
      editProductData.categoryIds = [];
    };

    const createProduct = async () => {
      try {
        await productApi.createProduct(newProductData);
        await fetchProducts();
        alert.message = "Producto creado con éxito";
        alert.type = "success";
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);
        showCreateForm.value = false;
        newProductData.name = "";
        newProductData.description = "";
        newProductData.categoryIds = [];
      } catch (error) {
        alert.message = "Error al crear el producto";
        alert.type = "danger";
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);
        console.error("Error al crear el producto:", error);
      }
    };

    const openEditForm = (product: any) => {
      if (!product.idProduct) {
        console.error("ID del producto no encontrado", product);
        return;
      }
      editProductData.id = product.idProduct;
      editProductData.name = product.name;
      editProductData.description = product.description;
      editProductData.categoryIds = product.categories.map((category: any) => category.id);
      showEditForm.value = true;
    };

    const updateProduct = async () => {
      try {
        await productApi.updateProduct(editProductData.id, editProductData);
        await fetchProducts();
        alert.message = "Producto actualizado con éxito";
        alert.type = "success";
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);
        showEditForm.value = false;
      } catch (error) {
        alert.message = "Error al actualizar el producto";
        alert.type = "danger";
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);
        console.error("Error al actualizar el producto:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        isLoading.value = true;
        const data = await productApi.getProducts();
        const allProducts = Array.isArray(data.response.products) ? data.response.products.map((prod: { idProduct: any; name: any; description: any; categories: any; }) => ({
          idProduct: prod.idProduct,
          name: prod.name,
          description: prod.description,
          categories: prod.categories
        })) : [];
        products.value = allProducts;
      } catch (error) {
        console.error("Error al cargar los productos:", error);
        products.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAllCategories();
        categories.value = data.response.categories.map((cat: { idCategory: any; name: any; }) => ({
          value: cat.idCategory,
          text: cat.name
        }));
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
        categories.value = [];
      }
    };

    const openProductModal = (product: any) => {
      selectedProduct.value = product;
      showProductModal.value = true;
    };

    onMounted(() => {
      fetchProducts();
      fetchCategories();
    });

    const fields = [
      { key: "idProduct", label: "ID" },
      { key: "name", label: "Nombre del Producto" },
      { key: "description", label: "Descripción" },
      { key: "categories", label: "Categorías" },
      { key: "actions", label: "Acciones" }
    ];

    return {
      isSidebarOpen,
      toggleSidebar,
      products,
      fields,
      showCreateForm,
      showEditForm,
      newProductData,
      editProductData,
      alert,
      toggleCreateForm,
      toggleEditForm,
      createProduct,
      openEditForm,
      updateProduct,
      goToFullProductsPage,
      isLoading,
      fetchCategories,
      categories,
      showProductModal,
      selectedProduct,
      openProductModal,
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
  padding: 10px;
}

.b-table tbody td {
  padding: 10px;
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

.product-name {
  cursor: pointer;
  color: #007bff;
}
</style>