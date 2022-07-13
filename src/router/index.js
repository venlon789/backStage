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
    component: () => import('@/views/HomePage'),
    children: [
      {
        path: '/users',
        name: 'users',
        component: () => import('@/views/UserList')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('@/views/RolesListPage')
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
