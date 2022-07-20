import request from '@/utils/request'
/**
 *获取list 列表显示权限
 * @param {*} param0
 * @returns
 */
export const getRightListApi = () => {
  return request({
    method: 'get',
    url: 'rights/list'
  })
}
