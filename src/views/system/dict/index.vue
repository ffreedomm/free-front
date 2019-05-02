<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="el-card-span">字典列表</span>
            <el-button
              v-if="checkPermission(['ADMIN','DICT_ALL','DICT_CREATE'])"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px;background:#409eff;border-color:#FFF"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.header.$refs.form.dialog = true"
            >新增</el-button>
          </div>
          <eHeader ref="header" :query="query" :sup_this="sup_this"/>
          <!--表格渲染-->
          <el-table
            v-loading="loading"
            :data="data"
            size="small"
            style="width: 100%;"
            @current-change="handleCurrentChange"
            stripe="true"
            highlight-current-row="true"
            :header-cell-style="getRowClass"
          >
            <el-table-column align="center" :show-overflow-tooltip="true" prop="name" label="名称"/>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="remark" label="描述"/>
            <el-table-column label="操作" width="150px" align="center">
              <template slot-scope="scope">
                <edit
                  v-if="checkPermission(['ADMIN','DICT_ALL','DICT_EDIT'])"
                  :data="scope.row"
                  :sup_this="sup_this"
                />
                <el-popover
                  v-if="checkPermission(['ADMIN','DICT_ALL','DICT_DELETE'])"
                  :ref="scope.row.id"
                  placement="top"
                  width="180"
                >
                  <p>此操作将删除字典与对应的字典详情，确定要删除吗？</p>
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
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"
          />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="el-card-span">
              字典详情:
              <span
                style="color: #FFF"
              >{{ this.$refs.dictDetail ? this.$refs.dictDetail.dictName : '' }}</span>
            </span>
            <el-button
              v-if="checkPermission(['ADMIN','DICT_ALL','DICT_CREATE']) && this.$refs.dictDetail && this.$refs.dictDetail.dictName"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px;background:#409eff;border-color:#FFF"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.dictDetail.$refs.header.$refs.form.dialog = true"
            >新增</el-button>
          </div>
          <dictDetail ref="dictDetail"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import initData from "@/mixins/initData";
import { del } from "@/api/dict";
import eHeader from "./module/header";
import edit from "./module/edit";
import dictDetail from "../dictDetail/index";
import { getRowClass } from "@/utils/rowclass";
export default {
  components: { eHeader, edit, dictDetail },
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
    checkPermission,
    getRowClass,
    beforeInit() {
      this.url = "api/dict";
      const sort = "id,desc";
      this.params = { page: this.page, size: this.size, sort: sort };
      const query = this.query;
      const type = query.type;
      const value = query.value;
      if (type && value) {
        this.params[type] = value;
      }
      if (this.$refs.dictDetail) {
        this.$refs.dictDetail.data = [];
        this.$refs.dictDetail.dictName = "";
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
    },
    handleCurrentChange(val) {
      if (val) {
        this.$refs.dictDetail.dictName = val.name;
        this.$refs.dictDetail.dictId = val.id;
        this.$refs.dictDetail.init();
      }
    }
  }
};
</script>

<style scoped>
</style>
