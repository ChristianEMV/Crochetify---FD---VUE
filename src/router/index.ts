import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import process from "process";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
//import Categories from "../views/Categories.vue";
//import Products from "../views/Products.vue";
//import Stock from "../views/Stock.vue";
//import Sales from "../views/Sales.vue";
//import Orders from "../views/Orders.vue";
import Shipments from "../views/Shipments.vue";
//import Error from "../views/Error.vue";
import Users from "../views/Users.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "login", component: Login },
  { path: "/home", name: "home", component: Home },
  { path: "/users", name:"users", component: Users},
  //{ path: "/categories", name: "categories", component: Categories },
  //{ path: "/products", name: "products", component: Products },
  //{ path: "/stock", name: "stock", component: Stock },
  //{ path: "/sales", name: "sales", component: Sales },
  //{ path: "/orders", name: "orders", component: Orders },
  { path: "/shipments", name: "shipments", component: Shipments },
  //{ path: '/:pathMatch(.*)*', redirect: '/Error' }, // Para redirigir a login si la ruta no existe
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
