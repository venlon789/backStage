import request from '@/utils/request'
/**
 *获取权限树状
 * @param {*} param0
 * @returns
 */
export const treeListApi = () => {
  return request({
    method: 'get',
    url: 'rights/tree'
  })
}
