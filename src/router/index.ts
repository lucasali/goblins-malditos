import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MesaDoMestreView from '../views/MesaDoMestreView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/mesa-do-mestre',
      name: 'mesa-do-mestre',
      component: MesaDoMestreView,
    },
  ],
})

export default router
