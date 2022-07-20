<template>
  <div>
    <commenCom>
      <!-- 插槽 -->
      <template>
        <!-- 搜索的组件 -->
        <Search @getSearch="searchFn">
          <!-- 默认插槽 -->
          <template>
            <el-button type="primary" @click="$router.push('/add')"
              >添加商品</el-button
            ></template
          >
        </Search>
        <!-- 表单table内容 -->
        <el-table border :data="goodsList" stripe style="width: 100%">
          <el-table-column type="index" width="50" label="#"> </el-table-column>
          <el-table-column
            prop="goods_name"
            label="商品名称"
            :show-overflow-tooltip="true"
            width="500"
          >
          </el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)">
          </el-table-column>
          <el-table-column prop="goods_weight" label="商品重量">
          </el-table-column>
          <el-table-column prop="upd_time" label="创建时间">
            <template>
              <!-- slot-scope="scope" -->
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <!-- 编辑 -->
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="editUserBtn(scope.row)"
                >编辑
              </el-button>
              <!-- 删除 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="delectUserFn(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页-->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="goodsListTotal"
          >
          </el-pagination>
        </div>
      </template>
    </commenCom>
  </div>
</template>

<script>
import { getGoodsListApi } from '@/api/goods'
import Search from '@/components/Search.vue'
import commenCom from '@/components/commenCom.vue'
export default {
  created () {
    // 获取商品列表请求
    this.getGoodsList()
  },
  data () {
    return {
      // 操作
      currentPage: 1,
      // 传给后台的数据
      goodsApiObj: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品列表
      goodsList: [],
      editFormVisible: false,
      roleVisible: false,
      formLabelWidth: '120px',
      goodsListTotal: null
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      try {
        const res = await getGoodsListApi(this.goodsApiObj)
        console.log(res)
        this.goodsList = res.data.data.goods
        this.goodsListTotal = res.data.data.total
        this.$message.success('数据获取成功，请查看结果')
      } catch (error) {
        console.log(error)
      }
    },
    // 搜索的fn
    searchFn (val) {
      console.log(val)
      this.goodsApiObj.query = val
      this.getGoodsList()
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.goodsApiObj.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.goodsApiObj.pagenum = val
      this.currentPage = val
      this.getGoodsList()
    },
    // 删除操作
    delectUserFn () { },
    // 编辑操作
    editUserBtn () { }
  },
  computed: {},
  watch: {},
  filters: {},
  components: { commenCom, Search }
}
</script>

<style scoped>
.block {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
</style>
