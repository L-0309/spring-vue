<template>
  <div>
    <!--          搜索区域-->
    <div class="pd-10">
      <el-input style="width: 200px" v-model="name" placeholder="请输入一级菜单名称名称" suffix-icon="el-icon-place"
                clearable></el-input>
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
    <el-table :data="tableData" @selection-change="handleSelectionChange"
              row-key="id" default-expand-all border stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="跳转">
        <template v-slot="scope">
          <el-button type="info" v-if="scope.row.path" @click="handlePath(scope.row.path)">前往此页面 <i
              class="el-icon-position"></i></el-button>
        </template>
      </el-table-column>
      <el-table-column label="图标">
        <template v-slot="scope">
          <i style="font-size: 20px" :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" width="300">
        <template v-slot="scope">
          <el-button type="success" @click="addChildren(scope.row.id)" size="mini" v-if="!scope.row.path">
            新增子菜单<i class="el-icon-plus"></i>
          </el-button>
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

    <!--          弹窗-->
    <el-dialog title="菜单信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="80px">
        <el-form-item v-show="idVerify" label="id：">
          <el-input v-model="form.id" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="名称：">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路径：">
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标：">
          <el-select clearable v-model="form.icon" style="width: 100%" placeholder="请选择">
            <el-option v-for="item in options" :key="item.name" :value="item.value">
              <i :class="item.value"/> {{ item.name }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" type="info" @click="dialogFormVisible = false; idVerify = false">取 消</el-button>
        <el-button icon="el-icon-circle-check" type="primary" @click="save">确 定</el-button>
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
      options: [],
    }
  },
  methods: {
    handlePath(path) {
      this.$router.push(path)
    },
    addChildren(id) {
      this.handleAdd(id)
    },
    //初始化加载
    load() {
      //请求分页数据
      request.get('menu', {
        params: {
          name: this.name
        }
      }).then(
          res => {
            if (res.code !== '401') {
              this.tableData = res.data
            }
          }
      )
    },
    //批量删除
    delBatch() {
      let ids = this.multipleSelection.map(i => i.id);
      if (ids.length > 0) {
        request.post('menu/del/batch', ids).then(
            res => {
              if (res.code === '200') {
                this.$message.success('批量删除成功')
                this.load()
              }
              if (res.code === '500' || res.code === '400' || res.code === '0') {
                if (res.code === '0') {
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
      request.delete('menu/' + id).then(
          res => {
            if (res.code === '200') {
              this.$message.success('删除成功')
              this.load()
            }
            if (res.code === '500' || res.code === '400' || res.code === '0') {
              if (res.code === '0') {
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
      this.iconLoad()
      this.form = JSON.parse(JSON.stringify(row))
      this.form.icon = ''
      this.idVerify = true
      this.dialogFormVisible = true
    },
    //执行修改和添加
    save() {
      request.post('menu/save', this.form).then(
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
    handleAdd(id) {
      this.iconLoad()
      this.idVerify = false
      this.dialogFormVisible = true
      this.form = {}
      if (id !== null && id > 0) {
        this.form.pid = id;
      }
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
    iconLoad() {
      request.get("menu/icons").then(
          res => {
            this.options = res.data
          }
      )
    }
  },
  //页面呈现之前执行
  created() {
    this.load()
  },
}
</script>