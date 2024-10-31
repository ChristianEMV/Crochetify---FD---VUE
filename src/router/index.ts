import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import process from "process";
import Login from "../views/Login.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "login", component: Login },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
