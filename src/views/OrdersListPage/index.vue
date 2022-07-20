<template>
  <commenCom>
    <Search></Search>
    <!-- 表单table内容 -->
    <el-table border :data="userList" stripe style="width: 100%">
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column prop="order_number" label="订单编号"> </el-table-column>
      <el-table-column prop="order_price" label="订单价格"> </el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="scope">
          <el-button type="success" v-if="scope.row.order_pay === '3'">
            已支付
          </el-button>
          <el-button type="danger" v-else-if="scope.row.order_pay === '0'">
            未支付
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"> </el-table-column>
      <el-table-column prop="update_time" label="下单时间"> </el-table-column>
      <el-table-column prop="address" label="操作">
        <!-- 编辑 -->
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="editUserBtn(scope.row)"
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </commenCom>
</template>

<script>
import { getOrdersListApi } from '@/api/orders'
import commenCom from '@/components/commenCom.vue'
import Search from '@/components/Search.vue'

export default {
  created () {
    this.getOrdersList()
  },
  data () {
    return {
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 10
    }
  },
  methods: {
    async getOrdersList () {
      try {
        const res = await getOrdersListApi({
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
        console.log(res)
        this.userList = res.data.data.goods
      } catch (error) {
        console.log(error)
      }
    },
    fn (val) {
      console.log(val)
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: { commenCom, Search }
}
</script>

<style scoped>
.el-table {
  margin-top: 15px;
}
</style>
