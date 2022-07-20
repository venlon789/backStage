<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <commenCom>
    <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
    <!-- 分布显示 -->
    <el-steps
      :active="activeIndex"
      align-center
      class="el_steps"
      finish-status="success"
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-tabs
      tab-position="left"
      style="height: 200px; margin-top: 20px"
      @tab-click="tabclick"
    >
      <!-- 步骤一 -->
      <el-tab-pane label="基本信息">
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="dataObject"
        >
          <el-form-item label="商品名称">
            <el-input v-model="dataObject.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="dataObject.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="dataObject.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="dataObject.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <div class="block">
              <el-cascader
                v-model="cat_id"
                :props="{ value: 'cat_id', label: 'cat_name' }"
                :options="goodsClassifyList"
                @change="handleChange"
              >
              </el-cascader>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 步骤二 -->
      <el-tab-pane :disabled="selectId ? false : true" label="商品参数">
        <el-form :label-position="labelPosition" label-width="80px">
          <el-form-item
            :label="item.attr_name"
            v-for="(item, index) in resultList"
            :key="index"
          >
            <el-checkbox-group
              v-model="item['checkBox']"
              v-if="item.attr_vals.trim()"
              @change="checkChange()"
            >
              <el-checkbox
                :label="ele"
                v-for="(ele, ind) in item.attr_vals.trim().split(' ')"
                :key="ind"
                class="checkbox-isborder"
              ></el-checkbox>
            </el-checkbox-group>
            <div v-else class="xianshimeishuju">
              <el-alert
                title="该参数暂无数据"
                :closable="false"
                type="info"
                show-icon
              >
              </el-alert>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- /步骤二 -->
      <!-- 步骤三 -->
      <el-tab-pane :disabled="selectId ? false : true" label="商品属性">
        <el-form :label-position="labelPosition" label-width="80px">
          <el-form-item
            :label="item.attr_name"
            v-for="(item, index) in resultList"
            :key="index"
          >
            <el-input v-model="item.attr_vals" @change="inputChange"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- /步骤三 -->
      <!-- 步骤四 -->
      <el-tab-pane :disabled="selectId ? false : true" label="商品图片">
        <el-upload
          class="upload-demo"
          action="http://liufusong.top:8899/api/private/v1/upload"
          :headers="hearderObj"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture"
          :on-success="uploadSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <!-- /步骤四 -->
      <!-- 步骤五 -->
      <el-tab-pane :disabled="selectId ? false : true" label="商品内容">
        <quill-editor
          ref="text"
          v-model="content"
          class="editor"
          :options="editorOption"
        />
        <el-button type="primary" class="button" @click="addGood"
          >添加商品</el-button
        >
      </el-tab-pane>
      <!-- /步骤五 -->
    </el-tabs>
  </commenCom>
</template>

