import Vue from 'vue'
import VueRouter from 'vue-router'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomePage'),
    children: [
      {
        path: '/users',
        name: 'users',
        component: () => import('@/views/UserList'),
        meta: { icon: 'el-icon-user-solid' }
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('@/views/RolesListPage'),
        meta: { icon: 'el-icon-s-goods' }
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import('@/views/PowerListRightPage'),
        meta: { icon: 'el-icon-s-management' }
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import('@/views/GoodsListpage'),
        meta: { icon: 'el-icon-s-help' }
      },
      {
        path: '/add',
        component: () => import('@/views/GoodsListpage/view/AddGood.vue')
      },
      {
        path: '/params',
        name: 'params',
        component: () => import('@/views/ClassifyParamsPage'),
        meta: { icon: 'el-icon-s-marketing' }
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('@/views/OrdersListPage'),
        meta: { icon: 'el-icon-s-order' }
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import('@/views/CategoriesPage'),
        meta: { icon: 'el-icon-s-shop' }
      },
      {
        path: '/reports',
        name: 'reports',
        component: () => import('@/views/CategoriesPage'),
        meta: { icon: 'el-icon-s-shop' }
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
