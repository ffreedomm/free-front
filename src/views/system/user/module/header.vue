<template>
  <div class="head-container">
    <!-- 查询条件row-1 -->
    <el-row :gutter="20" class="header-search-row">
      <el-col :span="7">
        <div>
          <el-input placeholder="请输入用户名" v-model="query.username" @keyup.enter.native="toQuery">
            <template slot="prepend">用户名请输入用户名</template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="7">
        <div>
          <el-input placeholder="请输入用电话" v-model="query.value" @keyup.enter.native="toQuery">
            <template slot="prepend">电话</template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="7">
        <div>
          <el-input placeholder="请输入邮箱" v-model="query.email" @keyup.enter.native="toQuery">
            <template slot="prepend">邮箱</template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="3">
        <el-button
          class="filter-item"
          type="success"
          size="mini"
          icon="el-icon-search"
          @click="toQuery"
        >搜索</el-button>
      </el-col>
    </el-row>

    <!-- 查询条件row-2 -->
    <el-row :gutter="20" class="header-search-row">
      <el-col :span="7">
        <div>
          <el-input placeholder="请选择组织" v-model="query.value" @keyup.enter.native="toQuery">
            <template slot="prepend">组织</template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="7">
        <div>
          <el-input placeholder="请选择岗位" v-model="query.value" @keyup.enter.native="toQuery">
            <template slot="prepend">岗位</template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="el-input el-input-group el-input-group--prepend">
          <div class="el-input-group__prepend">状态</div>
          <el-select
            style="width:100%"
            v-model="query.enabled"
            clearable
            placeholder="请选择状态"
            @change="toQuery"
          >
            <el-option
              v-for="item in enabledTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :span="3">
        <!--  清空 -->
        <el-button class="filter-item" size="mini" icon="el-icon-search" @click="clearQuery">清空</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="20"></el-row>
    <el-row :gutter="20" class="header-btn">
      <!-- 新增 -->
      <el-col :span="12">
        <div style="display: inline-block;margin: 0px 2px;">
          <el-button
            v-if="checkPermission(['ADMIN','USER_ALL','USER_CREATE'])"
            class="filter-item"
            size="mini"
            icon="el-icon-plus"
            @click="add"
          >新增</el-button>
          <eForm ref="form" :sup_this="sup_this" :is-add="true" :dicts="dicts"/>
        </div>
      </el-col>
      <!-- 导出 -->
      <el-col :span="12">
        <el-button
          v-if="checkPermission(['ADMIN'])"
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          icon="el-icon-download"
          @click="download"
        >导出</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from "@/utils/permission"; // 权限判断函数
import { parseTime } from "@/utils/index";
import eForm from "./form";
// 查询条件
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      query: {},
      downloadLoading: false,
      queryTypeOptions: [
        { key: "username", display_name: "用户名" },
        { key: "email", display_name: "邮箱" }
      ],
      enabledTypeOptions: [
        { key: "true", display_name: "激活" },
        { key: "false", display_name: "锁定" }
      ]
    };
  },
  methods: {
    checkPermission,
    add() {
      this.$refs.form.getDepts();
      this.$refs.form.getRoles();
      this.$refs.form.dialog = true;
    },
    // 去查询
    toQuery() {
      this.sup_this.page = 0;
      this.sup_this.init();
    },
    //清空查询
    clearQuery() {
      this.sup_this.query = {};
      this.toQuery();
    },
    // 导出
    download() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "ID",
          "用户名",
          "邮箱",
          "头像地址",
          "状态",
          "注册日期",
          "最后修改密码日期"
        ];
        const filterVal = [
          "id",
          "username",
          "email",
          "avatar",
          "enabled",
          "createTime",
          "lastPasswordResetTime"
        ];
        const data = this.formatJson(filterVal, this.sup_this.data);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "createTime" || j === "lastPasswordResetTime") {
            return parseTime(v[j]);
          } else if (j === "enabled") {
            return parseTime(v[j]) ? "启用" : "禁用";
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style>
.header-btn {
  float: right;
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
}
.vertical-line {
  height: 30px;
  width: 2px;
  background-color: #409eff;
}
/* .el-input {
  font-size: 9px;
} */
</style>
