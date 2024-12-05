<template>
  <div class="col-sm-6 stats">
    <div class="row">
      <!-- Contenedor de la gráfica -->
      <div class="col-sm-12">
        <div class="filters mb-3">
          <label for="startMonth">Mes Inicio:</label>
          <select id="startMonth" v-model="startMonth">
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>

          <label for="startYear" class="ml-3">Año Inicio:</label>
          <select id="startYear" v-model="startYear">
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>

          <label for="endMonth" class="ml-3">Mes Fin:</label>
          <select id="endMonth" v-model="endMonth">
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>

          <label for="endYear" class="ml-3">Año Fin:</label>
          <select id="endYear" v-model="endYear">
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>

          <button class="btn btn-primary ml-3" @click="updateIncomeChart">
            Generar Gráfica
          </button>
        </div>

        <div id="barChart" class="chart-container">
          <canvas id="incomeChart"></canvas>
          <div class="chart-tooltip" v-show="showTooltip">{{ tooltipContent }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { apiOrden, apiShipments } from "../http-common";
import Chart from "chart.js/auto";

export default {
  setup() {
    const chartInstance = ref<Chart | null>(null); // Almacenar instancia del gráfico
    const monthlyIncome = ref<([string, string] | [string, number])[]>([["Mes", "Ingresos"]]);
    const totalEarnings = ref<number>(0);
    const showTooltip = ref(false); // Control de tooltip
    const tooltipContent = ref<string>("");

    const startMonth = ref(new Date().getMonth() + 1);
    const startYear = ref(new Date().getFullYear());
    const endMonth = ref(new Date().getMonth() + 1);
    const endYear = ref(new Date().getFullYear());

    const months = [
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
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const updateIncomeChart = async () => {
      try {
        const ordersResponse = await apiOrden.getAllOrdenes();
        const shipmentsResponse = await apiShipments.getAllShipments();

        const orders = ordersResponse.response?.pedidosUsuario || [];
        const shipments = shipmentsResponse.response?.shipments || [];

        const filteredShipments = shipments.filter((shipment: any) => {
          const shippingDate = new Date(shipment.shipping_day);
          const start = new Date(startYear.value, startMonth.value - 1, 1);
          const end = new Date(endYear.value, endMonth.value, 0);
          return shippingDate >= start && shippingDate <= end;
        });

        const combinedData = orders
          .map((order: any) => {
            const shipment = filteredShipments.find(
              (s: any) => s.idOrden === order.idOrden
            );
            return shipment ? { ...order, shipment } : null;
          })
          .filter((item: any) => item !== null);

        let monthlyTotals: { [month: string]: number } = {};

        let current = new Date(startYear.value, startMonth.value - 1, 1);
        const end = new Date(endYear.value, endMonth.value - 1, 1);
        while (current <= end) {
          const month = current.toLocaleString("es-ES", { month: "long", year: "numeric" });
          monthlyTotals[month] = 0;
          current.setMonth(current.getMonth() + 1);
        }

        combinedData.forEach((order: any) => {
          const shippingDate = new Date(order.shipment.shipping_day);
          const month = shippingDate.toLocaleString("es-ES", { month: "long", year: "numeric" });
          monthlyTotals[month] += order.total;
        });

        const labels = Object.keys(monthlyTotals);
        const data = Object.values(monthlyTotals);
        const backgroundColors = labels.map(label => monthlyTotals[label] > 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(192, 75, 75, 0.2)');
        const borderColors = labels.map(label => monthlyTotals[label] > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(192, 75, 75, 1)');

        await nextTick();

        const canvasElement = document.getElementById("incomeChart") as HTMLCanvasElement;
        if (canvasElement) {
          if (chartInstance.value) {
            chartInstance.value.destroy();
          }
          const ctx = canvasElement.getContext("2d");
          if (ctx) {
            chartInstance.value = new Chart(ctx, {
              type: "bar",
              data: {
                labels,
                datasets: [{
                  label: 'Ingresos',
                  data,
                  backgroundColor: backgroundColors,
                  borderColor: borderColors,
                  borderWidth: 1
                }]
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });
          } else {
            console.error("Error: No se pudo obtener el contexto del canvas.");
          }
        } else {
          console.error("Error: No se pudo encontrar el elemento canvas.");
        }
      } catch (error) {
        console.error("Error al actualizar la gráfica de ingresos:", error);
      }
    };

    onMounted(() => {
      updateIncomeChart();
    });

    return {
      monthlyIncome,
      totalEarnings,
      showTooltip,
      tooltipContent,
      startMonth,
      startYear,
      endMonth,
      endYear,
      months,
      years,
      updateIncomeChart,
    };
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

.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
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
    height: 250px;
  }
}

.btn {
  background-color: #30596B;
  border-color: #30596B;
  color: #ffffff;
  transition: background-color 0.3s, border-color 0.3s;
}

.btn:hover {
  background-color: #5EAED1;
  border-color: #5EAED1;
}

.btn-primary {
  background-color: #30596B;
  border-color: #30596B;
}

.btn-primary:hover {
  background-color: #5EAED1;
  border-color: #5EAED1;
}

.filters select {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background-color: #ffffff;
  margin-right: 10px;
}

.filters label {
  margin-right: 10px;
  font-weight: bold;
}
</style>
