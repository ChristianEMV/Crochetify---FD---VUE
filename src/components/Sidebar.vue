<template>
    <aside v-show="isOpen" class="sidebar shadow-sm">
      <h4 class="text-center mb-4">Admin Tools</h4> <!-- Título Agregado -->
      <ul>
        <li @click="toggleResourceMenu" :class="{ active: activeMenu === 'resourceManagement' }">
          <i class="fas fa-cogs"></i> Gestión de Recursos
          <i :class="isResourceOpen ? 'fas fa-chevron-up float-right' : 'fas fa-chevron-down float-right'"></i>
        </li>
        <ul v-show="isResourceOpen" class="submenu">
          <li @click.stop="navigate('categories')">Administrar Categorías</li>
          <li @click.stop="navigate('products')">Administrar Productos</li>
          <li @click.stop="navigate('stock')">Administrar Stock</li>
        </ul>
  
        <li @click="toggleSalesMenu" :class="{ active: activeMenu === 'sales' }">
          <i class="fas fa-shopping-cart"></i> Ventas
          <i :class="isSalesOpen ? 'fas fa-chevron-up float-right' : 'fas fa-chevron-down float-right'"></i>
        </li>
        <ul v-show="isSalesOpen" class="submenu">
          <li @click.stop="navigate('orders')">Pedidos</li>
          <li @click.stop="navigate('shipments')">Envíos</li>
        </ul>
  
        <li @click="navigate('users')"><i class="fas fa-users"></i> Administrar Usuarios</li>
      </ul>
    </aside>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from "vue";
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: "Sidebar",
    props: {
      isOpen: Boolean,
    },
    setup() {
      const router = useRouter();
      const activeMenu = ref('');
      const isResourceOpen = ref(false);
      const isSalesOpen = ref(false);
  
      const toggleResourceMenu = () => {
        isResourceOpen.value = !isResourceOpen.value;
        isSalesOpen.value = false; // Cierra el menú de ventas
        activeMenu.value = 'resourceManagement'; // Marca como activo
      };
  
      const toggleSalesMenu = () => {
        isSalesOpen.value = !isSalesOpen.value;
        isResourceOpen.value = false; // Cierra el menú de recursos
        activeMenu.value = 'sales'; // Marca como activo
      };
  
      const navigate = (route: string) => {
        router.push({ name: route });
      };
  
      return {
        activeMenu,
        isResourceOpen,
        isSalesOpen,
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
    background-color: white; /* Color de fondo blanco */
    color: black; /* Color de texto negro para mejor contraste */
    position: fixed;
    top: 73.5px; /* Ajuste para posicionar debajo del navbar */
    left: 0;
    height: calc(100% - 56px); /* Altura ajustada para no cubrir el navbar */
    padding: 1rem;
    transition: box-shadow 0.20s ease; /* Animación suave para sombras */
    z-index: 1000; /* Asegúrate de que esté por encima de otros elementos */
  }
  
  .sidebar:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Sombra al pasar el mouse */
  }
  
  h4 {
    margin-bottom: 1rem; /* Margen inferior para el título */
    color: #343a40; /* Color del texto del título */
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    cursor: pointer;
    margin: 10px 0;
    position: relative; /* Para el icono */
    transition: background-color 0.3s ease; /* Animación suave para fondo */
  }
  
  li:hover {
    background-color: #f8f9fa; /* Color de fondo al pasar el mouse */
  }
  
  li.active {
    background-color: #e9ecef; /* Color de fondo para el menú activo */
  }
  
  .submenu {
    padding-left: 1.5rem; /* Indentación para los submenús */
  }
  </style>
  