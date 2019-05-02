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
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="jobName"
        width="100px"
        label="任务名称"
      />
      <el-table-column align="center" :show-overflow-tooltip="true" prop="beanName" label="Bean名称"/>
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="methodName"
        width="90px"
        label="执行方法"
      />
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="params"
        width="80px"
        label="参数"
      />
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="cronExpression"
        width="100px"
        label="cron表达式"
      />
      <el-table-column
        align="center"
        :show-overflow-tooltip="true"
        prop="isPause"
        width="90px"
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="scope.row.isPause ? 'warning' : 'success'"
          >{{ scope.row.isPause ? '已暂停' : '运行中' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="200px"
        align="center"
        :show-overflow-tooltip="true"
        prop="remark"
        label="描述"
      />
      <el-table-column
        align="center"
        width="150px"
        :show-overflow-tooltip="true"
        prop="updateTime"
        label="更新日期"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="260px">
        <template slot-scope="scope">
          <edit
            v-if="checkPermission(['ADMIN','JOB_ALL','JOB_EDIT'])"
            :data="scope.row"
            :sup_this="sup_this"
          />
          <el-button
            v-if="checkPermission(['ADMIN','JOB_ALL','JOB_EDIT'])"
            style="margin-left: -2px"
            type="warning"
            size="mini"
            @click="execute(scope.row.id)"
          >执行</el-button>
          <el-button
            v-if="checkPermission(['ADMIN','JOB_ALL','JOB_EDIT'])"
            style="margin-left: 3px"
            type="info"
            size="mini"
            @click="updateStatus(scope.row.id,scope.row.isPause ? '恢复' : '暂停')"
          >{{ scope.row.isPause ? '恢复' : '暂停' }}</el-button>
          <el-popover
            v-if="checkPermission(['ADMIN','JOB_ALL','JOB_DELETE'])"
            :ref="scope.row.id"
            placement="top"
            width="200"
          >
            <p>确定停止并删除该任务吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="text"
                size="mini"
                @click="subDelete(scope.row.id)"
              >确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      background
      style="margin-top: 8px;float:right"
      layout="total, prev, pager, next, jumper, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import initData from "@/mixins/initData";
import { del, updateIsPause, execution } from "@/api/timing";
import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
import edit from "./module/edit";
import { getRowClass } from "@/utils/rowclass";
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      sup_this: this
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    parseTime,
    checkPermission,
    getRowClass,
    beforeInit() {
      this.url = "api/jobs";
      const sort = "id,desc";
      const query = this.query;
      const value = query.value;
      this.params = { page: this.page, size: this.size, sort: sort };
      if (value) {
        this.params["jobName"] = value;
      }
      return true;
    },
    execute(id) {
      execution(id)
        .then(res => {
          this.$notify({
            title: "执行成功",
            type: "success",
            duration: 2500
          });
        })
        .catch(err => {
          console.log(err.response.data.message);
        });
    },
    updateStatus(id, status) {
      updateIsPause(id)
        .then(res => {
          this.init();
          this.$notify({
            title: status + "成功",
            type: "success",
            duration: 2500
          });
        })
        .catch(err => {
          console.log(err.response.data.message);
        });
    },
    subDelete(id) {
      this.delLoading = true;
      del(id)
        .then(res => {
          this.delLoading = false;
          this.$refs[id].doClose();
          this.init();
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 2500
          });
        })
        .catch(err => {
          this.delLoading = false;
          this.$refs[id].doClose();
          console.log(err.response.data.message);
        });
    }
  }
};
</script>

<style scoped>
</style>
