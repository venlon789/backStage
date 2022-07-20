<template>
  <div>
    <commenCom>
      <!-- 插槽 -->
      <template>
        <!-- 搜索的组件 -->
        <Search @getSearch="searchFn">
          <!-- 默认插槽 -->
          <template>
            <el-button type="primary" @click="dialogFormVisible = true"
              >添加用户</el-button
            ></template
          >
        </Search>
        <el-dialog title="添加管理员信息" :visible.sync="dialogFormVisible">
          <el-form :model="form" :rules="rules" ref="ruleForm">
            <el-form-item
              label="用户名"
              prop="username"
              :label-width="formLabelWidth"
            >
              <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="密码"
              prop="password"
              :label-width="formLabelWidth"
            >
              <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="邮箱"
              prop="email"
              :label-width="formLabelWidth"
            >
              <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="手机号"
              prop="mobile"
              :label-width="formLabelWidth"
            >
              <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUserFn">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 表单table内容 -->
        <el-table border :data="userList" stripe style="width: 100%">
          <el-table-column type="index" width="50" label="#"> </el-table-column>
          <el-table-column prop="username" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="mobile" label="电话" width="180">
          </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column prop="mg_state" label="状态" width="180">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeSwitch(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <!-- 编辑 -->
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="editUserBtn(scope.row)"
              >
              </el-button>
              <!-- 删除 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="delectUserFn(scope.row)"
              ></el-button>
              <!-- 分配角色 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="roleUserBtn(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 用户编辑弹出层 -->
        <el-dialog title="编辑用户信息" :visible.sync="editFormVisible">
          <el-form :model="editForm" :rules="rules" ref="editFormRef">
            <el-form-item label="用户名称" :label-width="formLabelWidth">
              <el-input v-model="editUserName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item
              label="邮箱"
              prop="email"
              :label-width="formLabelWidth"
            >
              <el-input v-model="editForm.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="手机号"
              prop="mobile"
              :label-width="formLabelWidth"
            >
              <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserFn">确 定</el-button>
          </div>
        </el-dialog>
        <!-- /用户编辑弹出层 -->
        <!-- 分配角色弹出层 -->
        <el-dialog title="收货地址" :visible.sync="roleVisible">
          <p>当前的用户: {{ roleUserName }}</p>
          <p>当前的角色：{{ currentRole }}</p>
          <el-select
            v-model="value"
            placeholder="请选择"
            @change="rid = $event"
          >
            <el-option
              v-for="item in optionsRole"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <div slot="footer" class="dialog-footer">
            <el-button @click="roleVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeRoleNameFn"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <!-- /分配角色弹出层 -->
        <!-- 分页-->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userListTotal"
          >
          </el-pagination>
        </div>
      </template>
    </commenCom>
  </div>
</template>

<script>
import { getUserInfoApi, addUserInfoApi, changeStateApi, editUserApi, delectUserApi, roleListApi, roleUserApi } from '@/api/user'
import Search from '@/components/Search.vue'
import commenCom from '@/components/commenCom.vue'
export default {
  name: 'UserList',
  created () {
    //  打开页面获取users数据
    this.getUserInfo()
  },
  data () {
    // 手机号校验规则
    const mobileValidate = (rule, value, callback) => {
      const reg = /^(?:(?:\+|00)86)?1\d{10}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式不正确'))
      }
    }
    // 密码校验规则
    const passwordValidate = (rule, value, callback) => {
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式不正确'))
      }
    }
    return {
      // 操作
      currentPage: 1,
      // 传给后台的数据
      userApiObj: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 用户数据，遍历使用
      usersDate: null,
      userList: [],
      userListTotal: null,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        moblie: '',
        email: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: passwordValidate, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: mobileValidate, trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      editFormVisible: false,
      roleVisible: false,
      formLabelWidth: '120px',
      // 当前编辑用户的名字
      editUserName: '',
      optionsRole: [],
      value: '',
      //  当前角色用户的名字
      roleUserName: '',
      // 需要修改角色的用户id
      changeUserId: '',
      // 当前角色
      currentRole: '',
      // 角色id
      rid: ''
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.userApiObj.pagesize = val
      this.getUserInfo()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.userApiObj.pagenum = val
      this.currentPage = val
      this.getUserInfo()
    },
    // 打开页面获取users数据
    async getUserInfo () {
      try {
        const { data: { data } } = await getUserInfoApi(this.userApiObj)
        console.log(data)
        this.usersDate = null
        this.usersDate = data
        this.userList = data.users
        this.userListTotal = data.total
        this.$message.success('数据获取成功，请查看结果')
      } catch (error) {
        console.log(error)
      }
    },
    // 改变按钮状态
    async changeSwitch (user) {
      // 调用后台修改接口
      console.log(user)
      console.log(user.id)
      console.log(user.mg_state)
      try {
        const res = await changeStateApi(user.id, user.mg_state)
        console.log(res)
        this.$message.success('用户状态修改成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 搜索栏的
    searchFn (val) {
      console.log(val)
      this.userApiObj.query = val
      this.getUserInfo()
    },
    // 添加用户
    async addUserFn () {
      try {
        const res = await this.$refs.ruleForm.validate()
        console.log(res)
        if (res) {
          this.addUser()
          this.getUserInfo()
          this.dialogFormVisible = false
        }
      } catch (error) {
        this.$message.error('请检查你输入的内容是否符合规范')
      }
    },
    async addUser () {
      try {
        const res = await addUserInfoApi(this.form)
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    // 按钮点击用户信息编辑
    editUserBtn (val) {
      this.editFormVisible = true
      this.editUserName = val.username
      console.log(val)
      this.editForm.id = val.id
    },
    // 确认修改用户信息
    async editUserFn () {
      try {
        const res = await this.$refs.editFormRef.validate()
        console.log(res)
        if (res) {
          this.editUserApi()
          this.getUserInfo()
          this.editFormVisible = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 发送编辑用户提交接口
    async editUserApi (id) {
      try {
        const res = await editUserApi(this.editForm.id, this.editForm.mobile, this.editForm.email)
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    // 用户的删操作
    delectUserFn (val) {
      console.log(val)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delectUserApi(val.id)
          console.log(res)
          if (res.data.meta.status === 200) {
            this.getUserInfo()
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
          } else if (res.data.meta.status === 400) {
            this.$message({
              type: 'error',
              message: res.data.meta.msg
            })
          }
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击分配角色按钮
    async roleUserBtn (val) {
      console.log(val)
      this.roleUserName = val.username
      this.currentRole = val.role_name
      this.changeUserId = val.id
      this.roleVisible = true
      const { data: { data } } = await roleListApi()
      console.log(data)
      this.optionsRole = data
    },
    // 点击确认修改用户角色
    async changeRoleNameFn () {
      try {
        const res = await roleUserApi(this.changeUserId, this.rid)
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error(res.data.meta.msg)
        }
        this.roleVisible = false
      } catch (error) {
        console.log(error)
      }
    }
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
