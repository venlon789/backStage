import request from '@/utils/request'
/**
 *获取商品分类数据列表
 type[1,2,3]值：1，2，3 分别表示显示一层二层三层分类列表
【可选参数】如果不传递，则默认获取所有级别的分类
pagenum当前页码值【可选参数】如果不传递，则默认获取所有分类
pagesize每页显示多少条数据【可选参数】如果不传递，则默认获取所有分类
 * @param {*} param0
 * @returns
 */
export const getGoodsClassifyListApi = ({ type, pagenum, pagesize }) => {
  return request({
    method: 'get',
    url: 'categories',
    params: { type, pagenum, pagesize }
  })
}
// 分类参数管理
// :id分类 ID不能为空携带在url中
// sel[only, many]不能为空, 通过 only 或 many 来获取分类静态参数还是动态参数
export const getClassifyParamApi = (id, sel) => {
  return request({
    method: 'get',
    url: `categories/${id}/attributes`,
    params:
    {
      sel
    }
  })
}
/**
 *:id分类 ID不能为空携带在url中
:attrid参数 ID不能为空携带在url中
 * @param {*} id
 * @param {*} attrid
 * @returns
 */
export const deleteParamApi = (id, attrid) => {
  return request({
    method: 'DELETE',
    url: `categories/${id}/attributes/${attrid}`
  })
}

/** 编辑提交参数
 *:id分类 ID不能为空携带在url中
:attrId属性 ID不能为空携带在url中
attr_name新属性的名字不能为空，携带在请求体中
attr_sel性的类型[many 或 only]不能为空，携带在请求体中
attr_vals参数的属性值可选参数，携带在请求体中
/**
 *
 */
export const editParamApi = (catid, attrid, name, sel) => {
  return request({
    method: 'PUT',
    url: `categories/${catid}/attributes/${attrid}`,
    data: {
      attr_name: name,
      attr_sel: sel
    }
  })
}

export const addParamApi = (id, attrname, sel) => {
  return request({
    method: 'POST',
    url: `categories/${id}/attributes`,
    data: {
      attr_name: attrname,
      attr_sel: sel
    }
  })
}
// 编辑提交参数
export const editCommitParamApi = (id, attrId, attrname, sel, attrval) => {
  return request({
    method: 'PUT',
    url: `categories/${id}/attributes/${attrId}`,
    data: {
      attr_name: attrname,
      attr_sel: sel,
      attr_vals: attrval
    }
  })
}
