<template>
  <div class="col-sm-12 stats">
    <div class="row">
      <!-- Contenedor de la tabla -->
      <div class="col-sm-12">
        <div class="filters mb-3">
          <label for="year">Año:</label>
          <select id="year" v-model="selectedYear" @change="fetchData">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>

          <label for="month" class="ml-3">Mes:</label>
          <select id="month" v-model="selectedMonth" @change="fetchData">
            <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
          </select>
        </div>

        <table class="table table-hover table-bordered">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad Vendida</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in topProducts" :key="product.idProduct">
              <td>{{ product.name }}</td>
              <td>{{ product.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { apiOrden, apiShipments } from '../http-common'; // Asegúrate de que la ruta sea correcta

export default {
  data() {
    return {
      orders: [],
      shipments: [],
      topProducts: [],
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      years: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),  // Añadir más años
      months: [
        { label: "Enero", value: 1 },
        { label: "Febrero", value: 2 },
        { label: "Marzo", value: 3 },
        { label: "Abril", value: 4 },
        { label: "Mayo", value: 5 },
        { label: "Junio", value: 6 },
        { label: "Julio", value: 7 },
        { label: "Agosto", value: 8 },
        { label: "Septiembre", value: 9 },
        { label: "Octubre", value: 10 },
        { label: "Noviembre", value: 11 },
        { label: "Diciembre", value: 12 },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const ordersResponse = await apiOrden.getAllOrdenes();
        const shipmentsResponse = await apiShipments.getAllShipments();
        this.orders = ordersResponse.response.pedidosUsuario;
        this.shipments = shipmentsResponse.response.shipments;
        this.filterAndComputeTopProducts();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    filterAndComputeTopProducts() {
      const filteredOrders = this.orders.filter(order => {
        const shipment = this.shipments.find(sh => sh.idOrden === order.idOrden);
        if (!shipment) return false;
        const shippingDate = new Date(shipment.shipping_day);
        return (
          shippingDate.getFullYear() === this.selectedYear &&
          shippingDate.getMonth() + 1 === this.selectedMonth
        );
      });

      const productCounts = {};
      filteredOrders.forEach(order => {
        order.ordenProducts.forEach(product => {
          if (productCounts[product.product.idProduct]) {
            productCounts[product.product.idProduct].quantity += product.quantity;
          } else {
            productCounts[product.product.idProduct] = {
              ...product.product,
              quantity: product.quantity,
            };
          }
        });
      });

      this.topProducts = Object.values(productCounts)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);
    },
  },
};
</script>

<style scoped>
.stats {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
}

.filters label {
  margin-right: 10px;
  font-weight: bold;
}

.filters select {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background-color: #ffffff;
  margin-right: 10px;
}

.table {
  margin-top: 1rem;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table th {
  background-color: #30596B;
  color: #ffffff;
  text-align: center;
}

.table td {
  vertical-align: middle;
  text-align: center;
  color: #495057;
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}

.table-bordered th {
  border-bottom: 2px solid #30596B;
}
</style>
