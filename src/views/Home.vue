<template>
  <div>

    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :isOpen="isSidebarOpen" />
      <div class="header">
          <div class="header-wrapper">
              <h3><i class="fas fa-activity"></i> Dashboard</h3>
              <h6>Sales overview & summary</h6>
          </div>

          <div class="row">
    <div class="col-sm-3">
      <div class="card">
        <div class="card-body" id="users">
          <div class="row">
            <div class="col-sm-8">
              <h1 id="active-users">259</h1>
              <h6 class="title">Usuarios Totales</h6>
              <p class="text">Usuarios totales registrados durante el mes</p>
            </div>
            <div class="col-sm-4 d-flex align-items-center justify-content-center">
              <i class="fas fa-users icon-circle-users"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-3">
      <div class="card">
        <div class="card-body" id="sells">
          <div class="row">
            <div class="col-sm-8">
              <h1 id="total-selling">843</h1>
              <h6 class="title">Ventas Totales</h6>
              <p class="text">Ventas totales realizadas durante el mes</p>
            </div>
            <div class="col-sm-4 d-flex align-items-center justify-content-center">
              <i class="fas fa-shopping-cart icon-circle-sells"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-3">
      <div class="card">
        <div class="card-body" id="orders">
          <div class="row">
            <div class="col-sm-8">
              <h1 id="pending-orders">196</h1>
              <h6 class="title">Pedidos en Curso</h6>
              <p class="text">Pedidos pendientes de envío</p>
            </div>
            <div class="col-sm-4 d-flex align-items-center justify-content-center">
              <i class="fas fa-box-open icon-circle-orders"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-3">
      <div class="card">
        <div class="card-body" id="earnings">
          <div class="row">
            <div class="col-sm-8">
              <h1 id="total-earnings">$59,482</h1>
              <h6 class="title">Ganancias Totales</h6>
              <p class="text">Total de ganancias obtenidas en el mes</p>
            </div>
            <div class="col-sm-4 d-flex align-items-center justify-content-center">
              <i class="fas fa-dollar-sign  icon-circle-earnings"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
      </div>
      <Grafic></Grafic>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import Grafic from "../components/Grafic.vue";

export default defineComponent({
    name: "Dashboard",
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

.offcanvas-custom-width {
  width: 300px;
}

body{
   overflow-x: hidden;
   overflow-y: hidden;
}

.header {
      width: 100%;
      height: 25vh;
      background: linear-gradient(135deg, #30596B, #5EAED1);
      color: white;
      padding: 20px;
   }

.card:hover {
   transform: scale(1.1); /* Aumenta un poco el tamaño */
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Agrega una sombra */
}

#users {
   border-left: solid 25px #44B7AC;
   line-height: 1.2; /* Disminuye la altura de línea en el card-body */
}

#orders {
   border-left: solid 25px #30596B;
   line-height: 1.2; /* Disminuye la altura de línea en el card-body */
}

#sells{
   border-left: solid 25px #768ABA;
   line-height: 1.2;
}

#earnings{
   border-left: solid 25px #66CE76;
   line-height: 1.2; 
}

.title {
   color: black;
   font-weight: bold;
   margin-bottom: 2px; /* Reduce el margen inferior */
}

.text {
   color: #C7C7C7;
   font-size: small;
   margin-bottom: 3px; /* Reduce el margen inferior */
    margin-bottom: 2px; /* Reduce el margen inferior */
}

#active-users {
   margin-bottom: 2px; /* Reduce el margen inferior del h1 */
   color: #44B7AC;
}

#total-selling{
   margin-bottom: 2px; /* Reduce el margen inferior del h1 */
   color: #768ABA;
}

#pending-orders{
   margin-bottom: 2px; /* Reduce el margen inferior del h1 */
   color: #30596B;
}

#total-earnings{
   margin-bottom: 2px; /* Reduce el margen inferior del h1 */
   color: #66CE76;
}

.icon-circle-users {
   color: #ffffff; /* Color del icono (blanco) */
   background-color: #44B7AC; /* Fondo del círculo */
   border-radius: 50%; /* Hace el fondo circular */
   padding: 15px; /* Espacio alrededor del icono dentro del círculo */
   font-size: 3em;
}

.icon-circle-sells {
   color: #ffffff; /* Color del icono (blanco) */
   background-color: #768ABA; /* Fondo del círculo */
   border-radius: 50%; /* Hace el fondo circular */
   padding: 15px; /* Espacio alrededor del icono dentro del círculo */
   font-size: 3em;
}

.icon-circle-orders {
   color: #ffffff; /* Color del icono (blanco) */
   background-color: #30596B; /* Fondo del círculo */
   border-radius: 50%; /* Hace el fondo circular */
   padding: 15px; /* Espacio alrededor del icono dentro del círculo */
   font-size: 3em;
}

.icon-circle-earnings {
   color: #ffffff; /* Color del icono (blanco) */
   background-color: #66CE76; /* Fondo del círculo */
   border-radius: 50%; /* Hace el fondo circular */
   padding: 15px; /* Espacio alrededor del icono dentro del círculo */
   font-size: 3em;
}

.stats{
   margin-top: 12.5Svh;
}

#productTable {
   width: 80%; /* Ajusta este valor según necesites */
   margin: 0 auto; /* Centra la tabla dentro del div */
}

#productTable .table {
   max-width: 100%; /* Limita el ancho máximo de la tabla al ancho del contenedor */
   margin: 0 auto; /* Centra el contenido de la tabla */
}

tr{
   justify-content: center;
}

</style>
