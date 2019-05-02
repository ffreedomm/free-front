<template>
  <div>
    <el-button size="mini" type="success" @click="to">编辑</el-button>
    <eForm ref="form" :sup_this="sup_this" :is-add="false"/>
  </div>
</template>
<script>
import eForm from './form'
export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  methods: {
    to() {
      const _this = this.$refs.form
      _this.form = {
        id: this.data.id,
        receiveNumber: this.data.receiveNumber,
        warehouseOd: this.data.warehouseOd,
        resourceNumber: this.data.resourceNumber,
        receiveType: this.data.receiveType,
        receiveStatus: this.data.receiveStatus,
        deleted: this.data.deleted,
        applyTime: this.data.applyTime,
        applicant: this.data.applicant,
        handleTime: this.data.handleTime,
        handler: this.data.handler,
        applicantName: this.data.applicantName,
        handlerName: this.data.handlerName
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
  div{
    display: inline-block;
    margin-right: 3px;
  }
</style>
