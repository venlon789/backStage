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
        meta: { icon: 'el-icon-user-solid', onemenu: '用户管理', twomenu: '用户列表' }
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('@/views/RolesListPage'),
        meta: { icon: 'el-icon-s-goods', onemenu: '权限管理', twomenu: '角色列表' }
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import('@/views/PowerListRightPage'),
        meta: { icon: 'el-icon-s-management', onemenu: '权限管理', twomenu: '权限列表' }
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import('@/views/GoodsListpage'),
        meta: { icon: 'el-icon-s-help', onemenu: '商品管理', twomenu: '商品列表' }
      },
      {
        path: '/add',
        component: () => import('@/views/GoodsListpage/view/AddGood.vue'),
        meta: { onemenu: '商品管理', twomenu: '添加商品' }
      },
      {
        path: '/params',
        name: 'params',
        component: () => import('@/views/ClassifyParamsPage'),
        meta: { icon: 'el-icon-s-marketing', onemenu: '商品管理', twomenu: '分类参数' }
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('@/views/OrdersListPage'),
        meta: { icon: 'el-icon-s-order', onemenu: '订单管理', twomenu: '订单列表' }
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import('@/views/CategoriesPage'),
        meta: { icon: 'el-icon-s-shop', onemenu: '商品管理', twomenu: '商品分类' }
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
