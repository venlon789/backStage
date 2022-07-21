<template>
  <div class="box">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $route.meta.onemenu }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $route.meta.twomenu }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容区域 -->
    <el-card class="box-card">
      <slot></slot>
    </el-card>
  </div>
  <!--  -->
</template>

<script>
export default {
  //   // 有homepage传值过来
  data () {
    return {

    }
  },
  methods: {
  },
  computed: {
  },
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.box {
  width: 100%;
  min-width: 1200px;
  .box-card {
    margin-top: 20px;
    width: 100%;
    min-width: 1200px;
  }
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>
