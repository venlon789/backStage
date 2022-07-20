import request from '@/utils/request'
export const getOrdersListApi = ({
  query,
  pagenum,
  pagesize
}) => {
  return request({
    method: 'get',
    url: 'orders',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}
