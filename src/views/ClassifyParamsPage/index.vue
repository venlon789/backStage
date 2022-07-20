<template>
  <div>
    <commenCom>
      <!-- 提醒 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 级联选择器 -->
      <div class="block">
        <span class="demonstration">选择商品分类: </span>
        <el-cascader
          v-model="cat_id"
          :props="{ value: 'cat_id', label: 'cat_name' }"
          :options="goodsClassifyList"
          @change="handleChange"
        >
          <!-- <template slot-scope="{ data }">
            <span>{{ data.cat_name }}</span>
          </template> -->
        </el-cascader>
      </div>
      <!-- 下方的动态静态的切换 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            :disabled="id ? false : true"
            @click="addParamsBtn"
            >添加参数</el-button
          >
          <!-- 插入组件 -->
          <ClassifyTable
            :resultList="resultList"
            :sel="sel"
            @fatherMethod="getClassifyParam()"
          ></ClassifyTable>
          <!--/插入组件 -->
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <!-- 添加属性按钮 -->
          <el-button
            type="primary"
            :disabled="id ? false : true"
            @click="addParamsBtn"
            >添加属性</el-button
          >
          <!-- 插入组件 -->
          <ClassifyTable
            :resultList="resultList"
            @fatherMethod="getClassifyParam()"
            :sel="sel"
          ></ClassifyTable>
          <!--/插入组件 -->
        </el-tab-pane>
      </el-tabs>
    </commenCom>
    <!-- 编辑的弹出窗 -->
    <el-dialog
      :title="sel === 'many' ? '添加动态参数' : '添加静态属性'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item
          :label="sel === 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttrnameFn"> 确 定 </el-button>
      </div>
    </el-dialog>
    <!-- 编辑的弹出窗 -->
  </div>
</template>

<script>
import { getGoodsClassifyListApi, getClassifyParamApi, addParamApi } from '@/api/params'
import commenCom from '@/components/commenCom.vue'
import ClassifyTable from './components/ClassifyTable.vue'
export default {
  name: 'ClassifyParamsPage',
  created () {
    // 打开页面的时候，立即调用一次，获取商品分类数据列表的方法
    this.getGoodsClassifyList()
  },
  data () {
    return {
      dialogFormVisible: false,
      formLabelWidth: '120px',
      // 当前默认选中的状态
      activeName: 'first',
      // 获取商品分类数据传给后台的参数，一开始什么参数都为空
      goodsClassifyParams:
      {
        type: '',
        pagenum: '',
        pagesize: ''
      },
      goodsClassifyList: [],
      cat_id: [],
      // many和only
      sel: 'many',
      // handleChange事件触发， 当前获取到的数组长度符合要求，获取数组最后一项的id
      selectId: '',
      // 获取到结果的数据
      resultList: [],
      form: {
        attr_name: ''
      },
      rules: {
        attr_name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 3, max: 7, message: '请输入3-7位', trigger: 'blur' }]
      },
      // 点击静态或者动态，需要传的cat_id
      id: ''
    }
  },
  watch: {
    // 侦听一下，真听到发生变化的时候，就让sel参数值发生变化
    activeName: {
      handler () {
        if (this.activeName === 'first') {
          this.sel = 'many'
          // 当这两个 this.getClassifyParam()值存在的时候，在切换的情况下才去请求数据
        } else {
          this.sel = 'only'
        }
        if (this.selectId && this.sel) {
          this.getClassifyParam()
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 当选择的内容发生改变的时候，就会做执行这个代码
    handleChange (value) {
      console.log(value)
      if (value.length < 3) {
        this.$message.error('请选择三级商品分类')
      } else {
        console.log(this.cat_id)
        // 当前获取到的数组长度符合要求，获取数组最后一项的id
        this.selectId = value[2]
        this.getClassifyParam()
      }
    },
    // 获取商品分类数据列表的方法
    async getGoodsClassifyList () {
      try {
        const res = await getGoodsClassifyListApi(this.goodsClassifyParams)
        console.log(res)
        this.goodsClassifyList = res.data.data
        console.log(this.goodsClassifyList)
      } catch (error) {
        console.log(error)
      }
    },
    // 分类参数管理,这个在handleChange这个事件触发的时候去执行
    async getClassifyParam () {
      try {
        const res = await getClassifyParamApi(this.selectId, this.sel)
        console.log(res)
        console.log(res.data.data)
        // 设置当前的, // 数据闯过去的时候，就对resultList进行处理一下
        // this.resultList = res.data.data
        this.resultList = res.data.data.forEach(item => {
          item.inputVisible = false
          item.inputValue = ''
        })
        this.resultList = res.data.data
        console.log(this.resultList)
        if (res.data.data.length) {
          console.log(res.data.data[0].cat_id)
          this.id = res.data.data[0].cat_id
        } else {
          this.id = ''
        }
        // this.resultList = res.data.data
      } catch (error) {

      }
    },
    // 点击按钮，添加动态参数
    addParamsBtn () {
      this.dialogFormVisible = true
    },
    // 弹出窗，点击确认的时候，发起请求
    async addAttrnameFn () {
      console.log(this.form.attr_name)
      try {
        await this.$refs.formRef.validate()
        console.log(this.form.attr_name)
        // 验证通过就，再去发起请求
        try {
          // 传递过去四个值
          const res = await addParamApi(this.id, this.form.attr_name, this.sel)
          console.log(res)
          if (res.data.meta.status === 201) {
            this.$message.success(res.data.meta.msg)
            this.dialogFormVisible = false
            this.getClassifyParam()
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
    }
  },
  computed: {},

  filters: {},
  components: { commenCom, ClassifyTable }
}
</script>

<style scoped>
.block {
  margin: 15px 0;
}
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
/* table样式 */
</style>
