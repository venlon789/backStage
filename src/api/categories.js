import request from '@/utils/request'
// 商品分类数据列表
// 筛选的那个区域，也可以使用这个接口，就是只需要传type就可以
export const getCategoriesListApi = ({
  type,
  pagenum,
  pagesize
}) => {
  return request({
    method: 'get',
    url: 'categories',
    params: {
      type,
      pagenum,
      pagesize
    }
  })
}
// 添加分类
export const addCategorieApi = ({ catpid, catlevel, catname }) => {
  return request({
    url: 'categories',
    method: 'POST',
    data: { cat_pid: catpid, cat_level: catlevel, cat_name: catname }
  })
}
