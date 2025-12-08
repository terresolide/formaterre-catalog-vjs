import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useLoaderState} from '@/stores/loaderState.js'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/map',
      name: 'map',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/MapView.vue'),
    },
    {
      path: '/grid',
      name: 'grid',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GridView.vue'),
    },
    {
      path: '/charter/:id',
      name: 'charter',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CharterView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SearchView.vue'),
    }, {
      path: '/metadata/:id',
      name: 'metadata',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GridView.vue'),
    }, {
      path: '/:catalog/metadata/:id',
      name: 'catalog-metadata',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GridView.vue'),
    }, {
      path: '/:catalog/map',
      name: 'catalog-map',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/MapView.vue'),
    },
    {
      path: '/:catalog/grid',
      name: 'catalog-grid',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GridView.vue'),
    },
    {
      path: '/:catalog/search',
      name: 'catalog-search',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SearchView.vue'),
    },
  ]
})
router.beforeEach((to, from, next) => {
    const isLoading = useLoaderState();
    const { changeStateTrue } = isLoading;
    changeStateTrue()
    next()
 })
 router.afterEach((to, from) => {
    const isLoading = useLoaderState();
    const { changeStateFalse } = isLoading;
    changeStateFalse()
})
export default router
