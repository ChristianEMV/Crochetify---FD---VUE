<template>
    <div class="col-sm-12 stats">
      <div class="row">
        <div class="col-sm-6">
          <div id="barChart" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="col-sm-6" style="margin-top: 2.5vh;">
          <div id="productTable" class="table-responsive" v-show="showTable">
            <h6>Los productos más vendidos</h6>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th><i class="fas fa-award"></i></th>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Precio U.</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in selectedProducts" :key="product[0]">
                  <td>{{ product[0] }}</td>
                  <td>{{ product[1] }}</td>
                  <td>{{ product[2] }}</td>
                  <td>{{ product[3] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  
  export default defineComponent({
    setup() {
      const selectedProducts = ref<string[][]>([]);
      const showTable = ref<boolean>(false);
      const products: { [key: string]: string[][] } = {
        'Enero': [['001', 'Producto A', 100, '$10'], ['002', 'Producto B', 50, '$15']],
        'Febrero': [['003', 'Producto C', 70, '$12'], ['004', 'Producto D', 30, '$20']],
        'Marzo': [['005', 'Producto E', 90, '$8'], ['006', 'Producto F', 60, '$11']],
        'Abril': [['007', 'Producto G', 120, '$7'], ['008', 'Producto H', 80, '$9']],
        'Mayo': [['009', 'Producto I', 150, '$10'], ['010', 'Producto J', 90, '$14']],
        'Junio': [['011', 'Producto K', 200, '$13'], ['012', 'Producto L', 110, '$8']],
        'Julio': [['013', 'Producto M', 130, '$7'], ['014', 'Producto N', 70, '$6']],
        'Agosto': [['015', 'Producto O', 140, '$9'], ['016', 'Producto P', 120, '$10']],
        'Septiembre': [['017', 'Producto Q', 160, '$5'], ['018', 'Producto R', 140, '$15']],
        'Octubre': [['019', 'Producto S', 170, '$18'], ['020', 'Producto T', 130, '$12']],
        'Noviembre': [['021', 'Producto U', 180, '$17'], ['022', 'Producto V', 160, '$20']],
        'Diciembre': [['023', 'Producto W', 200, '$19'], ['024', 'Producto X', 190, '$22']],
      };
  
      const drawChart = () => {
        const data = (window as any).google.visualization.arrayToDataTable([
          ['Mes', 'Ingresos'],
          ['Enero', 4000],
          ['Febrero', 3000],
          ['Marzo', 2000],
          ['Abril', 5000],
          ['Mayo', 6000],
          ['Junio', 7000],
          ['Julio', 8000],
          ['Agosto', 9000],
          ['Septiembre', 10000],
          ['Octubre', 11000],
          ['Noviembre', 12000],
          ['Diciembre', 13000],
        ]);
  
        const options = {
          title: 'Informe de Ingresos por Mes',
          height: 350,
          bar: { groupWidth: '95%' },
          legend: { position: 'none' },
          colors: ['#4CAF50'],
        };
  
        const chart = new (window as any).google.visualization.BarChart(document.getElementById('barChart'));
  
        (window as any).google.visualization.events.addListener(chart, 'onmouseover', (event: any) => {
          const month = data.getValue(event.row, 0);
          showProductTable(month);
        });
  
        (window as any).google.visualization.events.addListener(chart, 'onmouseout', hideProductTable);
  
        chart.draw(data, options);
      };
  
      const showProductTable = (month: string) => {
        selectedProducts.value = products[month] || [];
        showTable.value = selectedProducts.value.length > 0;
      };
  
      const hideProductTable = () => {
        showTable.value = false;
      };
  
      onMounted(() => {
        (window as any).google.charts.load('current', { packages: ['corechart', 'bar'] });
        (window as any).google.charts.setOnLoadCallback(drawChart);
      });
  
      return {
        selectedProducts,
        showTable,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Estilos adicionales si es necesario */
  </style>
  