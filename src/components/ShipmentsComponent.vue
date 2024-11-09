<template>
    <div>
 
      <div class="header">
        <div class="header-wrapper">
          <h3><i class="fas fa-truck"></i> Envíos</h3>
        </div>
        <div class="container mt-2 bg-light">
          <div class="table-responsive">
            <table class="table table-striped table-hover table-sm">
              <thead>
                <tr>
                  <th class="text-muted small">ID Pedido</th>
                  <th class="text-muted small">
                    Fecha Envío
                    <input
                      type="date"
                      class="form-control"
                      v-model="shippingDate"
                      @change="filterShipments"
                      :class="{'d-none': !isShippingDateVisible}"
                    />
                    <button
                      class="btn btn-outline-secondary btn-sm mt-1"
                      type="button"
                      @click="showPicker('shipping')"
                    >
                      <i class="fas fa-calendar-alt"></i>
                    </button>
                  </th>
                  <th class="text-muted small">
                    Fecha Entrega
                    <input
                      type="date"
                      class="form-control"
                      v-model="deliveryDate"
                      @change="filterShipments"
                      :class="{'d-none': !isDeliveryDateVisible}"
                    />
                    <button
                      class="btn btn-outline-secondary btn-sm mt-1"
                      type="button"
                      @click="showPicker('delivery')"
                    >
                      <i class="fas fa-calendar-alt"></i>
                    </button>
                  </th>
                  <th class="text-muted small">
                    <select
                      class="form-select form-select-sm"
                      v-model="confirmationFilter"
                      @change="filterShipments"
                    >
                      <option value="">Confirmación</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="sin confirmar">Sin Confirmar</option>
                    </select>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="shipment in paginatedShipments" :key="shipment.id">
                  <td>{{ shipment.id }}</td>
                  <td>
                    <input
                      type="date"
                      class="form-control form-control-sm"
                      v-model="shipment.shippingDate"
                      @change="updateDate(shipment.id, 'shipping', shipment.shippingDate)"
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      class="form-control form-control-sm"
                      v-model="shipment.deliveryDate"
                      @change="updateDate(shipment.id, 'delivery', shipment.deliveryDate)"
                    />
                  </td>
                  <td :class="{'text-success': shipment.confirmation === 'confirmado', 'text-danger': shipment.confirmation === 'sin confirmar'}">
                    {{ shipment.confirmation }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Paginación -->
          <nav aria-label="Page navigation">
            <ul class="pagination pagination-sm justify-content-center">
              <li
                v-for="page in totalPages"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
              >
                <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from "vue";
  import Navbar from "@/components/Navbar.vue";
  
  export default defineComponent({
    name: "Dashboard",
    components: { Navbar },
    setup() {
      const shipments = ref(
        Array.from({ length: 100 }, (v, i) => ({
          id: i + 1,
          shippingDate: "",
          deliveryDate: "",
          confirmation: i % 2 === 0 ? "confirmado" : "sin confirmar",
        }))
      );
  
      const rowsPerPage = ref(10);
      const currentPage = ref(1);
      const shippingDate = ref("");
      const deliveryDate = ref("");
      const confirmationFilter = ref("");
      const isShippingDateVisible = ref(false);
      const isDeliveryDateVisible = ref(false);
  
      const filterShipments = () => {
        currentPage.value = 1; // Reset page when applying filters
      };
  
      const filteredShipments = computed(() => {
        let filtered = shipments.value;
  
        if (shippingDate.value) {
          filtered = filtered.filter(
            (shipment) => shipment.shippingDate === shippingDate.value
          );
        }
  
        if (deliveryDate.value) {
          filtered = filtered.filter(
            (shipment) => shipment.deliveryDate === deliveryDate.value
          );
        }
  
        if (confirmationFilter.value) {
          filtered = filtered.filter(
            (shipment) => shipment.confirmation === confirmationFilter.value
          );
        }
  
        return filtered;
      });
  
      const paginatedShipments = computed(() => {
        const start = (currentPage.value - 1) * rowsPerPage.value;
        return filteredShipments.value.slice(start, start + rowsPerPage.value);
      });
  
      const totalPages = computed(() => {
        return Math.ceil(filteredShipments.value.length / rowsPerPage.value);
      });
  
      const showPicker = (type: string) => {
        if (type === "shipping") {
          isShippingDateVisible.value = !isShippingDateVisible.value;
        } else if (type === "delivery") {
          isDeliveryDateVisible.value = !isDeliveryDateVisible.value;
        }
      };
  
      const goToPage = (page: number) => {
        currentPage.value = page;
      };
  
      const updateDate = (id: number, type: string, date: string) => {
        const shipment = shipments.value.find((s) => s.id === id);
        if (shipment) {
          if (type === "shipping") {
            shipment.shippingDate = date;
          } else if (type === "delivery") {
            shipment.deliveryDate = date;
          }
        }
      };
  
      return {
        shipments,
        rowsPerPage,
        currentPage,
        shippingDate,
        deliveryDate,
        confirmationFilter,
        isShippingDateVisible,
        isDeliveryDateVisible,
        paginatedShipments,
        totalPages,
        showPicker,
        goToPage,
        updateDate,
        filterShipments,
      };
    },
  });
  </script>
  
  <style scoped>
  .header {
    width: 100%;
    height: 25vh;
    background: linear-gradient(135deg, #30596B, #5EAED1);
    color: white;
    padding: 20px;
  }
  </style>
  