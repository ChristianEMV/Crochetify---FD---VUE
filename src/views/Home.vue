<template>
    <div>
      <Navbar @toggle-sidebar="toggleSidebar" />
      <Sidebar :isOpen="isSidebarOpen" />
      <main class="dashboard">
        <h2>Dashboard</h2>
        <p>Aquí se mostrarán estadísticas clave del negocio.</p>
        <!-- Podrías agregar gráficos o tablas con estadísticas aquí -->
      </main>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from "vue";
  import Navbar from "../components/Navbar.vue";
  import Sidebar from "../components/Sidebar.vue";
  
  export default defineComponent({
    name: "Home",
    components: { Navbar, Sidebar },
    setup() {
      const isSidebarOpen = ref(false);
  
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      return { isSidebarOpen, toggleSidebar };
    },
  });
  </script>
  
  <style scoped>
  .dashboard {
    margin-left: 250px; /* Espacio para el sidebar */
    padding: 2rem;
  }
  </style>
  