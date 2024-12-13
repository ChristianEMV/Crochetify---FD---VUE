import './assets/main.css';
import { createBootstrap } from 'bootstrap-vue-next';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Define global si no está disponible
window.global = window;


const app = createApp(App);

// Configurar rutas y plugins
app.use(router);
app.use(createBootstrap());

// Montar la app en el DOM
app.mount('#app');

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js') // Cambia la ruta si está en otro lugar
      .then(() => console.log('Service Worker registrado exitosamente'))
      .catch(error => console.error('Error al registrar el Service Worker:', error));
  });
}
