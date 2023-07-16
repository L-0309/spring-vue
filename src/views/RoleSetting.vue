<template>
<div>
  <!--          搜索区域-->
  <div class="pd-10">
    <el-input style="width: 200px" v-model="username" placeholder="请输入名称" suffix-icon="el-icon-place"
              clearable></el-input>
    <el-select v-model="role" clearable placeholder="请选择角色" @change="nameChange" size="mini">
      <el-option v-for="item in roles" :key="item.id"
                 :label="item.name"
                 :value="item.soleKey">
      </el-option>
    </el-select>
    <el-button type="primary" class="ml-5" icon="el-icon-search" @click="search">搜索</el-button>
    <el-button type="warning" class="ml-5" icon="el-icon-refresh" @click="reset">重置</el-button>
  </div>

<!--  表格-->
  <el-table :data="tableData" border stripe>
    <el-table-column prop="username" label="用户名"></el-table-column>
    <el-table-column prop="nickname" label="昵称"></el-table-column>
    <el-table-column label="角色">
      <template v-slot="scope">
        <span style="font-size: 1px"> {{ scope.row.soleKey.name }} </span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template v-slot="scope">
        <el-button type="success" @click="handleEdit(scope.row)" size="mini">
          编辑<i class="el-icon-edit-outline"></i>
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--          分页区域-->
  <div style="padding: 10px 0">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[5, 10, 15, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>

  <!--          弹窗-->
  <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%">
    <el-form label-width="80px">
      <el-form-item label="id：">
        <el-input v-model="form.id" autocomplete="off" readonly></el-input>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色：">
        <el-select v-model="form.role" clearable placeholder="请选择角色" size="mini">
          <el-option v-for="item in roles" :key="item.id"
                     :label="item.name"
                     :value="item.soleKey">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="昵称：">
        <el-input v-model="form.nickname" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" type="info" @click="dialogFormVisible = false">取 消</el-button>
      <el-button icon="el-icon-circle-check" type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "RoleSetting",
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      form: {},
      roles: [],
      //分页数据
      current: 1,
      pageSize: 5,
      total: 0,
      //输入框
      username: '',
      role: '',
      email: '',
      address: '',
    }
  },
  methods: {
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    load() {
      //请求分页数据
      request.get('user/find', {
        params: {
          current: this.current, pageSize: this.pageSize,
          username: this.username, email: this.email, addressId: this.addressId,role: this.role
        }
      }).then(
          res => {
            if (res.code !== '401'){
              this.tableData = res.data.records
              this.total = res.data.total
            }
          }
      )
      request.get('role').then(
          res => {
            this.roles = res.data
          }
      )
    },
    save() {
      request.post('user/save', this.form).then(
          res => {
            if (res.code === '200') {
              this.$message.success('更新成功')
              this.dialogFormVisible = false
              this.load()
            } else {
              this.$message.error('更新失败')
            }
          }
      )
    },
    nameChange(role) {
      this.role = role
      this.load()
    },
    //改变页面大小触发
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    //改变当前页码触发
    handleCurrentChange(current) {
      this.current = current
      this.load()
    },
    //重置查询
    reset() {
      this.username = ''
      this.role = ''
      this.load()
    },
    //搜索
    search() {
      this.load()
    },
  },
  created() {
    this.load()
  }
}
</script>

<style scoped>

</style>