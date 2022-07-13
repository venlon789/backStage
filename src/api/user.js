import request from '@/utils/request'
/**
 *登录
 * @param {*} param0
 * @returns
 */
export const userLoginApi = ({ username, password }) => {
  return request({
    method: 'POST',
    url: 'login',
    data: { username, password }
  })
}
/**
 *获取左侧边栏的菜单栏数据
 * @returns
 */
export const userMenusApi = () => {
  return request({
    method: 'GET',
    url: 'menus'
  })
}
/**
 *获取用户的信息
 query查询参数可以为空
pagenum当前页码不能为空
pagesize每页显示条数不能为空
 * @param {*} param0
 * @returns
 */
export const getUserInfoApi = ({
  query,
  pagenum,
  pagesize
}) => {
  return request({
    url: 'users',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}
// 添加用户信息
/**
 *username用户名称不能为空
password用户密码不能为空
email邮箱可以为空
mobile手机号可以为空
 * @param {*} param0
 * @returns
 */
export const addUserInfoApi = ({
  username,
  password,
  email,
  mobile
}) => {
  return request({
    url: 'users',
    method: 'POST',
    data: {
      username,
      password,
      email,
      mobile
    }
  })
}
// 修改用户状态
export const changeStateApi = (uId, type) => {
  return request({
    url: `users/${uId}/state/${type}`,
    method: 'PUT'
  })
}
// 编辑用户提交
export const editUserApi = (id, mobile, email) => {
  return request({
    url: `users/${id}`,
    method: 'PUT',
    data: {
      mobile,
      email
    }
  })
}
// 用户删除的操作
export const delectUserApi = (id) => {
  return request({
    url: `users/${id}`,
    method: 'DELETE'
  })
}
// 角色列表
export const roleListApi = () => {
  return request({
    url: 'roles'
  })
}
//  分配用户角色
export const roleUserApi = (id, rid) => {
  return request({
    url: `users/${id}/role`,
    method: 'put',
    data: {
      rid
    }
  })
}
