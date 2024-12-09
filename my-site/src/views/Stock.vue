<template>
  <div>
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />
    <div class="header" :class="{ 'header-collapsed': isSidebarOpen }">
      <div class="header-wrapper">
        <h3><i class="fas fa-box"></i> Stock</h3>
        <h6>Gestión del stock de productos</h6>
      </div>
    </div>

    <transition name="fade">
      <b-alert
        v-if="alert.show"
        :variant="alert.type"
        dismissible
        @dismissed="alert.show = false"
        class="alert-bottom-left"
      >
        {{ alert.message }}
      </b-alert>
    </transition>

    <div class="table-container">
      <h3 class="mb-4">Tabla de Stock</h3>
      <div class="d-flex mb-3">
        <b-button variant="primary" class="mb-3" @click="toggleCreateForm">
          <i class="fas fa-plus"></i> Agregar Stock
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
          <b-form @submit.prevent="createStock">
            <b-form-group label="Producto" label-for="product-select">
              <i class="fas fa-box-open"></i> Producto asociado al stock
              <b-form-select
                id="product-select"
                v-model="newStockData.productId"
                :options="products"
                required
                placeholder="Selecciona un producto"
              ></b-form-select>
            </b-form-group>
            <b-form-group label="Color" label-for="color-picker">
              <i class="fas fa-palette"></i> Color del stock
              <br />
              <input
                type="color"
                id="color-picker"
                v-model="newStockData.color"
                required
              />
            </b-form-group>
            <b-form-group label="Precio" label-for="price-input">
              <i class="fas fa-dollar-sign"></i> Precio del stock
              <b-form-input
                id="price-input"
                v-model="newStockData.price"
                type="number"
                required
                placeholder="Introduce el precio"
                min="1"
                step="0.01"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Cantidad" label-for="quantity-input">
              <i class="fas fa-sort-numeric-up"></i> Cantidad del stock
              <b-form-input
                id="quantity-input"
                v-model="newStockData.quantity"
                type="number"
                required
                placeholder="Introduce la cantidad"
                min="1"
                step="1"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Imágenes" label-for="images-input">
              <i class="fas fa-images"></i> Imágenes del stock
              <br />
              <input
                type="file"
                id="images-input"
                accept=".png, .jpg, .jpeg"
                multiple
                @change="handleImageUpload"
              />
              <div
                class="drop-area"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                Arrastra y suelta las imágenes aquí
              </div>
              <div class="image-preview">
                <img
                  v-for="(image, index) in newStockData.images"
                  :key="index"
                  :src="image"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  multiple
                  @change="handleImageUpload"
                  class="preview-image"
                />
              </div>
            </b-form-group>
            <br />
            <div class="button-group">
              <b-button variant="danger" @click="toggleCreateForm"
                >Cancelar</b-button
              >
              <b-button variant="secondary" @click="resetForm"
                >Limpiar</b-button
              >
              <b-button variant="success" type="submit">Guardar</b-button>
            </div>
          </b-form>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="showEditForm" class="mb-4 form-container">
          <b-form @submit.prevent="updateStock">
            <b-form-group label="Color" label-for="edit-color-picker">
              <input
                type="color"
                id="edit-color-picker"
                v-model="editStockData.color"
                required
              />
            </b-form-group>
            <b-form-group label="Precio" label-for="edit-price-input">
              <b-form-input
                id="edit-price-input"
                v-model="editStockData.price"
                type="number"
                required
                placeholder="Introduce el precio"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Cantidad" label-for="edit-quantity-input">
              <b-form-input
                id="edit-quantity-input"
                v-model="editStockData.quantity"
                type="number"
                required
                placeholder="Introduce la cantidad"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Imágenes" label-for="edit-images-input">
              <input
                type="file"
                id="edit-images-input"
                accept=".png, .jpg, .jpeg"
                multiple
                @change="handleEditImageUpload"
              />
              <div
                class="drop-area"
                @dragover.prevent
                @drop.prevent="handleEditDrop"
                @change="handleImageUpload"
              >
                Arrastra y suelta las imágenes aquí
              </div>
            </b-form-group>
            <br />
            <div class="button-group">
              <b-button variant="danger" @click="toggleEditForm"
                >Cancelar</b-button
              >
              <b-button variant="success" type="submit">Guardar</b-button>
            </div>
          </b-form>
        </div>
      </transition>

      <div v-if="isLoading" class="spinner-container">
        <b-spinner class="custom-spinner" label="Loading..."></b-spinner>
      </div>

      <b-table
        v-else
        :items="filterStocks"
        :fields="fields"
        responsive
        striped
        hover
        small
      >
        <template #cell(idStock)="row">
          <span>{{ row.item.idStock }}</span>
        </template>
        <template #cell(product)="row">
          <span @click="openStockModal(row.item)" class="stock-name">{{
            row.item.product.name
          }}</span>
        </template>
        <template #cell(color)="row">
          <span
            :style="{ backgroundColor: row.item.color }"
            class="color-box"
          ></span>
        </template>
        <template #cell(price)="row">
          <span>{{ row.item.price }}</span>
        </template>
        <template #cell(quantity)="row">
          <span>{{ row.item.quantity }}</span>
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
              Editar Stock
            </b-button>
          </div>
        </template>
      </b-table>
    </div>

    <b-modal
      v-model="showStockModal"
      :key="selectedStock?.idStock || 'default'"
      title="Detalles del Stock"
      hide-footer
    >
      <div v-if="selectedStock">
        <p><strong>ID:</strong> {{ selectedStock.idStock }}</p>
        <p><strong>Producto:</strong> {{ selectedStock.product.name }}</p>
        <p>
          <strong>Color:</strong>
          <span
            :style="{ backgroundColor: selectedStock.color }"
            class="color-box"
          ></span>
        </p>
        <p><strong>Precio:</strong> {{ selectedStock.price }}</p>
        <p><strong>Cantidad:</strong> {{ selectedStock.quantity }}</p>
        <p><strong>Imágenes:</strong></p>
        <div v-if="selectedStock.images && selectedStock.images.length">
          <img
            v-for="(image, index) in selectedStock.images"
            :key="index"
            :src="image"
            class="stock-image"
          />
        </div>
      </div>
    </b-modal>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <img :src="stockImageUrl" alt="Stock Image" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import { useRouter } from "vue-router";
