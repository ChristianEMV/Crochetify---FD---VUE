<template>
    <nav class="navbar">
      <!-- Sección izquierda: Botón de menú, título, y barra de búsqueda -->
      <div class="navbar-left">
        <button @click="toggleSidebar" class="menu-button">
          <i class="fas fa-bars"></i> <!-- Icono de menú -->
        </button>
        <h1 class="app-name">Crochetify</h1>
        <div class="navbar-search">
          <i class="fas fa-search search-icon"></i>
          <input type="text" placeholder="Buscar" class="search-input" />
        </div>
      </div>
  
      <!-- Sección central: Icono de la aplicación -->
      <div class="navbar-center">
        <img src="/src/assets/CrochetifyLogo.png" alt="App Icon" class="app-icon" />
      </div>
  
      <!-- Sección derecha: Puede estar vacía o tener otros elementos si es necesario -->
      <div class="navbar-right"></div>
    </nav>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "Navbar",
    emits: ["toggle-sidebar"],
    methods: {
      toggleSidebar() {
        this.$emit("toggle-sidebar");
      },
    },
  });
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: white;
    color: #0A0A0A;
    border-bottom: 1px solid #ddd;
    box-shadow: 0 4px 8px rgba(20, 20, 20, 0.1);
  }
  
  .navbar-left {
    display: flex;
    align-items: center;
    flex: 1;
  }
  
  .menu-button {
    font-size: 1.2rem;
    margin-right: 1rem;
    background: none;
    border: none;
    color: #0A0A0A;
    cursor: pointer;
  }
  
  .app-name {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .navbar-search {
    display: flex;
    align-items: center;
    margin-left: 10px;
    max-width: 300px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .search-icon {
    color: #888;
    padding: 0.5rem;
  }
  
  .search-input {
    padding: 0.5rem;
    border: none;
    width: 100%;
    outline: none;
  }
  
  .navbar-center {
    display: flex;
    justify-content: center;
    flex: 1;
  }
  
  .app-icon {
    height: 40px;
  }
  
  .navbar-right {
    flex: 1;
  }
  </style>
  