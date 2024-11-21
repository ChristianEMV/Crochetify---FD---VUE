<template>
  <div id="productTable" class="table-responsive">
    <h6 class="table-title">Los productos más vendidos</h6>
    <table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th><i class="bi bi-award"></i></th>
          <th>Nombre</th>
          <th>Cantidad</th>
          <th>Precio U.</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.quantity }}</td>
          <td>{{ product.unitPrice }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    products: {
      type: Array as () => { id: number; name: string; quantity: number; unitPrice: string }[],
      required: true,
    },
  },
});
</script>

<style scoped>
.table-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: left;
  font-weight: bold;
  color: #333;
}

.table {
  margin-top: 1rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table th {
  background-color: #007bff;
  color: #ffffff;
  text-align: center;
}

.table td {
  vertical-align: middle;
  text-align: center;
  color: #495057;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.table-bordered {
  border: none;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}

.table-bordered th {
  border-bottom: 2px solid #007bff;
}
</style>