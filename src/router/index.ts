import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/gallery',
      name: 'Gallery',

      component: () => import('../views/GalleryView.vue')
    },
    {
      path: '/new_offer',
      name: 'Offer',

      component: () => import('../views/OfferView.vue')
    }
  ]
})

export default router
