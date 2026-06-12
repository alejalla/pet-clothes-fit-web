import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/profile', name: 'profile', component: () => import('../pages/Profile.vue') },
    { path: '/measure', name: 'measure', component: () => import('../pages/Measure.vue') },
    { path: '/designer', name: 'designer', component: () => import('../pages/Designer.vue') },
    { path: '/result', name: 'result', component: () => import('../pages/Result.vue') },
    { path: '/plans', name: 'plans', component: () => import('../pages/MyPlans.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
