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
        categoryCode: this.data.categoryCode,
        categoryName: this.data.categoryName,
        parentId: this.data.parentId,
        categoryLevel: this.data.categoryLevel,
        orderNum: this.data.orderNum,
        deleted: this.data.deleted,
        comment: this.data.comment,
        createTime: this.data.createTime,
        modifyTime: this.data.modifyTime,
        creator: this.data.creator,
        modifier: this.data.modifier,
        easCode: this.data.easCode
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
