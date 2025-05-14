import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import UsersView from '../views/UsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/layouts',
      component: () => import('../layouts/Pagelayout.vue'),
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: '/users',
          name: 'users',
          component: UsersView,
        },
      ],
    },
  ],
})

export default router
