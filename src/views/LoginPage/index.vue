<template>
  <div class="main">
    <div class="login-container">
      <div class="from-box">
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item class="text-login">
            <img class="login-img" src="@/assets/KKLlogo.png" alt="" />
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              prefix-icon="el-icon-user-solid"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item class="btn-item">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <vue-particles color="#dedede"></vue-particles>
  </div>
</template>

<script>
import { userLoginApi } from '@/api/user'
export default {
  created () {
  },
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '输入3-8位数的用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, max: 8, message: '输入3-8位数的密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录校验
    async login () {
      try {
        await this.$refs.loginFormRef.validate()
        try {
          const res = await userLoginApi(this.loginForm)
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            this.$router.push('/home')
            // 存储token还没做===========================
            this.$store.commit('user/setToken', res.data.data.token)
          } else {
            this.$message.error(res.data.meta.msg)
          }
        } catch (error) {

        }
      } catch (err) {
        this.$message.error('校验失败')
      }
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.main {
  width: 100wh;
  height: 100vh;
}
.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #4785c4;
  display: flex;
  justify-content: center;
  align-items: center;
  .from-box {
    padding: 50px 30px;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 15px;
    text-align: center;
    .text-login h3 {
      font-size: 30px;
      font-weight: normal;
    }
    .login-img {
      height: 50px;
      width: 200px;
    }
    .btn-item {
      text-align: right;
    }
  }
}
</style>
