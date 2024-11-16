<template>
  <nav :class="['navbar', darkMode ? 'dark-mode' : '']">
    <div class="navbar-left">
      <button @click="toggleSidebar" class="menu-button">
        <i class="fas fa-bars"></i>
      </button>
      <h1 class="app-name">Crochetify</h1>
      <div class="navbar-search" :class="{ 'active-search': isSearchActive }">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Buscar"
          class="search-input"
          v-model="searchTerm"
          @focus="isSearchActive = true"
          @blur="isSearchActive = false"
          @input="updateSuggestions"
        />
        <ul v-if="suggestions.length" class="suggestions-list">
          <li v-for="suggestion in suggestions" :key="suggestion" @mousedown.prevent="handleSuggestionClick(suggestion)">
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </div>

    <div class="navbar-center">
      <router-link to="/home" class="app-icon-link">
        <img src="/src/assets/CrochetifyLogo.png" alt="App Icon" class="app-icon" />
      </router-link>
    </div>

    <div class="navbar-right">
      <button class="notification-button">
        <i class="fas fa-bell"></i>
      </button>
      <img src="/src/assets/usuario.png" alt="User Avatar" class="user-avatar" />
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Navbar",
  props: {
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggle-sidebar"],
  setup(_, { emit }) {
    const isSearchActive = ref(false);
    const searchTerm = ref("");
    const suggestions = ref<string[]>([]);
    const router = useRouter();

    const searchItems = [
      { name: "Administrar Categorias", route: "/categories" },
      { name: "Administrar Productos", route: "/products" },
      { name: "Administrar Stock", route: "/stock" },
      { name: "Administrar Usuarios", route: "/users" },
      { name: "Administrar Pedidos", route: "/orders" },
    ];

    const updateSuggestions = () => {
      if (searchTerm.value) {
        suggestions.value = searchItems
          .filter(item => item.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
          .map(item => item.name);
      } else {
        suggestions.value = [];
      }
    };

    const handleSuggestionClick = (suggestion: string) => {
      const selectedItem = searchItems.find(item => item.name === suggestion);
      if (selectedItem) {
        router.push(selectedItem.route);
      }
    };

    const toggleSidebar = () => {
      emit("toggle-sidebar");
    };

    return {
      toggleSidebar,
      isSearchActive,
      searchTerm,
      suggestions,
      updateSuggestions,
      handleSuggestionClick
    };
  }
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #ffffff;
  color: #333;
  border-bottom: 2px solid #f1f1f1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.navbar.dark-mode {
  background-color: #2c2c2c;
  color: #ffffff;
}

.navbar:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.navbar-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.menu-button {
  font-size: 1.4rem;
  margin-right: 1rem;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  transition: color 0.3s;
}

.menu-button:hover {
  color: #007bff;
}

.app-name {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: #272727;
}

.navbar-search {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 15px;
  max-width: 350px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  transition: border-color 0.3s;
}

.navbar-search.active-search {
  border-color: #007bff;
}

.search-icon {
  color: #888;
  padding: 0.5rem;
}

.search-input {
  padding: 0.5rem;
  flex-grow: 1;
  border: none;
  outline: none;
  background: transparent;
}

.suggestions-list {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  list-style: none;
  margin: 0;
  padding: 0;
  width: calc(100% - 1px);
  z-index: 1000;
  top: 100%;
  left: 0;
  border-radius: 0 0 6px 6px;
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}

.navbar-center {
  display: flex;
  justify-content: center;
  flex: 1;
}

.app-icon-link {
  display: inline-block;
}

.app-icon {
  height: 50px;
  border-radius: 8px;
  transition: transform 0.3s;
}

.app-icon:hover {
  transform: scale(1.25);
}

.navbar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}

.notification-button {
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #333;
  margin-right: 15px;
  cursor: pointer;
  transition: color 0.3s;
}

.notification-button:hover {
  color: #007bff;
}

.user-avatar {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
  transition: border-color 0.3s;
}

.user-avatar:hover {
  border-color: #007bff;
}
</style>
