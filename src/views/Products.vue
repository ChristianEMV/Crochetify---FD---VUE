<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />
    <div class="header" :class="{ 'header-collapsed': isSidebarOpen }">
      <div class="header-wrapper">
        <h3><i class="fas fa-layer-group"></i> Productos</h3>
        <h6>Gestión de los productos</h6>
      </div>
    </div>

    <!-- Alerta para mostrar mensajes -->
    <b-alert v-if="alert.show" :variant="alert.type" dismissible>
      {{ alert.message }}
    </b-alert>

    <div class="table-container">
      <h3 class="mb-4">Resumen de Productos</h3>
      <b-table
        :items="products"
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
            @click="showProductModal(row.item)"
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
              @click="deleteProduct(row.item.id)"
            >
              <i class="fas fa-trash"></i>
            </b-button>
            <b-button variant="success">Agregar</b-button>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from "vue-router";
import { productApi } from "../http-common";

export default defineComponent({
  name: "Products",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const showModal = ref(false);
    const showEditModal = ref(false);
    const alert = reactive({ show: false, message: "", type: "success" }); // Definición correcta de alert
    const selectedProduct = reactive({ name: "", status: "" });
    const products = ref([]);
    const router = useRouter();
    const editProductData = reactive({ id: 0, name: "", status: "Activo" });
    const newCategory = reactive({ name: "", status: "Activo" });

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const showProductModal = (product: any) => {
      selectedProduct.name = product.name;
      selectedProduct.status = product.status;
      showModal.value = true;
    };

    const fetchProducts = async () => {
      try {
        const data = await productApi.getAllProducts();
        console.log("Datos recibidos en fetchProducts:", data);
        products.value = Array.isArray(data.response.products) ? data.response.products : [];
      } catch (error) {
        console.error("Error al cargar los productos:", error);
        products.value = [];
        // Mostrar alerta en caso de error
        alert.message = "Error al cargar los productos";
        alert.type = "danger";
        alert.show = true;
      }
    };

    const openEditModal = (product: any) => {
      editProductData.id = product.id;
      editProductData.name = product.name;
      editProductData.status = product.status;
      showEditModal.value = true;
    };

    const updateProduct = async () => {
  try {
    await productApi.updateProduct(editProductData.id, {
      name: editProductData.name,
      status: editProductData.status,
    });
    await fetchProducts();
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


    const deleteProduct = async (id: number) => {
      try {
        await productApi.deleteProducts(id);
        await fetchProducts();
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

    onMounted(() => {
      fetchProducts();
    });

    const fields = [
      { key: "idProduct", label: "ID" },
      { key: "name", label: "Nombre de Producto" },
      { key: "description", label: "Descripción" },
      { key: "status", label: "Estado" },
      { key: "actions", label: "Acciones" }
    ];

    return {
      isSidebarOpen,
      toggleSidebar,
      deleteProduct,
      updateProduct,
      openEditModal,
      products,
      fields,
      showModal,
      selectedProduct,
      alert,
      showProductModal
    };
  }
});
</script>

<style scoped>
/* Aquí van los estilos */
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
.table-container {
  width: 98%;
  margin: 20px auto;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
