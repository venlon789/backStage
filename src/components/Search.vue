<template>
  <el-row>
    <el-col :span="12" class="searchComponent">
      <el-input
        placeholder="请输入内容"
        v-model="inputSearch"
        class="input-with-select"
        @change="getSearchValue(inputSearch)"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="$emit('getSearch', inputSearch)"
        ></el-button>
      </el-input>
      <!-- 插槽 -->
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script>
export default {
  created () { },
  data () {
    return {
      inputSearch: ''
    }
  },
  methods: {
    getSearchValue (val) {
      console.log(val)
      this.$emit('getSearch', val)
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang="less">
.searchComponent {
  display: flex;
  .el-input-group {
    min-width: 300px;
    margin-right: 15px;
  }
}
</style>
