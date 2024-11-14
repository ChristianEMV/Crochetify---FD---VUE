<template>
    <div>
      <Navbar @toggle-sidebar="toggleSidebar" />
      <Sidebar :isOpen="isSidebarOpen" />
      <Users_component/>
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