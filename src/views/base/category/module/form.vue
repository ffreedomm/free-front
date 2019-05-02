<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="类别编码">
        <el-input v-model="form.categoryCode" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="类别名称">
        <el-input v-model="form.categoryName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="上级id">
        <el-input v-model="form.parentId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="类别层级">
        <el-input v-model="form.categoryLevel" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="显示顺序">
        <el-input v-model="form.orderNum" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="是否删除">
        <el-input v-model="form.deleted" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.comment" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="form.createTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="修改时间">
        <el-input v-model="form.modifyTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="form.creator" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="修改人">
        <el-input v-model="form.modifier" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="eas_code">
        <el-input v-model="form.easCode" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/category'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        categoryCode: '',
        categoryName: '',
        parentId: '',
        categoryLevel: '',
        orderNum: '',
        deleted: '',
        comment: '',
        createTime: '',
        modifyTime: '',
        creator: '',
        modifier: '',
        easCode: ''
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        categoryCode: '',
        categoryName: '',
        parentId: '',
        categoryLevel: '',
        orderNum: '',
        deleted: '',
        comment: '',
        createTime: '',
        modifyTime: '',
        creator: '',
        modifier: '',
        easCode: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
