import store from '@/store'
import axios from 'axios'
const request = axios.create({
  baseURL: 'http://liufusong.top:8899/api/private/v1/',
  timeout: 8000
})
request.interceptors.request.use(function (config) {
  if (store.state.user && store.state.user.token) {
    config.headers.authorization = store.state.user.token
  }
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
export default request
