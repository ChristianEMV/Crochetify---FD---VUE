<template>
  <aside v-show="isOpen" :class="['sidebar shadow-sm', darkMode ? 'dark-mode' : '', isOpen ? 'visible' : '']">
    <div class="sidebar-header">
      <img src="/src/assets/ajustes.png" alt="Logo" class="logo" />
      <h4 class="title">Admin Tools</h4>
    </div>
    <ul>
      <li @click="navigate('home')"><i class="fas fa-home"></i> Home</li>
      <li @click="toggleResourceMenu" :class="{ active: activeMenu === 'resourceManagement' }">
        <i class="fas fa-cogs"></i> Gestión de Recursos
        <i :class="isResourceOpen ? 'fas fa-chevron-up float-right' : 'fas fa-chevron-down float-right'"></i>
      </li>
      <b-collapse v-model="isResourceOpen" class="submenu">
        <li @click.stop="navigate('categories')">Administrar Categorías</li>
        <li @click.stop="navigate('products')">Administrar Productos</li>
        <li @click.stop="navigate('stock')">Administrar Stock</li>
      </b-collapse>

      <hr class="divider" />

      <li @click="toggleSalesMenu" :class="{ active: activeMenu === 'sales' }">
        <i class="fas fa-shopping-cart"></i> Ventas
        <i :class="isSalesOpen ? 'fas fa-chevron-up float-right' : 'fas fa-chevron-down float-right'"></i>
      </li>
      <b-collapse v-model="isSalesOpen" class="submenu">
        <li @click.stop="navigate('orders')">Pedidos</li>
        <li @click.stop="navigate('shipments')">Envíos</li>
      </b-collapse>

      <hr class="divider" />

      <li @click="navigate('users')"><i class="fas fa-users"></i> Administrar Usuarios</li>

      <hr class="divider" />

      <div class="logout-container">
        <b-button variant="danger" @click="logout" class="logout-button">
          <i class="fas fa-sign-out-alt"></i> Cerrar sesión
        </b-button>
      </div>

    </ul>
  </aside>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router';

export default defineComponent({
  name: "Sidebar",
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:isOpen"], // Emite evento para actualizar el estado del sidebar
  methods: {
    toggle() {
      this.$emit("update:isOpen", !this.isOpen); // Cambia el estado y emite el evento
    },
  },
  setup(props, { emit }) {
    const router = useRouter();
    const activeMenu = ref('');
    const isResourceOpen = ref(false);
    const isSalesOpen = ref(false);

    const toggleResourceMenu = () => {
      isResourceOpen.value = !isResourceOpen.value;
      isSalesOpen.value = false;
      activeMenu.value = 'resourceManagement';
    };

    const toggleSalesMenu = () => {
      isSalesOpen.value = !isSalesOpen.value;
      isResourceOpen.value = false;
      activeMenu.value = 'sales';
    };

    const navigate = (route: string) => {
      router.push({ name: route });
    };

    const logout = () => {
      localStorage.removeItem("authToken");
      router.push("/login");
    };

    const handleClickOutside = (event: MouseEvent) => {
  const sidebarElement = document.querySelector(".sidebar");
  const screenWidth = window.innerWidth;
  const clickX = event.clientX;
  if (!props.isOpen) {
    return;
  }
  const rightSideThreshold = screenWidth * 0.2;
  const clickedOnRightSide = clickX > rightSideThreshold;  
  if (sidebarElement && !sidebarElement.contains(event.target as Node) && clickedOnRightSide) {
    emit("update:isOpen", false); 
  }
};

    onMounted(() => {

      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      activeMenu,
      isResourceOpen,
      isSalesOpen,
      logout,
      toggleResourceMenu,
      toggleSalesMenu,
      navigate,
    };
  },
});
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: white;
  color: black;
  position: fixed;
  top: 73.5px;
  left: 0;
  height: calc(100% - 56px);
  padding: 1rem;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease, background-color 0.3s ease;
  z-index: 1000;
  transform: translateX(-100%);
}

.sidebar.visible {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.logo {
  width: 30px;
  height: 30px;
}

.title {
  color: #343a40;
  font-weight: bold;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  cursor: pointer;
  margin: 10px 0;
  position: relative;
  border-radius: 6px;
  padding: 0.5rem;
  transition: background-color 0.3s, transform 0.2s;
}

li:hover {
  background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
}

li.active {
  background-color: #e9ecef;
  box-shadow: inset 4px 0 0 #007bff, 0 0 10px rgba(0, 123, 255, 0.5);
}

.submenu {
  padding-left: 1.5rem;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-in-out;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
}

.submenu[v-show] {
  max-height: 300px;
  opacity: 1;
}

.divider {
  border: 0;
  height: 1px;
  background-color: #dcdcdc;
  margin: 0.5rem 0;
}

.dark-mode {
  background-color: #1c1c1c;
  color: #d1d1d1;
}

.dark-mode li.active {
  background-color: #333;
  color: #ffffff;
}

.dark-mode li:hover {
  background-color: #2a2a2a;
}

.logout-button {
  background-color: #d92822;
  border: none;
  color: white;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #881713;
}
</style>