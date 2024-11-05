<template>
  <div id="productTable" class="table-responsive">
    <h6>Los productos más vendidos</h6>
    <table class="table table-bordered">
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
/* Aquí puedes agregar estilos adicionales si es necesario */
</style>
