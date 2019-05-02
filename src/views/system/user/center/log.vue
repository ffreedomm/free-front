<template>
  <div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      stripe="true"
      :show-header="true"
      :highlight-current-row="true"
    >
      <el-table-column align="center" prop="description" label="行为"/>
      <el-table-column align="center" prop="requestIp" label="IP"/>
      <el-table-column align="center" prop="time" label="请求耗时">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
          <el-tag
            size="small"
            v-else-if="scope.row.time <= 1000"
            type="warning"
          >{{ scope.row.time }}ms</el-tag>
          <el-tag size="small" v-else type="danger">{{ scope.row.time }}ms</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建日期" width="180px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      background
      style="margin-top: 8px;float:right;margin-bottom: 8px;"
      layout="total, prev, pager, next, jumper, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { parseTime } from "@/utils/index";
import { getRowClass } from "@/utils/rowclass";
export default {
  mixins: [initData],
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    parseTime,
    getRowClass,
    beforeInit() {
      this.url = "api/logs/user";
      const sort = "id,desc";
      this.params = { page: this.page, size: this.size, sort: sort };
      return true;
    }
  }
};
</script>

<style scoped>
</style>
