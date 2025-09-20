import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import MenuView from "@/views/MenuView.vue";
import TradeView from "@/views/TradeView.vue";
import UserHistoryView from "@/views/UserHistoryView.vue";
import GlobalHistoryView from "@/views/GlobalHistoryView.vue";
import SelectItemView from "@/views/SelectItemView.vue";
import DashboardView from "@/views/DashboardView.vue";
import GuideView from "@/views/GuideView.vue";
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/menu",
    name: "menu",
    component: MenuView,
  },
  {
    path: "/trade",
    name: "trade",
    component: TradeView,
  },
  {
    path: "/guide",
    name: "guide",
    component: GuideView,
  },
  { 
    path: "/user_history",
    name: "user_history",
    component: UserHistoryView,
  },
  {
    path: "/global_history",
    name: "global_history",
    component: GlobalHistoryView,
  },
  {
    path: "/select_item",
    name: "select_item",
    component: SelectItemView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/dashboard/:itemName",
    name: "dashboard_item",
    component: DashboardView,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
