<template>
<div>
  <!--          搜索区域-->
  <div class="pd-10">
    <el-input style="width: 200px" v-model="name" placeholder="请输入课程名" suffix-icon="el-icon-s-promotion"
              clearable></el-input>
    <el-select v-model="teacherId" clearable placeholder="请选择老师" @change="teacher" size="mini">
      <el-option v-for="item in options" :key="item.id" :label="item.nickname" :value="item.id"></el-option>
    </el-select>
    <el-button type="primary" class="ml-5" icon="el-icon-search" @click="search">搜索</el-button>
    <el-button type="warning" class="ml-5" icon="el-icon-refresh" @click="reset">重置</el-button>
  </div>
<!--  操作区域-->
  <div v-if="user.role === 'ROLE_ADMIN'">
    <el-row>
      <el-col :span="2">
        <el-button type="primary" @click="handleAdd">新增课程<i class="el-icon-circle-plus-outline"></i></el-button>
      </el-col>
      <el-col :span="2">
        <el-popconfirm confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red"
                       title="确定批量删除吗？" @confirm="delBatch">
          <el-button slot="reference" type="danger">批量删除 <i class="el-icon-remove-outline"></i></el-button>
        </el-popconfirm>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="handleEnable">批量启用 <i class="el-icon-check"></i></el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="warning" @click="handleDisable">批量禁用 <i class="el-icon-close"></i></el-button>
      </el-col>
    </el-row>
  </div>

  <el-table :data="tableData" @selection-change="handleSelectionChange" border stripe>
    <el-table-column type="selection"></el-table-column>
    <el-table-column prop="id" label="ID" width="50"></el-table-column>
    <el-table-column prop="name" label="课程名称"></el-table-column>
    <el-table-column prop="score" label="学分"></el-table-column>
    <el-table-column prop="times" label="课时"></el-table-column>
    <el-table-column prop="teacher" label="授课老师"></el-table-column>
    <el-table-column label="是否开课">
      <template v-slot="scope">
        <el-switch v-model="scope.row.state" :disabled="disabled" @change="changeEnable(scope.row)" active-color="#13ce66"
                   inactive-color="#ccc"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template v-slot="scope">
        <el-button v-if="user.role === 'ROLE_STUDENT'" type="primary" @click="handleCourse(scope.row)" size="mini">
          选课<i class="el-icon-edit-outline"></i>
        </el-button>
        <el-button v-if="user.role !== 'ROLE_STUDENT'" type="success" @click="handleEdit(scope.row)" size="mini">
          编辑<i class="el-icon-edit-outline"></i>
        </el-button>
        <el-popconfirm
            class="ml-5"
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="handleDelete(scope.row)"
        >
          <el-button v-if="user.role === 'ROLE_ADMIN'" slot="reference" type="danger">删除 <i class="el-icon-remove-outline"></i></el-button>
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
  <el-dialog title="课程信息" :visible.sync="dialogFormVisible" width="30%">
    <el-form label-width="90px">
      <el-form-item label="id：">
        <el-input v-model="form.id"  autocomplete="off" readonly></el-input>
      </el-form-item>
      <el-form-item label="课程名称：">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="学分：">
        <el-input v-model="form.score" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="课时：">
        <el-input v-model="form.times" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="老师：">
        <el-select v-model="form.teacherId" placeholder="请选择老师" size="mini">
          <el-option v-for="item in options" :key="item.id" :label="item.nickname" :value="item.id"></el-option>
        </el-select>
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
  name: "Picture",
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      tableData: [],
      //分页数据
      current: 1,
      pageSize: 5,
      total: 0,
      //多删
      multipleSelection: [],
      name: '',
      pictureShow: false,
      options: [],
      teacherId: '',
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : {},
      disabled: Boolean
    }
  },
  methods: {
    handleCourse(row) {
      if (!row.state) {
        this.$message.info('课程还未开始')
      }else {
        request.post('student/course/' + row.id  + '/' + this.user.id).then(
            res => {
              if (res.code === '200') {
                this.$message.success('选课成功')
                this.load()
              }
              if (res.code === '0') {
                this.$message.info(res.msg)
              }
              if (res.code === '500') {
                this.$message.error(res.msg)
              }
            }
        )
      }
          },
    handleEdit(row) {
      if (!row.state) {
        this.$message.info('课程已关闭');
        return
      }
      this.form = JSON.parse(JSON.stringify(row))
      this.idVerify = true
      this.dialogFormVisible = true
    },
    handleAdd() {
      this.form = {}
      this.dialogFormVisible = true
    },
    save() {
      request.post('course/save', this.form).then(
          res => {
            if (res.code === '200') {
              this.$message.success('添加成功')
              this.dialogFormVisible = false
              this.load()
            }
          }
      )
    },
    teacher(teacherId) {
      this.teacherId = teacherId;
      this.load()
    },
    //启用
    handleEnable() {
      let enables = this.multipleSelection.map(u => u.id);
      request.post('course/enable', enables).then(
          resp => {
            if (resp.code === '200') {
              this.$message.success('操作成功')
              this.load()
            }
            if (resp.code === '500') {
              this.$message.error('操作失败')
            }
            if (resp.code === '0') {
              this.$message.info(resp.msg)
            }
          }
      )
    },
    //禁用
    handleDisable() {
      let disable = this.multipleSelection.map(u => u.id);
      request.post('course/disable', disable).then(
          resp => {
            if (resp.code === '200') {
              this.$message.success('操作成功')
              this.load()
            }
            if (resp.code === '500') {
              this.$message.error('操作失败')
            }
            if (resp.code === '0') {
              this.$message.info(resp.msg)
            }
          }
      )
    },

    //启用
    changeEnable(row) {
      if (this.user.role === 'ROLE_ADMIN'){
        request.post('course/update', row).then(
            res => {
              if (res.code === '200'){
                if (row.state){
                  this.$message.success('开课成功')
                }else {
                  this.$message.success('关课成功')
                }
              }
            }
        )
      }else {
        this.$message.info('无权限,请找管理员')
      }
    },
    //批量删除
    delBatch() {
      let ids = this.multipleSelection.map(i => i.id);
      let enable = this.multipleSelection.map(i => i.state);
      if (ids.length > 0) {
        for (let i = 0; i < enable.length; i++) {
          if (enable[i]){
            this.$message.info("有课程还在开课，无法删除")
            return
          }
        }
        request.post('course/del/batch', ids).then(
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    //删除
    handleDelete(id) {
      if (!id.state){
        request.delete('course/' + id.id).then(
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
      }else {
        this.$message.info("开课中无法删除")
      }
    },
    load() {
      request.get('course/find',{
        params:{
          current: this.current, pageSize: this.pageSize,
          name: this.name, teacherId: this.teacherId
        }
      }).then(
          res => {
            this.tableData = res.data.records
            this.total = res.data.total
          }
      )
    },
    teachers() {
      request.get('user/role/ROLE_TEACHER').then(
          res => {
            this.options = res.data
          }
      )
    },
    //重置查询
    reset() {
      this.name = ''
      this.teacherId = ''
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
  created() {
    this.disabled = !(this.user.role === 'ROLE_ADMIN' || this.user.role === 'ROLE_TEACHER');
    this.load()
    this.teachers()
  }
}
</script>

<style scoped>

</style>