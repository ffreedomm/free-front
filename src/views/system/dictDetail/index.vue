<template>
  <div>
    <div v-if="dictName === ''">
      <div class="my-code">点击字典查看详情</div>
    </div>
    <div v-else>
      <eHeader ref="header" :query="query" :dict-id="dictId"/>
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
        <el-table-column align="center" prop="label" label="字典标签"/>
        <el-table-column align="center" prop="value" label="字典值"/>
        <el-table-column align="center" prop="sort" label="排序"/>
        <el-table-column align="center" label="操作" width="150px">
          <template slot-scope="scope">
            <edit
              v-if="checkPermission(['ADMIN','DICT_ALL','DICT_EDIT'])"
              :dict-id="dictId"
              :data="scope.row"
              :sup_this="sup_this"
            />
            <el-popover
              v-if="checkPermission(['ADMIN','DICT_ALL','DICT_DELETE'])"
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
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission";
import initData from "@/mixins/initData";
import { del } from "@/api/dictDetail";
import eHeader from "./module/header";
import edit from "./module/edit";
import { getRowClass } from "@/utils/rowclass";
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      sup_this: this,
      dictName: "",
      dictId: 0
    };
  },
  created() {
    this.loading = false;
  },
  methods: {
    checkPermission,
    getRowClass,
    beforeInit() {
      this.url = "api/dictDetail";
      this.params = {
        page: this.page,
        size: this.size,
        dictName: this.dictName
      };
      const query = this.query;
      const value = query.value;
      if (value) {
        this.params["label"] = value;
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
.my-code {
  padding: 15px;
  line-height: 20px;
  border-left: 3px solid #ddd;
  color: #333;
  font-family: Courier New;
  font-size: 12px;
}
</style>
