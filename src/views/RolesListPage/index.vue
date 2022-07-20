<template>
  <commenCom>
    <!-- 插槽 -->
    <template>
      <el-button type="primary">添加用户</el-button>
      <!-- table部分 -->
      <!-- =============================================== -->
      <el-table border :data="roleList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row
              class="tagBox"
              v-for="item in props.row.children"
              :key="item.id"
            >
              <!-- 第一层 -->
              <el-col :span="6" class="oneFloor">
                <div class="grid-content bg-purple oneFloorTAC">
                  <el-tag>{{ item.authName }}</el-tag>
                </div>
              </el-col>
              <!-- 第二层 -->
              <div class="twoFloorBox">
                <div
                  class="twoFloor"
                  v-for="ele in item.children"
                  :key="ele.id"
                >
                  <!-- 第二层的左边部分 -->
                  <el-col :span="8" class="twoFloor_left">
                    <div class="grid-content bg-purple">
                      <el-tag type="success" @click="fn(props.row)">{{
                        ele.authName
                      }}</el-tag>
                    </div>
                  </el-col>
                  <!-- 第二层的右边部分 -->
                  <el-col :span="16">
                    <div class="grid-content bg-purple twoFloor_right">
                      <el-tag
                        closable
                        :disable-transitions="false"
                        @close="handleClose(props.row, ele.children, child.id)"
                        v-for="child in ele.children"
                        :key="child.id"
                      >
                        {{ child.authName }}
                      </el-tag>
                    </div>
                  </el-col>
                </div>
              </div>
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
              @click.native="getTreeFn(scope)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限弹出层组件 -->
      <TreeDialog
        :dialogVisible.sync="dialogFormVisible"
        :treeList="treeList"
        :currentPowerList="currentPowerList"
        :diguiIDList="diguiIDList"
        @updataRoleRight="updataRoleRight"
      ></TreeDialog>
      <!-- =============================================== -->
      <!-- /table部分 -->
    </template>
  </commenCom>
</template>

<script>
import { roleListApi } from '@/api/user'
import { deleteRoleRigthtIdApi, getTreeListApi, postRoleRigthtApi } from '@/api/roles'
import commenCom from '@/components/commenCom.vue'
import TreeDialog from './components/TreeDialog'
export default {
  name: 'RolesListPage',
  created () {
    // 调用方法 // 获取角色列表
    this.getRoleList()
  },
  data () {
    return {
      dialogFormVisible: false,
      roleList: [],
      // 点击删除标签的时候，获取角色的id
      roleId: '',
      // 点击删除标签的时候，当前标签的id
      tagId: '',
      treeList: [],
      // 当前点击分配权限的时候，将这个角色下的权限列表，传给分配权限弹出层组件
      currentPowerList: [],
      diguiIDList: [],
      currentRoleID: ''
    }
  },
  methods: {
    // 获取角色列表
    async getRoleList () {
      try {
        const { data: { data } } = await roleListApi()
        this.roleList = data
        console.log(this.roleList)
      } catch (error) {
        console.log(error)
      }
    },
    async handleClose (props, child, id) {
      this.roleId = props.id
      this.tagId = id
      const index = child.findIndex(item => item.id === id)
      this.$confirm('此操作将删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const { data: { meta } } = await deleteRoleRigthtIdApi(this.roleId, this.tagId)
          if (meta.status === 200) {
            child.splice(index, 1)
            this.$message.success(meta.msg)
          } else {
            this.$message.error('操作失败')
          }
        } catch (error) {
          this.$message.error('操作失败')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })

      // this.dynamicTags.splice(this.dynamicTags.indexOf(tagID), 1)
    },

    fn (val) {
      console.log(val)
    },
    // 获取权限树状
    async getTreeFn (val) {
      // 当前点击分配权限的时候，将这个角色下的权限列表，传给分配权限弹出层组件
      this.currentPowerList = val.row
      this.currentRoleID = val.row.id
      console.log(this.currentRoleID)
      this.dialogFormVisible = true
      const { data } = await getTreeListApi()
      this.treeList = data.data
      this.dialogFormVisible = true
      this.diguiIDList = []
      this.diguiFn(this.currentPowerList.children)
    },
    // 递归处理每次点击分配按钮，传给组件的id数组
    diguiFn (list) {
      list.forEach(item => {
        this.diguiIDList.push(item.id)
        if (item.children) {
          return this.diguiFn(item.children)
        }
        return this.diguiIDList
      })
    },
    async updataRoleRight (val) {
      console.log(val)
      console.log(this.currentRoleID)
      try {
        const res = await postRoleRigthtApi(this.currentRoleID, val)
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
          // 调用方法 // 获取角色列表
          this.getRoleList()
        } else {
          this.$message.error(res.data.meta.msg)
        }

        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: { commenCom, TreeDialog }
}
</script>

<style scoped lang="less">
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
  margin-top: 8px;
  margin-bottom: 8px;
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
  display: flex;
  border-top: 1px solid #eee;
  .oneFloor {
    flex: 6;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .twoFloorBox {
    flex: 18;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    .twoFloor {
      display: flex;
      border-bottom: 1px solid #eee !important;
      margin-bottom: 5px;
      .twoFloor_left {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
  }
}
.oneFloorTAC {
  text-align: center;
}
.el-table {
  margin-top: 30px;
}
</style>
