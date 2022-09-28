import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import NewExpense from "./views/NewExpense.vue";
import Expenses from "./views/Expenses.vue";
import TodoList from "./views/TodoList.vue";
import store from "./store";

const routes = [
  { name: "Home", path: "/", component: Home },
  { name: "Login", path: "/login", component: Login },
  { name: "NewExpense", path: "/expenses/new", component: NewExpense },
  { name: "Expenses", path: "/expenses", component: Expenses },
  { name: "TodoList", path: "/todo", component: TodoList },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (!store.user && to.name !== "Login") {
    return { name: "Login" };
  }
});

export default router;
