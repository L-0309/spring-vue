<template>
<div>
  <!--          内容-->
  <el-table :data="tableData" border stripe>
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="id" label="ID" width="60"></el-table-column>
    <el-table-column prop="username" label="用户名" ></el-table-column>
    <el-table-column prop="soleKey.name" label="角色"></el-table-column>
    <el-table-column prop="nickname" label="昵称"></el-table-column>
    <el-table-column prop="email" label="邮箱"></el-table-column>
    <el-table-column prop="phone" label="电话"></el-table-column>
    <el-table-column prop="address.address" label="地址"></el-table-column>
    <el-table-column label="操作" width="185">
      <template v-slot="scope">
        <el-button type="success" @click="lookCourse(scope.row)" size="mini">
          查看已选课程<i class="el-icon-zoom-in"></i>
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
  <el-dialog title="课程信息" :visible.sync="dialogCourse" width="40%">
    <el-table :data="courses" border stripe>
      <el-table-column prop="name" label="课程名称"></el-table-column>
      <el-table-column prop="score" label="学分"></el-table-column>
      <el-table-column prop="times" label="课时"></el-table-column>
      <el-table-column prop="teacher" label="授课老师"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" type="info" @click="dialogCourse = false">取 消</el-button>
      <el-button icon="el-icon-circle-check" type="primary" @click="dialogCourse = false">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Teacher",
  data() {
    return {
      //分页数据
      current: 1,
      pageSize: 5,
      total: 0,
      dialogCourse: false,
      courses: [],
      tableData: [],
      records: '',
    }
  },
  methods: {
    lookCourse(row) {
      request.get('course/studentList', {
        params: {
          id: row.id
        }
      }).then(
          res => {
            if (res.code === '200') {
              this.courses = res.data
              this.dialogCourse = true
            }
            if (res.code === '0') {
              this.$message.info(res.msg)
            }
          }
      )
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
    //初始化加载
    load() {
      //请求分页数据
      request.get('user/find', {
        params: {
          current: this.current, pageSize: this.pageSize, role: "ROLE_STUDENT"
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
  },
  created() {
    this.load()
  }
}
</script>

<style scoped>

</style>