// auth -> authorization 身份认证 鉴权
import Cookies from 'js-cookie'

const TokenKey = 'KAIKELA'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
