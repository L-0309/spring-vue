<template>
<div>
  <div class="pd-10">
    <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
  </div>
  <el-table :data="tableData" border stripe>
    <el-table-column prop="name" label="图标名字"></el-table-column>
    <el-table-column label="图标样式">
      <template v-slot="scope">
        <i style="font-size: 20px" :class="scope.row.value"></i>
      </template>
    </el-table-column>
  </el-table>
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
  <el-dialog title="添加图标" :visible.sync="dialogFormVisible" width="40%">
    <el-form label-width="100px">
      <el-form-item label="图标名字：">
        <el-input v-model="form.name" placeholder="图标名字为唯一标识,不允许重复"  @blur="verifyName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="图标样式：">
        <el-input v-model="form.value" placeholder="使用的时element2,请从官网寻找图标" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" type="info" @click="dialogFormVisible = false;verifyIconName = false;">取 消</el-button>
      <el-button icon="el-icon-circle-check" type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "DistIcon",
  data() {
    return {
      msg: '信息',
      tableData: [],
      //分页数据
      current: 1,
      pageSize: 5,
      total: 0,
      form: {},
      dialogFormVisible: false,
      verifyIconName: false,
    }
  },
  methods: {
    verifyName() {
      request.get('dict/icon/' + this.form.name).then(
          res => {
            if (res.code === '200') {
              this.verifyIconName = true
            }
            if (res.code === '500') {
              this.$message.error(res.msg)
              this.verifyIconName = false
            }
            if (res.code === '0') {
              this.$message.info(res.msg)
              this.verifyIconName = false
            }
          }
      )
    },
    save() {
      if (!this.verifyIconName) {
        this.$message.error('请检查数据')
        return;
      }
      request.post('dict/save', this.form).then(
          res => {
            if (res.code === '200') {
              this.$message.success('添加成功')
              this.dialogFormVisible = false
              this.load()
            }
            if (res.cde === '500') {
              this.$message.error(res.msg)
              this.dialogFormVisible = false
              this.load()
            }
          }
      )
    },
    handleAdd() {
      this.form = {};
      this.dialogFormVisible = true;
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
    load() {
      request.get('dict/icon',{params: {current: this.current, pageSize: this.pageSize,}}
      ).then(
          res => {
            this.tableData = res.data.records
            this.total = res.data.total
          }
      )
    }
  },
  created() {
    this.load()
  }
}
</script>

<style scoped>

</style>