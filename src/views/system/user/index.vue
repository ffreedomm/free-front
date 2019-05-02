<template>
  <div class="app-container">
    <!-- <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
        <el-card class="box-card" shadow="always" style="margin-top: 50px;">
          <div slot="header" class="clearfix">
            <span class="el-card-span">所属部门</span>
          </div>
          <el-tree
            :data="depts"
            :props="defaultProps"
            :expand-on-click-node="false"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </el-card>
    </el-col>-->
    <eHeader :query="query" :sup_this="sup_this" :dicts="dicts"/>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      stripe="true"
      highlight-current-row="true"
      :header-cell-style="getRowClass"
    >
      <el-table-column width="80px" align="center" prop="username" label="用户名"/>
      <el-table-column width="120px" align="center" prop="phone" label="电话"/>
      <el-table-column width="200px" align="center" prop="email" label="邮箱"/>
      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <div v-for="item in scope.row.roles" :key="item.id">{{ item.name }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
        <template slot-scope="scope">
          <div>{{ scope.row.dept.name }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="岗位">
        <template slot-scope="scope">
          <div>{{ scope.row.job.name }}</div>
        </template>
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
      <el-table-column
        show-overflow-tooltip="true"
        align="center"
        prop="createTime"
        label="创建日期"
        width="200px"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip="true"
        fixed="right"
        align="center"
        label="操作"
        width="140"
      >
        <template slot-scope="scope">
          <edit
            v-if="checkPermission(['ADMIN','USER_ALL','USER_EDIT'])"
            :dicts="dicts"
            :data="scope.row"
            :sup_this="sup_this"
          />
          <el-popover
            v-if="checkPermission(['ADMIN','USER_ALL','USER_DELETE'])"
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
      background="#304156"
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
import { del } from "@/api/user";
import { getDepts } from "@/api/dept";
import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
import edit from "./module/edit";
import { getRowClass } from "@/utils/rowclass";
export default {
  components: { eHeader, edit },
  mixins: [initData, initDict],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      delLoading: false,
      sup_this: this,
      deptName: "",
      depts: [],
      deptId: null,
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  created() {
    this.getDeptDatas();
    this.$nextTick(() => {
      this.init();
      // 加载数据字典
      this.getDict("user_status");
    });
  },
  mounted: function() {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    };
  },
  methods: {
    parseTime,
    checkPermission,
    getRowClass,
    beforeInit() {
      this.url = "api/users";
      const sort = "id,desc";
      const query = this.query;
      const type = query.type;
      const value = query.value;
      const enabled = query.enabled;
      this.params = {
        page: this.page,
        size: this.size,
        sort: sort,
        deptId: this.deptId
      };
      Object.assign(this.params, query);
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
    },
    getDeptDatas() {
      const sort = "id,desc";
      const params = { sort: sort };
      if (this.deptName) {
        params["name"] = this.deptName;
      }
      getDepts(params).then(res => {
        this.depts = res.content;
      });
    },
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.deptId = null;
      } else {
        this.deptId = data.id;
      }
      this.init();
    }
  }
};
</script>

<style scoped>
</style>
