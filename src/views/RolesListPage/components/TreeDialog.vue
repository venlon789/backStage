<template>
  <div>
    <el-dialog
      title="收货地址"
      :visible="dialogVisible"
      @close="$emit('update:dialogVisible', false)"
    >
      <!-- 树 -->
      <el-tree
        :data="treeList"
        show-checkbox
        node-key="id"
        :default-checked-keys="diguiIDList"
        :props="defaultProps"
        :default-expand-all="true"
        ref="treeRef"
      >
      </el-tree>
      <!-- 树 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelTreeFn">取 消</el-button>
        <el-button type="primary" @click="confirmTreeFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'SrcIndexCopy',
  props: {
    dialogVisible: {
      required: true
    },
    treeList: {
      type: Array,
      required: true
    },
    // 父组件传过来的// 当前点击分配权限的时候，将这个角色下的权限列表，传给分配权限弹出层组件
    diguiIDList: {
      type: Array,
      required: true
    }
  },
  created () {

  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      getChecketreeId: ''
    }
  },
  mounted () {
  },
  methods: {
    // 点击树弹出层的取消
    cancelTreeFn () {
      this.$emit('update:dialogVisible', false)
    },
    //
    async confirmTreeFn () {
      this.$emit('update:dialogVisible', false)
      const listID = this.$refs.treeRef.getCheckedKeys()
      this.getChecketreeId = listID.join(',')
      console.log(this.getChecketreeId)
      this.$emit('updataRoleRight', this.getChecketreeId)
    },
    getCurrentKey (val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
