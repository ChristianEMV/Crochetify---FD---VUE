import './assets/main.css';
import { createBootstrap } from 'bootstrap-vue-next';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

// Configurar rutas y plugins
app.use(router);
app.use(createBootstrap());

// Montar la app en el DOM
app.mount('#app');
console.log("nav",navigator);
console.log(navigator.serviceWorker);

 /*
if ('serviceWorker' in navigator) {
  console.log('Service Worker es soportado');
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('../public/service-worker.js') // Cambia la ruta si está en otro lugar
      .then(() => console.log('Service Worker registrado exitosamente'))
      .catch(error => console.error('Error al registrar el Service Worker:', error));
  });
} */
  console.log('Ruta de service-worker:', window.location.origin + '/service-worker.js');
  console.log(navigator.serviceWorker);
if (navigator.serviceWorker) {
  console.log('Service Worker es soportado2');
  navigator.serviceWorker.register('/service-worker.js')
  .then(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
     });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        console.log('Service Worker registrado exitosamente');
        if (Notification.permission !== 'granted') {
          Notification.requestPermission();
        }
      })
      .catch(error => console.error('Error al registrar el Service Worker:', error));
  });
} else {
  console.log('Service Worker no es soportado en este navegador');
}