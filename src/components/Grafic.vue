<template>
  <div class="col-sm-12 stats">
    <div class="row">
      <div class="col-sm-6">
        <div id="barChart" class="chart-container">
          <div class="chart-tooltip" v-show="showTooltip">{{ tooltipContent }}</div>
        </div>
      </div>
      <div class="col-sm-6 mt-4">
        <transition name="fade">
          <div id="productTable" class="table-responsive" v-show="showTable">
            <h6 class="table-title">Los productos más vendidos</h6>
            <table class="table table-bordered table-hover">
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
        </transition>
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
    const showTooltip = ref<boolean>(false);
    const tooltipContent = ref<string>('');
    const products: { [key: string]: string[][] } = {
      'Enero': [['001', 'Producto A', '100', '$10'], ['002', 'Producto B', '50', '$15']],
      'Febrero': [['003', 'Producto C', '70', '$12'], ['004', 'Producto D', '30', '$20']],
      'Marzo': [['005', 'Producto E', '90', '$8'], ['006', 'Producto F', '60', '$11']],
      'Abril': [['007', 'Producto G', '120', '$7'], ['008', 'Producto H', '80', '$9']],
      'Mayo': [['009', 'Producto I', '150', '$10'], ['010', 'Producto J', '90', '$14']],
      'Junio': [['011', 'Producto K', '200', '$13'], ['012', 'Producto L', '110', '$8']],
      'Julio': [['013', 'Producto M', '130', '$7'], ['014', 'Producto N', '70', '$6']],
      'Agosto': [['015', 'Producto O', '140', '$9'], ['016', 'Producto P', '120', '$10']],
      'Septiembre': [['017', 'Producto Q', '160', '$5'], ['018', 'Producto R', '140', '$15']],
      'Octubre': [['019', 'Producto S', '170', '$18'], ['020', 'Producto T', '130', '$12']],
      'Noviembre': [['021', 'Producto U', '180', '$17'], ['022', 'Producto V', '160', '$20']],
      'Diciembre': [['023', 'Producto W', '200', '$19'], ['024', 'Producto X', '190', '$22']],
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
        colors: ['#30596B', '#33FF57', '#3357FF', '#F3FF33', '#FF33A1', '#33FFF8', '#FF8333'],
        backgroundColor: { fill: '#f8f9fa' },
      };

      const chart = new (window as any).google.visualization.BarChart(document.getElementById('barChart'));

      (window as any).google.visualization.events.addListener(chart, 'onmouseover', (event: any) => {
        const month = data.getValue(event.row, 0);
        showProductTable(month);
        showTooltip.value = true;
        tooltipContent.value = `Ingresos de ${month}: $${data.getValue(event.row, 1)}`;
      });

      (window as any).google.visualization.events.addListener(chart, 'onmouseout', () => {
        hideProductTable();
        showTooltip.value = false;
      });

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
      showTooltip,
      tooltipContent,
    };
  },
});
</script>

<style scoped>
.stats {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.chart-container:hover {
  transform: scale(1.02);
}

.chart-tooltip {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  display: none;
}

.chart-container:hover .chart-tooltip {
  display: block;
}

.table-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #333;
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

.table-bordered {
  border: none;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}

.table-bordered th {
  border-bottom: 2px solid #30596B;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 576px) {
  .chart-container {
    height: 300px;
  }
}
</style>