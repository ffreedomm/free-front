<template>
  <div class="app-container">
    <eHeader :query="query"/>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      stripe="true"
      highlight-current-row="true"
      :header-cell-style="getRowClass"
    >
      <el-table-column align="center" prop="username" label="用户名"/>
      <el-table-column align="center" prop="requestIp" label="IP"/>
      <el-table-column align="center" prop="description" label="描述"/>
      <el-table-column :show-overflow-tooltip="true" prop="method" label="方法名称"/>
      <el-table-column :show-overflow-tooltip="true" prop="params" label="参数"/>
      <el-table-column align="center" prop="time" label="请求耗时">
        <template slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
          <el-tag
            size="mini"
            v-else-if="scope.row.time <= 1000"
            type="warning"
          >{{ scope.row.time }}ms</el-tag>
          <el-tag size="mini" v-else type="danger">{{ scope.row.time }}ms</el-tag>
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
      background
      :total="total"
      style="margin-top: 8px;float:right;"
      layout="total, prev, pager, next, jumper,sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import initData from "@/mixins/initData";
import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
import { getRowClass } from "@/utils/rowclass";
export default {
  components: { eHeader },
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
      this.url = "api/logs";
      const sort = "id,desc";
      const query = this.query;
      const username = query.username;
      this.params = { page: this.page, size: this.size, sort: sort };
      if (username && username) {
        this.params["username"] = username;
      }
      return true;
    }
  }
};
</script>

<style scoped>
</style>
