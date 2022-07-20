import request from '@/utils/request'
/**
 *获取权限树状
 * @param {*} param0
 * @returns
 */
export const getTreeListApi = () => {
  return request({
    method: 'get',
    url: 'rights/tree'
  })
}
/**
 *
 * @param {*} roleId 角色 ID不能为空
 * @param {*} rightId 权限 ID不能为空
 * @returns
 */
export const deleteRoleRigthtIdApi = (roleId, rightId) => {
  return request({
    method: 'DELETE',
    url: `roles/${roleId}/rights/${rightId}`
  })
}
// 分配按纽，点击之后，实现角色授权
export const postRoleRigthtApi = (roleId, rids) => {
  return request({
    method: 'POST',
    url: `roles/${roleId}/rights`,
    data: {
      rids
    }
  })
}
