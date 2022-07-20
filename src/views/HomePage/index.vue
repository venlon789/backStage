<template>
  <el-container class="container">
    <!-- 头部退出按钮设置 -->
    <el-header class="header">
      <img src="@/assets/KKL.png" alt="" />
      <el-button @click="exitBtn" type="warning" size="mini"
        >退出登录</el-button
      >
    </el-header>
    <!-- 左边侧边的导航栏 -->
    <el-container class="aside">
      <el-aside class="aside-left">
        <div class="openBtn">
          <el-button
            type="info"
            :class="open ? '' : 'activeOpen'"
            :icon="open ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            @click="openFn"
          ></el-button>
        </div>

        <el-menu
          :collapse="open"
          unique-opened
          :router="true"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#38484d"
          text-color="#a4cdf3"
          active-text-color="#ffd04b"
          collapse-transition:false
          :default-active="activeIndex"
        >
          <!-- 遍历一级菜单 -->
          <el-submenu
            :index="item.path"
            v-for="item in userMenus"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>
            <!-- 遍历二级菜单 -->
            <el-menu-item-group
              v-for="ele in item.children"
              :key="ele.id"
              @click.stop.native="getCurrentMenu(item, ele)"
            >
              <el-menu-item :index="ele.path">
                <template slot="title">
                  <i :class="$route.meta.icon"></i>
                  {{ ele.authName }}
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--路由的位置 -->
      <el-main class="main">
        <div v-if="$route.name === 'home' || $route.name === 'reports'">
          欢迎登录开课啦后台！
        </div>
        <router-view v-else></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { userMenusApi } from '@/api/user'
import { removeToken } from '@/utils/auth'
export default {
  created () {
    // 调用获取用户的左侧权限列表
    this.getUserMenus()
  },
  mounted () {
    this.activeIndex = this.$route.name
  },
  data () {
    return {
      isCollapse: true,
      userMenus: [],
      open: false,
      activeIndex: this.$route.name
    }
  },
  methods: {
    fn (val) { },
    // 退出登录的操作
    exitBtn () {
      this.$confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeToken()
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出登录!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    // 左侧导航
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    // 获取用户的左侧权限列表
    async getUserMenus () {
      try {
        const { data: { data } } = await userMenusApi()
        console.log(data)
        this.userMenus = data
      } catch (error) {
        console.log(error)
      }
    },
    openFn () {
      this.open = !this.open
    },
    // 获取当前的菜单
    getCurrentMenu (onemenu, twomenu) {
      this.$store.commit('user/setOnemenu', onemenu.authName)
      this.$store.commit('user/setTwomenu', twomenu.authName)
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.container {
  height: 100vh;
  .el-header {
    background-color: #ffffff;
    border: 1px solid #ebeef5;
  }
  .el-aside {
    background-color: #38484d;
    width: unset !important;
  }
  .el-main {
    background-color: #ffffff;
  }
  // 头部退出按钮设置
  .header {
    position: fixed;
    z-index: 999;
    width: 100vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      height: 40px;
      width: 200px;
    }
    .el-button {
      height: 50px;
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}
:deep(.el-radio-group) {
  margin-bottom: 0 !important;
}
.openBtn {
  .el-button {
    width: 63px;
    border-radius: 0px;
  }
  :deep(.activeOpen) {
    width: 200px !important;
    border: 0;
    background-color: #4e7c85;
    border-color: unset;
  }
}
.el-menu {
  background-color: #38484d;
  color: #ffffff;
}
:deep(.el-submenu__title) {
  color: #ffffff;
}
.main {
  overflow: scroll;
  margin-left: 200px;
}
.aside {
  margin-top: 60px;
}
.aside-left {
  position: fixed;
  height: 100%;
}
.container .header .el-button {
  height: 30px;
}
</style>
