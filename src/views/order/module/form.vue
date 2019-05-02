<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="领料单编号">
        <el-input v-model="form.receiveNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="领料仓库">
        <el-input v-model="form.warehouseOd" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="来源单号">
        <el-input v-model="form.resourceNumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="类型">
        <el-input v-model="form.receiveType" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="领料单状态">
        <el-input v-model="form.receiveStatus" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="是否删除">
        <el-input v-model="form.deleted" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-input v-model="form.applyTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="申请人">
        <el-input v-model="form.applicant" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="处理时间">
        <el-input v-model="form.handleTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="处理人">
        <el-input v-model="form.handler" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="申请人名称">
        <el-input v-model="form.applicantName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="处理人名称">
        <el-input v-model="form.handlerName" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/warehouseReceiveManage'
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
        receiveNumber: '',
        warehouseOd: '',
        resourceNumber: '',
        receiveType: '',
        receiveStatus: '',
        deleted: '',
        applyTime: '',
        applicant: '',
        handleTime: '',
        handler: '',
        applicantName: '',
        handlerName: ''
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
        receiveNumber: '',
        warehouseOd: '',
        resourceNumber: '',
        receiveType: '',
        receiveStatus: '',
        deleted: '',
        applyTime: '',
        applicant: '',
        handleTime: '',
        handler: '',
        applicantName: '',
        handlerName: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
