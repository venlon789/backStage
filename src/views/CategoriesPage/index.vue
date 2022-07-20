<template>
  <div>
    <commenCom>
      <!-- 插槽 -->
      <template>
        <!-- 默认插槽 -->
        <template>
          <el-button type="primary" @click="addCategorieBtn">
            添加分类
          </el-button>
        </template>
        <el-dialog title="添加商品分类" :visible.sync="dialogFormVisible">
          <el-form :model="form" :rules="rules" ref="formRef">
            <el-form-item label="分类级别" :label-width="formLabelWidth">
              <el-cascader
                :options="selectCategoriesList"
                :props="{
                  checkStrictly: true,
                  label: 'cat_name',
                  value: 'cat_id',
                }"
                clearable
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item
              label="分类名称"
              prop="catname"
              :label-width="formLabelWidth"
            >
              <el-input
                :disabled="!cat_pidList.length > 0"
                v-model="form.catname"
                autocomplete="off"
                :placeholder="!cat_pidList.length > 0 ? '请选择分类级别' : ''"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmAddCategoriesFn"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <!-- table -->
        <el-table
          :data="categoriesList"
          style="width: 100%; margin-bottom: 20px"
          row-key="cat_id"
          border
          :default-expand-all="false"
          :tree-props="{
            children: 'children',
          }"
        >
          <el-table-column type="index" label="#">
            <template v-slot="scope">
              {{ scope.row.index }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cat_name"
            label="分类名称"
            sortable
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="cat_deleted"
            label="是否有效"
            sortable
            width="180"
          >
            <!-- 插槽，这里v-if显示 是否有效-->
            <template slot-scope="scope">
              <i
                class="el-icon-success icon_success_color"
                v-if="scope.row.cat_deleted === false"
              ></i>
              <i class="el-icon-error icon_error_color" v-else></i>
            </template>
            <!-- /插槽，这里v-if显示 是否有效-->
          </el-table-column>
          <el-table-column label="排序">
            <!-- 这里也用到插槽，和上面情况差不多 -->
            <template slot-scope="scope">
              <el-tag v-if="scope.row.cat_level === 0" @click="fn(scope)"
                >一级</el-tag
              >
              <el-tag v-else-if="scope.row.cat_level === 1" type="success"
                >二级</el-tag
              >
              <el-tag
                v-else-if="scope.row.cat_level === 2"
                type="warning"
                @click="fn(scope)"
                >三级</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <!-- 编辑 -->
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="editUserBtn(scope.row)"
                >编辑
              </el-button>
              <!-- 删除 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="delectUserFn(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页-->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="categoriesListTotal"
          >
          </el-pagination>
        </div>
      </template>
    </commenCom>
  </div>
</template>

<script>
import { getCategoriesListApi, addCategorieApi } from '@/api/categories'
import commenCom from '@/components/commenCom.vue'
export default {
  name: 'CategoriesPage',
  created () {
    // 获取商品列表请求
    this.getCategoriesList()
  },
  data () {
    return {
      // 操作
      currentPage: 1,
      // 传给后台的数据
      categoriesApiObj: {
        pagenum: 1,
        pagesize: 5
      },
      // 商品列表
      categoriesList: [],
      dialogFormVisible: false,
      editFormVisible: false,
      roleVisible: false,
      formLabelWidth: '120px',
      categoriesListTotal: null,
      // 传给后台的数据
      form: {
        catname: '',
        catpid: '',
        catlevel: 2
      },
      rules: {
        catname: [
          { required: true, message: '请输入添加分类的名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      // select渲染的列表数据
      selectCategoriesList: [],
      // select选择之后生成一个cat_pidList数组
      cat_pidList: []
    }
  },
  methods: {
    // 获取商品列表
    async getCategoriesList () {
      try {
        const res = await getCategoriesListApi(this.categoriesApiObj)
        console.log(res)
        this.categoriesList = res.data.data.result
        this.categoriesList.forEach((item, index) => {
          this.$set(item, 'index', index + 1)
        })
        console.log(this.categoriesList)
        this.categoriesListTotal = res.data.data.total
        this.$message.success('数据获取成功，请查看结果')
      } catch (error) {
        console.log(error)
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.categoriesApiObj.pagesize = val
      this.getCategoriesList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.categoriesApiObj.pagenum = val
      this.currentPage = val
      this.getCategoriesList()
    },
    // 删除操作
    delectUserFn () { },
    // 编辑操作
    editUserBtn () { },
    // 点击添加分类按钮
    async addCategorieBtn () {
      this.dialogFormVisible = true
      // 点击的时候就发起请求，渲染筛选框
      const res = await getCategoriesListApi({ type: 2 })
      console.log(res)
      this.selectCategoriesList = res.data.data
    },
    // 选择器中选中的时候触发这个
    handleChange (val) {
      console.log(val)
      this.cat_pidList = val
    },
    // 点击的时候确认添加分类
    async confirmAddCategoriesFn () {
      try {
        await this.$refs.formRef.validate()
        this.dialogFormVisible = false
        this.form.catpid = this.cat_pidList[this.cat_pidList.length - 1]
        console.log(this.form.catpid)
        try {
          const res = await addCategorieApi(this.form)
          console.log(res)
          if (res.data.meta.status === 201) {
            this.$message.success(res.data.meta.msg)
            // 获取商品列表请求
            this.getCategoriesList()
          } else {
            this.$message.error(res.data.meta.msg)
          }
        } catch (error) {
          this.$message.error('操作失败')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('操作失败')
      }
      this.$refs.formRef.resetFields()
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: { commenCom }
}
</script>

<style scoped>
.block {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}

:deep(.el-table .el-table__expand-icon .el-icon-arrow-right:before) {
  content: "\e6d9";
}
:deep(.el-table .el-table__expand-icon--expanded) {
  transform: rotate(0);
}
:deep(.el-table .el-table__expand-icon--expanded .el-icon-arrow-right:before) {
  content: "\e6d8";
}
.icon_success_color {
  color: green;
}
.icon_error_color {
  color: red;
}
</style>
