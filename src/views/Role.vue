<template>
  <div>
    <!--          搜索区域-->
    <div class="pd-10">
      <el-input style="width: 200px" v-model="name" placeholder="请输入名称" suffix-icon="el-icon-place" clearable></el-input>
      <el-button type="primary" class="ml-5" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="warning" class="ml-5" icon="el-icon-refresh" @click="reset">重置</el-button>
    </div>
    <!--          按钮区域-->
    <div class="pd-10">
      <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm class="ml-5" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red"
                     title="确定批量删除吗？" @confirm="delBatch">
        <el-button slot="reference" type="danger">批量删除 <i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>
    </div>
    <!--          内容-->
    <el-table :data="tableData" @selection-change="handleSelectionChange" border stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="soleKey" label="标识"></el-table-column>
      <el-table-column label="操作" width="400">
        <template v-slot="scope">
          <el-button type="info" @click="selectMenu(scope.row)">分配菜单<i class="el-icon-menu"></i></el-button>
          <el-button type="success" @click="handleEdit(scope.row)" size="mini">
            编辑<i class="el-icon-edit-outline"></i>
          </el-button>
          <el-popconfirm
              class="ml-5"
              confirm-button-text='确定'
              cancel-button-text='取消'
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="handleDelete(scope.row.id)"
          >
            <el-button slot="reference" type="danger">删除 <i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>
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
    <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="80px">
        <el-form-item v-show="idVerify" label="id：">
          <el-input v-model="form.id" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="名称：">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标识：">
          <el-input v-model="form.soleKey" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" type="info" @click="dialogFormVisible = false; idVerify = false">取 消</el-button>
        <el-button icon="el-icon-circle-check" type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

<!--    菜单分配-->
    <el-dialog title="菜单分配" :visible.sync="menuDialogVis" width="30%">
      <el-tree
          :props="props"
          :data="menuData"
          show-checkbox
          :check-strictly="checkStrictly"
          node-key="id"
          :default-expanded-keys="expends"
          :default-checked-keys="checks"
          ref="tree">
        <span class="custom-tree-node" slot-scope="{node, data}">
          <span><i :class="data.icon"></i>  {{ data.name }}</span>
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" type="info" @click="cancel">取 消</el-button>
        <el-button icon="el-icon-circle-check" type="primary" @click="saveRoleMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "User",
  data() {
    return {
      //数据
      tableData: [],
      //输入框
      name: '',
      multipleSelection: [],
      //表单弹窗
      dialogFormVisible: false,
      //新增和修改是否有id
      idVerify: false,
      form: {},
      //分页数据
      current: 1,
      pageSize: 5,
      total: 0,

      menuDialogVis: false,

      menuData: [],
      roleId: 0,

      expends: [],
      checks: [],
      checkStrictly: true,
      props: {
        label: 'name',
      },
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : {},
      role: '',
    }
  },
  methods: {
    cancel() {
      this.menuDialogVis = false;
      this.checkStrictly = true
    },
    //树形菜单
    selectMenu(row) {
      this.role = row.soleKey
      //请求菜单数据
      request.get('menu').then(
          res => {
            if (res.code !== '401'){
              this.menuData = res.data
              this.expends = this.menuData.map(value => value.id)
            }
          }
      )
      //角色id
      this.roleId = row.id
      //设置菜单数据
      request.get('role/roleMenu/' + this.roleId).then(
          res => {
            this.checks = res.data
          }
      )

      setTimeout(() => {
        //控制框框选中
        this.checkStrictly = false
      },2000)

      //弹窗
      this.menuDialogVis = true
    },
    //初始化加载
    load() {
      //请求分页数据
      request.get('role/find', {
        params: {
          current: this.current, pageSize: this.pageSize,name: this.name
        }
      }).then(
          res => {
            if (res.code !== '401'){
              this.tableData = res.data.records
              this.total = res.data.total
            }
          }
      )
    },
    //批量删除
    delBatch() {
      let ids = this.multipleSelection.map(i => i.id);
      if (ids.length > 0) {
        request.post('role/del/batch', ids).then(
            res => {
              if (res.code === '200') {
                this.$message.success('批量删除成功')
                this.load()
              }
              if (res.code === '500' || res.code === '400' || res.code === '0') {
                if (res.code === '0'){
                  this.$message.error(res.msg)
                  return
                }
                this.$message.error(res.msg)
              }
            })
      } else {
        this.$message.info('还没有选择任何信息')
      }
    },
    //获取多删选择框数据
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //删除
    handleDelete(id) {
      request.delete('role/' + id).then(
          res => {
            if (res.code === '200') {
              this.$message.success('删除成功')
              this.load()
            }
            if (res.code === '500' || res.code === '400' || res.code === '0') {
              if (res.code === '0'){
                this.$message.error(res.msg)
                return
              }
              this.$message.error(res.msg)
            }
          }
      )
    },
    //打开修改框
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.idVerify = true
      this.dialogFormVisible = true
    },
    saveRoleMenu() {
      // 获取选中的子节点
      let checkedKeys = this.$refs.tree.getCheckedKeys();
      // 获取选中的父节点
      let hafCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
      // 合并
      let ids = checkedKeys.concat(hafCheckedKeys)
      //发送
      request.post('role/roleMenu/' + this.roleId , ids).then(
          res => {
            if (res.code === '200') {
              if (this.role === this.user.role) {
                this.$message.info('修改了当前登录用户菜单，重新登录')
                this.$store.commit('resetUser')
                this.checkStrictly = true
                return;
              }
              this.$message.success('绑定成功')
              this.checkStrictly = true
              this.menuDialogVis = false
            }else {
              this.$message.error(res.msg)
            }
          }
      )
    },
    //执行修改和添加
    save() {
      request.post('role/save', this.form).then(
          res => {
            if (this.form.id) {
              if (res.code === '200') {
                this.$message.success('更新成功')
                this.dialogFormVisible = false
                this.idVerify = false
                this.load()
              } else {
                this.$message.error('更新失败')
              }
            } else {
              if (res.code === '200') {
                this.$message.success('添加成功')
                this.dialogFormVisible = false
                this.load()
              } else {
                this.$message.error('添加失败')
              }
            }
          }
      )
    },
    //打开添加框
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },
    //重置查询
    reset() {
      this.name = ''
      this.load()
    },
    //搜索
    search() {
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
  },
  //页面呈现之前执行
  created() {
    this.load()
  },
}
</script>