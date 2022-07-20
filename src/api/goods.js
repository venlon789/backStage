import request from '@/utils/request'
/**
 *获取商品列表数据
 * @param {*} param0
 * query查询参数可以为空
pagenum当前页码不能为空
pagesize每页显示条数不能为空
 * @returns
 */
export const getGoodsListApi = ({
  query,
  pagenum,
  pagesize
}) => {
  return request({
    method: 'get',
    url: 'goods',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}
// 添加商品
export const addGood = (data) => {
  return request({
    url: 'goods',
    method: 'POST',
    data
  })
}
