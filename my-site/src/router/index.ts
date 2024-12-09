import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import process from "process";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Categories from "../views/Categories.vue";
import Products from "../views/Products.vue";
import Stock from "../views/Stock.vue";
import Orders from "../views/Orders.vue";
import Shipments from "../views/Shipments.vue";
import Users from "../views/Users.vue";
import FullShipments from "@/views/FullShipments.vue";
import authService from "../authService";
import ErrorPage from "@/views/Error.vue";
import Landingpage from "@/views/Landingpage.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "landingpage" },
  {path:"/landingpage", name:"landingpage", component: Landingpage},
  { path: "/login", name: "login", component: Login },
  { path: "/home", name: "home", component: Home, meta: { requiresAdmin: true } },
  { path: "/categories", name: "categories", component: Categories, meta: { requiresAdmin: true } },
  { path: "/products", name: "products", component: Products, meta: { requiresAdmin: true } },
  { path: "/stock", name: "stock", component: Stock, meta: { requiresAdmin: true } },
  { path: "/orders", name: "orders", component: Orders, meta: { requiresAdmin: true } },
  { path: "/shipments", name: "shipments", component: Shipments, meta: { requiresAdmin: true } },
  { path: "/fullshipments", name: "fullshipments", component: FullShipments, meta: { requiresAdmin: true } },
  { path: "/users", name: "users", component: Users, meta: { requiresAdmin: true } }, 
  { path: "/:pathMatch(.*)*", name: "not-found", component: ErrorPage },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated(); 
  const isAdmin = authService.isAdmin(); 

  if (to.meta.requiresAdmin && !isAuthenticated) {
    next({ name: 'login' });
  } 
  
  else if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'home' }); 
  } 
  
  else {
    next(); 
  }
});

export default router;