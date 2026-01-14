import { createRouter, createWebHistory } from 'vue-router'
import CreateTableView from '../views/CreateTableView.vue'
import HomeView from '../views/HomeView.vue'
import TableView from '../views/TableView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/criar-mesa',
      name: 'create-table',
      component: CreateTableView,
    },
    {
      path: '/mesa/:slug',
      name: 'table',
      component: TableView,
    },
  ],
})

export default router
