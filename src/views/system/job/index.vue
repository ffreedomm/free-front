<template>
  <div class="app-container">
    <eHeader :query="query" :dicts="dicts"/>
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
      <el-table-column align="center" prop="name" label="名称"/>
      <el-table-column align="center" label="所属部门">
        <template slot-scope="scope">
          <div>{{ scope.row.dept.name }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <div v-for="item in dicts" :key="item.id">
            <el-tag
              size="small"
              v-if="scope.row.enabled.toString() === item.value"
              :type="scope.row.enabled ? '' : 'info'"
            >{{ item.label }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <edit
            v-if="checkPermission(['ADMIN','USERJOB_ALL','USERJOB_EDIT'])"
            :dicts="dicts"
            :data="scope.row"
            :sup_this="sup_this"
          />
          <el-popover
            v-if="checkPermission(['ADMIN','USERJOB_ALL','USERJOB_DELETE'])"
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
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
import initDict from "@/mixins/initDict";
import { del } from "@/api/job";
import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
import edit from "./module/edit";
import { getRowClass } from "@/utils/rowclass";
export default {
  components: { eHeader, edit },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false,
      sup_this: this
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
      // 加载数据字典
      this.getDict("job_status");
    });
  },
  methods: {
    parseTime,
    checkPermission,
    getRowClass,
    beforeInit() {
      this.url = "api/job";
      const sort = "sort,asc";
      this.params = { page: this.page, size: this.size, sort: sort };
      const query = this.query;
      const value = query.value;
      const enabled = query.enabled;
      if (value) {
        this.params["name"] = value;
      }
      if (enabled !== "" && enabled !== null) {
        this.params["enabled"] = enabled;
      }
      return true;
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
