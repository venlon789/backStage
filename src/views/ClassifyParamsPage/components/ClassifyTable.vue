<template>
  <div>
    <el-table border :data="resultList" style="width: 100%">
      <el-table-column type="expand" class="tags_box">
        <template slot-scope="scope">
          <!-- slot-scope="props" -->
          <!-- 标签 -->
          <el-tag
            :key="index"
            v-for="(tag, index) in scope.row.attr_vals.trim().split(' ')"
            closable
            v-show="tag"
            :disable-transitions="false"
            @close="handleClose(index, scope)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="scope.row.inputVisible"
            class="input-new-tag"
            v-model="scope.row.inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(scope)"
            @blur="handleInputConfirm(scope)"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click.native="showInput(scope.row)"
            >+ New Tag</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="#" type="index"> </el-table-column>
      <el-table-column label="分类名称" prop="attr_name"> </el-table-column>
      <el-table-column label="操作">
        <!-- 编辑 -->
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="editClassifyBtn(scope.row)"
            >编辑
          </el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delectClassifyFn(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑的弹出窗 -->
    <el-dialog title="修改动态参数" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item
          label="参数名称"
          prop="attr_name"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttrnameFn"> 确 定 </el-button>
      </div>
    </el-dialog>
    <!-- 编辑的弹出窗 -->
  </div>
</template>

<script>
import { deleteParamApi, editParamApi, editCommitParamApi } from '@/api/params'
export default {
  name: 'ClassifyTable',
  props: {
    resultList: {
      type: Array,
      required: true
    },
    sel: {
      type: String,
      required: true
    }
  },
  created () {
  },
  data () {
    return {
      // 点击某一行的时候会自动更新标签的数据
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      dialogFormVisible: false,
      form: {
        attr_name: ''
      },
      rules: {
        attr_name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 3, max: 7, message: '请输入3-7位', trigger: 'blur' }]
      },
      formLabelWidth: '120px',
      catid: '',
      attrid: ''
    }
  },
  methods: {
    // 点击标签的删除
    async handleClose (index, scope) {
      editCommitParamApi(scope.row.cat_id, scope.row.attr_id)
      console.log(scope)
      scope.row.attr_vals = scope.row.attr_vals.trim().split(' ')
      scope.row.attr_vals.splice(index, 1)
      scope.row.attr_vals = scope.row.attr_vals.join(' ')
      // 发请求，这个做的不是很好
      try {
        const res = await editCommitParamApi(scope.row.cat_id, scope.row.attr_id, scope.row.attr_name, scope.row.attr_sel, scope.row.attr_vals)
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
        } else {
          this.$message.error('操作失败')
        }
      } catch (error) {
        this.$message.error('操作失败')
      }
    },

    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // ===============================================
    async handleInputConfirm (scope) {
      console.log(scope)
      console.log(scope.row.inputValue)
      if (scope.row.inputValue.trim() !== '') {
        console.log(123123)
        scope.row.attr_vals = scope.row.attr_vals + ' ' + scope.row.inputValue.trim()
        try {
          const res = await editCommitParamApi(scope.row.cat_id, scope.row.attr_id, scope.row.attr_name, scope.row.attr_sel, scope.row.attr_vals)
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
          } else {
            this.$message.error('操作失败')
          }
        } catch (error) {
          this.$message.error('操作失败')
        }
      }
      scope.row.inputVisible = false
      scope.row.inputValue = ''
    },
    // ===============================================
    // 点击删除按钮，执行api
    delectClassifyFn (val) {
      console.log(val)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await deleteParamApi(val.cat_id, val.attr_id)
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            console.log('aaa')
            // 想办法触发父组件的事件
            this.$emit('fatherMethod')
            console.log('bbb')
          } else {
            console.log(123)
            this.$message.error('操作失败')
          }
        } catch (error) {
          console.log(456)
          this.$message.error('操作失败')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击编辑按钮的
    editClassifyBtn (val) {
      console.log(val)
      this.catid = val.cat_id
      this.attrid = val.attr_id
      this.form.attr_name = val.attr_name
      // 还有一个sel
      this.dialogFormVisible = true
    },
    // 点击弹出框确定编辑操作的
    async editAttrnameFn () {
      try {
        await this.$refs.formRef.validate()
        console.log(this.form.attr_name)
        // 验证通过就，再去发起请求
        try {
          // 传递过去四个值
          const res = await editParamApi(this.catid, this.attrid, this.form.attr_name, this.sel)
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            this.dialogFormVisible = false
            this.$emit('fatherMethod')
          } else {
            this.$message.error('请稍后重试')
          }
        } catch (error) {
          this.$message.error('请稍后重试')
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
      // this.dialogFormVisible = false
    },
    // 点击编辑时候需要调用的方法，发起编辑的请求
    async editParam () {
      await editParamApi()
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped>
/* table样式 */
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
/* table样式 */
:deep(.el-table__expanded-cell) {
  padding: 20px 50px;
}
:deep(.el-tag--light) {
  margin: 0 20px;
}
.el-table {
  margin-top: 30px;
}
</style>