import { stockApi, productApi } from "../http-common";

export default defineComponent({
  name: "Stock",
  components: { Navbar, Sidebar },
  setup() {
    const isSidebarOpen = ref(false);
    const searchQuery = ref("");
    const showCreateForm = ref(false);
    const showEditForm = ref(false);
    const isLoading = ref(true);
    const alert = reactive({ show: false, message: "", type: "success" });
    const newStockData = reactive({
      productId: 0,
      color: "#000000",
      price: 0,
      quantity: 0,
      images: [] as string[], // Mantener las imágenes como URLs o identificadores
    });
    const editStockData = reactive({
      idStock: 0,
      color: "#000000",
      price: 0,
      quantity: 0,
      images: [] as string[], // Mantener las imágenes como URLs o identificadores
    });
    const stocks = ref([]);
    const products = ref([]);
    const router = useRouter();
    const showStockModal = ref(false);
    const selectedStock = ref<{
      idStock: number;
      product: { name: string };
      color: string;
      price: number;
      quantity: number;
      images: string[];
    } | null>(null);
    const showModal = ref(false);
    const stockImageUrl = ref("");

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const toggleCreateForm = () => {
      showCreateForm.value = !showCreateForm.value;
      resetForm();
    };

    const toggleEditForm = () => {
      showEditForm.value = !showEditForm.value;
      editStockData.idStock = 0;
      editStockData.color = "#000000";
      editStockData.price = 0;
      editStockData.quantity = 0;
      editStockData.images = []; // Borrar las imágenes previas al editar
    };

    const resetForm = () => {
      newStockData.productId = 0;
      newStockData.color = "#000000";
      newStockData.price = 0;
      newStockData.quantity = 0;
      newStockData.images = [];
    };

    const createStock = async () => {
      try {
        await stockApi.createStock(newStockData);
        await fetchStocks();
        alert.message = "Stock creado con éxito";
        alert.type = "success";
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);
        showCreateForm.value = false;
      } catch (error) {
        alert.message = "Error al crear el stock";
        alert.type = "danger";
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);
        console.error("Error al crear el stock:", error);
      }
    };

    const updateStock = async () => {
      try {
        // Combina las imágenes existentes del stock con las nuevas cargadas
        const combinedImages = [
          ...(selectedStock.value?.images || []), // Imágenes existentes
          ...editStockData.images, // Nuevas imágenes cargadas
        ].filter(Boolean); // Filtrar valores vacíos o inválidos

        // Crear el payload con las imágenes combinadas
        const payload = {
          ...editStockData,
          images: combinedImages,
        };

        console.log("Payload enviado para actualización:", payload); // Para depuración

        // Realizar la solicitud de actualización de stock
        await stockApi.updateStock(editStockData.idStock, payload);

        // Refrescar la lista de stocks después de actualizar
        await fetchStocks();

        // Mostrar mensaje de éxito
        alert.message = "Stock actualizado con éxito";
        alert.type = "success";
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);

        showEditForm.value = false; // Cerrar formulario de edición
      } catch (error) {
        // Manejo de errores
        console.error("Error al actualizar el stock:", error);

        alert.message = "Error al actualizar el stock";
        alert.type = "danger";
        alert.show = true;
        setTimeout(() => {
          alert.show = false;
        }, 5000);
      }
    };

    const fetchStocks = async () => {
      try {
        isLoading.value = true;
        const data = await stockApi.getStocks();

        // Procesar las imágenes de cada stock
        const processedStocks = data.response.stocks.map((stock: any) => {
          const processedImages = (stock.images || []).map((image: any) => {
            if (typeof image === "object" && image.image) {
              // Si es un objeto, extraer el valor de la propiedad `image`
              return image.image.startsWith("data:image/")
                ? image.image
                : `data:image/jpeg;base64,${image.image}`;
            } else if (typeof image === "string") {
              // Si es una cadena, verifica y ajusta el prefijo
              return image.startsWith("data:image/")
                ? image
                : `data:image/jpeg;base64,${image}`;
            } else {
              console.warn("Formato de imagen desconocido:", image);
              return ""; // Retorna una cadena vacía para evitar errores
            }
          });
          return { ...stock, images: processedImages };
        });

        stocks.value = processedStocks; // Actualiza el estado con los stocks procesados
      } catch (error) {
        console.error("Error al cargar los stocks:", error);
        stocks.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await productApi.getProducts();
        products.value = data.response.products.map((product: any) => ({
          value: product.idProduct,
          text: product.name,
        }));
      } catch (error) {
        console.error("Error al cargar los productos:", error);
        products.value = [];
      }
    };

    const openEditForm = (stock: any) => {
      editStockData.idStock = stock.idStock;
      editStockData.color = stock.color;
      editStockData.price = stock.price;
      editStockData.quantity = stock.quantity;
      editStockData.images = []; // Limpiar las imágenes al abrir el formulario de edición
      showEditForm.value = true;
    };

    const openStockModal = (stock: any) => {
      selectedStock.value = stock; // Asignar el stock seleccionado
      showStockModal.value = false; // Asegurarte de reiniciar el modal
      setTimeout(() => {
        showStockModal.value = true; // Mostrar modal con el nuevo stock seleccionado
      }, 0); // Usar un pequeño delay para forzar actualización del DOM
    };

    const handleImageUpload = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Aquí solo agregamos las URLs o identificadores de las imágenes
            newStockData.images.push((e.target?.result as string) || "");
          };
          reader.readAsDataURL(files[i]);
        }
      }
    };

    const handleEditImageUpload = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Aquí solo agregamos las URLs o identificadores de las imágenes
            editStockData.images.push((e.target?.result as string) || "");
          };
          reader.readAsDataURL(files[i]);
        }
      }
    };

    const handleDrop = (event: DragEvent) => {
      const files = event.dataTransfer?.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Aquí solo agregamos las URLs o identificadores de las imágenes
            newStockData.images.push((e.target?.result as string) || "");
          };
          reader.readAsDataURL(files[i]);
        }
      }
    };

    const handleEditDrop = (event: DragEvent) => {
      const files = event.dataTransfer?.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Aquí solo agregamos las URLs o identificadores de las imágenes
            editStockData.images.push((e.target?.result as string) || "");
          };
          reader.readAsDataURL(files[i]);
        }
      }
    };

    const displayStockModal = (base64Image: string) => {
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      stockImageUrl.value = imageUrl;
      showModal.value = true;
    };

    onMounted(() => {
      fetchStocks();
      fetchProducts();
    });

    const fields = [
      { key: "idStock", label: "ID" },
      { key: "product", label: "Producto" },
      { key: "color", label: "Color" },
      { key: "price", label: "Precio" },
      { key: "quantity", label: "Cantidad" },
      { key: "actions", label: "Acciones" },
    ];

    const filterStocks = computed(() => {
      return stocks.value.filter((stock: { idStock: number; product: { name: string }; color: string; price: number; quantity: number }) => {
        return (
          stock.idStock.toString().includes(searchQuery.value) ||
          stock.product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          stock.color.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          stock.price.toString().includes(searchQuery.value) ||
          stock.quantity.toString().includes(searchQuery.value)
        );
      });
    });

    return {
      isSidebarOpen,
      toggleSidebar,
      stocks,
      fields,
      showCreateForm,
      showEditForm,
      newStockData,
      editStockData,
      alert,
      toggleCreateForm,
      toggleEditForm,
      createStock,
      updateStock,
      openEditForm,
      openStockModal,
      handleImageUpload,
      handleEditImageUpload,
      handleDrop,
      handleEditDrop,
      isLoading,
      products,
      displayStockModal,
      selectedStock,
      filterStocks,
      showModal,
      stockImageUrl,
      searchQuery,
      showStockModal,
      resetForm,
    };
  },
});
</script>

<style scoped>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.alert-bottom-left {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1050;
}

.color-box {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.stock-name {
  cursor: pointer;
  color: #007bff;
}

.stock-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 10px;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
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

.image-preview {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.preview-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.drop-area {
  border: 2px dashed #007bff;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  color: #007bff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.drop-area:hover {
  background-color: #e9f5ff;
}

.b-form-group i {
  margin-right: 5px;
}
</style>
