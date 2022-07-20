<template>
  <div>
    <!-- 顶部的公共组件 -->
    <commenComfrom>
      <!-- table部分 -->
      <el-table border :data="rightList" stripe style="width: 100%">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="leval" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">等级一</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success"
              >等级二</el-tag
            >
            <el-tag v-else-if="scope.row.level === '2'" type="warning"
              >等级三</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </commenComfrom>
  </div>
</template>

<script>
import { getRightListApi } from '@/api/right'
import commenComfrom from '@/components/commenCom.vue'
export default {
  name: 'PowerListRightPage',
  created () {
    this.getRightList()
  },
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightList () {
      try {
        const res = await getRightListApi()
        console.log(res)
        this.rightList = res.data.data
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
  components: { commenComfrom }
}
</script>

<style scoped>
</style>
