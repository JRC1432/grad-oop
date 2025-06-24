import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import UsersView from '../views/UsersView.vue'
import ScholarView from '../views/ScholarView.vue'
import SchoolView from '../views/SchoolView.vue'
import FormsView from '../views/FormsView.vue'
import BrochuresView from '../views/BrochuresView.vue'
import LogView from '../views/LogView.vue'

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
          meta: { access_level: 1 },
        },
        {
          path: '/users',
          name: 'users',
          component: UsersView,
        },
        {
          path: '/scholars',
          name: 'scholars',
          component: ScholarView,
        },
        {
          path: '/school',
          name: 'school',
          component: SchoolView,
        },
        {
          path: '/forms',
          name: 'forms',
          component: FormsView,
        },
        {
          path: '/brochure',
          name: 'brochure',
          component: BrochuresView,
        },
        {
          path: '/log',
          name: 'log',
          component: LogView,
        },
      ],
    },
  ],
})

export default router
