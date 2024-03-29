<template>
  <div class="app-container">
    <eHeader :query="query"/>
    <!--表格渲染-->
    <tree-table
      v-loading="loading"
      :data="data"
      :expand-all="false"
      :columns="columns"
      size="small"
      stripe="true"
      highlight-current-row="true"
      :header-cell-style="getRowClass"
    >
      <el-table-column prop="icon" label="图标" align="center" width="80px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" width="100px" label="排序">
        <template slot-scope="scope">
          <el-tag size="small">{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :show-overflow-tooltip="true" prop="path" label="链接地址"/>
      <el-table-column align="center" :show-overflow-tooltip="true" prop="component" label="组件路径"/>
      <el-table-column align="center" prop="iframe" width="100px" label="内部菜单">
        <template slot-scope="scope">
          <span v-if="!scope.row.iframe">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <edit
            v-if="checkPermission(['ADMIN','MENU_ALL','MENU_EDIT'])"
            :data="scope.row"
            :sup_this="sup_this"
          />
          <el-popover
            v-if="checkPermission(['ADMIN','MENU_ALL','MENU_DELETE'])"
            :ref="scope.row.id"
            placement="top"
            width="200"
          >
            <p>确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！</p>
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
    </tree-table>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission"; // 权限判断函数
import treeTable from "@/components/TreeTable";
import initData from "@/mixins/initData";
import { del } from "@/api/menu";
import { parseTime } from "@/utils/index";
import eHeader from "./module/header";
import edit from "./module/edit";
import { getRowClass } from "@/utils/rowclass";
export default {
  components: { eHeader, edit, treeTable },
  mixins: [initData],
  data() {
    return {
      columns: [
        {
          text: "名称",
          value: "name"
        }
      ],
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
      this.url = "api/menus";
      const sort = "id,desc";
      const query = this.query;
      const value = query.value;
      this.params = { page: this.page, size: this.size, sort: sort };
      if (value) {
        this.params["name"] = value;
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
