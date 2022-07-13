<template>
  <commenCom>
    <!-- 插槽 -->
    <template>
      <el-button type="primary">添加用户</el-button>
      <!-- table部分 -->
      <!-- =============================================== -->
      <el-table border :data="roleList" style="width: 100%">
        <el-table-column type="expand">
          <!-- <template slot-scope="props"> -->
          <!-- <el-form label-position="left" inline class="demo-table-expand"> -->
          <!-- <el-form-item label="商品名称"> -->
          <!-- <span>{{ props.row.name }}</span> -->
          <!-- </el-form-item> -->
          <!-- </el-form> -->
          <template slot-scope="props">
            <el-row class="tagBox">
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-tag v-for="item in props.row.children" :key="item.id">{{
                    item.authName
                  }}</el-tag>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <el-tag type="success" @click="fn(props.row)">123</el-tag>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-tag
                    :key="tag"
                    v-for="tag in dynamicTags"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" prop="desc">
          <!-- 编辑 -->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit">编辑 </el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <!-- 分配角色 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="getTreeFn(scope)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- =============================================== -->
      <!-- /table部分 -->
    </template>
  </commenCom>
</template>

<script>
import { roleListApi } from '@/api/user'
import commenCom from '@/components/commenCom.vue'
export default {
  name: 'RolesListPage',
  created () {
    // 调用方法 // 获取角色列表
    this.getRoleList()
  },
  data () {
    return {
      roleList: [],
      dynamicTags: ['标签一', '标签二', '标签三']
    }
  },
  methods: {
    // 获取角色列表
    async getRoleList () {
      try {
        const { data: { data } } = await roleListApi()
        this.roleList = data
      } catch (error) {
        console.log(error)
      }
    },
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    fn (val) {
      console.log(val)
    },
    // 获取权限树状
    getTreeFn (val) {
      console.log(val)
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: { commenCom }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
/* 装标签的盒子 */
.tagBox {
  padding: 20px 40px;
}
</style>