<script>
import { getGoodsClassifyListApi, getClassifyParamApi } from '@/api/params'
import { addGood } from '@/api/goods'
import { getToken } from '@/utils/auth'
import commenCom from '@/components/commenCom.vue'
export default {
  name: 'AddGoods',
  created () {
    // 步骤一 打开页面的时候，立即调用一次，获取商品分类数据列表的方法
    this.getGoodsClassifyList()
  },
  data () {
    return {
      activeIndex: 0,
      // 基本信息
      labelPosition: 'top',
      // 步骤一选择器中的数据
      goodsClassifyList: [],
      // 步骤一 获取商品分类数据传给后台的参数，一开始什么参数都为空
      goodsClassifyParams:
      {
        type: '',
        pagenum: '',
        pagesize: ''
      },
      selectId: '',
      cat_id: [],
      // 步骤二
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      sel: '',
      resultList: [],
      checkList: [],
      // 步骤四
      fileList: [],
      // 步骤五
      content: '',
      editorOption: {},
      hearderObj: {
        authorization: getToken()
      },
      // 传给后台的一个对象
      dataObject: {
        attrs: [],
        goods_cat: '',
        goods_introduce: '',
        goods_name: '',
        goods_number: '',
        goods_price: '',
        goods_weight: '',
        pics: []
      },
      attrsmany: [],
      attrsonly: []
    }
  },
  methods: {
    fbbb (val) {
      console.log(val)
    },
    tabclick (val) {
      // console.log(val.index)
      this.activeIndex = Number(val.index)
      if (this.activeIndex === 1) {
        this.sel = 'many'
        // console.log(this.sel)
      } else if (this.activeIndex === 2) {
        this.sel = 'only'
      }
      if (val.index === '1') {
        // console.log(123)
        this.getClassifyParam()
        // console.log(123)
      } else if (val.index === '2') {
        this.getClassifyParam()
      }
    },
    // 步骤一选择器发生变化时执行的函数
    // 当选择的内容发生改变的时候，就会做执行这个代码
    handleChange (value) {
      console.log(value)
      if (value.length < 3) {
        this.$message.error('请选择三级商品分类')
      } else {
        console.log(this.cat_id)
        this.dataObject.goods_cat = value.join(',')
        // 当前获取到的数组长度符合要求，获取数组最后一项的id
        this.selectId = value[2]
        console.log(this.selectId)
        // this.getClassifyParam()
      }
    },
    // 步骤一选择器获取商品分类数据列表的方法
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
    // 步骤二获取标签
    // 分类参数管理,这个在handleChange这个事件触发的时候去执行
    async getClassifyParam () {
      try {
        // console.log(this.activeIndex)
        const res = await getClassifyParamApi(this.selectId, this.sel)
        console.log(res)
        // console.log(res.data.data)
        // 设置当前的, // 数据闯过去的时候，就对resultList进行处理一下
        res.data.data.forEach(item => {
          item.checkBox = []
        })
        this.resultList = res.data.data
        if (this.resultList > 0) {
          this.cat_id = res.data.data[0].cat_id
        } else {
          this.cat_id = ''
        }
      } catch (error) {

      }
    },
    checkChange () {
      this.attrsmany = []
      this.resultList.forEach(item => {
        // console.log(item)
        const obj = {}
        obj.attr_id = item.attr_id
        // console.log(obj.attr_id)
        obj.attr_value = item.checkBox.join(' ')
        this.attrsmany.push(obj)
      })
      this.dataObject.attrs = [...this.attrsmany, ...this.attrsonly]
    },
    // 步骤三，只要监听到一个表单发生变化，就立即执行这个
    inputChange () {
      console.log(123)
      this.attrsonly = []
      this.resultList.forEach(item => {
        const obj = {}
        obj.attr_id = item.attr_id
        obj.attr_value = item.attr_value
        this.attrsonly.push(obj)
      })
      this.dataObject.attrs = [...this.attrsmany, ...this.attrsonly]
    },
    // 步骤四
    handleRemove (file, fileList) {
      console.log(file, fileList)
      // const myform = new FormData()
      // myform.append('file', $('#load_xls')[0].files[0])
    },
    handlePreview (file) {
      console.log(file)
    },
    // 图片上传
    uploadPic () {

    },
    // 图片上传成功
    uploadSuccess (val) {
      console.log(val)
      const obj = { name: val.data.tmp_uploads, url: val.data.url }
      this.fileList.push(obj)
      this.dataObject.pics.push({ pic: val.data.tmp_path })
    },
    // 步骤五
    async addGood () {
      console.log(this.$refs.text._content)
      this.dataObject.goods_introduce = this.$refs.text._content
      try {
        const res = await addGood(this.dataObject)
        if (res.data.meta.status === 201) {
          this.$message.success(res.data.meta.msg)
          this.$router.push('/goods')
        } else {
          this.$message.error(res.data.meta.msg)
        }
      } catch (error) {
        this.$message.error('操作失败')
      }
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: { commenCom }
}
</script>

<style scoped>
.el_steps {
  margin-top: 20px;
}
:deep(.el-tabs--left, .el-tabs--right) {
  height: 100% !important;
}
.editor {
  height: 300px;
}
.button {
  margin-top: 50px;
}
.checkbox-isborder {
  display: flex;
  justify-content: center;
  height: 40px;
  min-width: 70px;
  border: 1px solid #409eff;
  box-sizing: border-box;
  line-height: 40px;
  padding: 9px 20px 9px 10px;
  border-radius: 4px;
}
.el-checkbox-group {
  display: flex;
}
.xianshimeishuju {
  width: 500px;
  height: 50px;
}
</style>
