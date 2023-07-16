<template>
  <div>
    <!--          搜索区域-->
    <div class="pd-10">
      <el-input style="width: 200px" v-model="name" placeholder="请输入文件名" suffix-icon="el-icon-s-promotion"
                clearable></el-input>
      <el-select class="ml-5" v-model.number="id" clearable placeholder="请选择类型" @change="IdChange" size="mini">
        <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" class="ml-5" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="warning" class="ml-5" icon="el-icon-refresh" @click="reset">重置</el-button>
    </div>

    <div>
<!--      :action=`http://${ip}:8111/files/upload`-->
      <el-upload style="display: inline-block" :action="server"
                 :on-success="fileUploadSuccess" :show-file-list="fileShow">
        <el-button size="mini" type="primary">点击上传 <i class="el-icon-folder-add"></i> </el-button>
      </el-upload>
      <el-popconfirm class="ml-5" confirm-button-text='确定' cancel-button-text='取消' icon="el-icon-info" icon-color="red"
                     title="确定批量删除吗？" @confirm="delBatch">
        <el-button slot="reference" type="danger">批量删除 <i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>
      <el-button type="primary" class="ml-5 ml-5" @click="handleEnable">批量启用 <i class="el-icon-check"></i></el-button>
      <el-button type="warning" @click="handleDisable">批量禁用 <i class="el-icon-close"></i></el-button>
    </div>

    <el-table :data="tableData" @selection-change="handleSelectionChange" border stripe>
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" label="ID" width="50"></el-table-column>
      <el-table-column label="文件名称">
        <template v-slot="scope">
          <span>{{scope.row.name.substring(0,scope.row.name.indexOf('.'))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="文件后缀"></el-table-column>
      <el-table-column prop="size" label="文件大小(kb)"></el-table-column>
      <el-table-column prop="classifier.name" label="文件类型"></el-table-column>
      <el-table-column label="查看文件">
        <template v-slot="scope">
          <el-button type="primary" @click="handleDetail(scope.row)">查看<i class="el-icon-zoom-in ml-5"></i></el-button>
        </template>
      </el-table-column>
      <el-table-column label="启用">
        <template v-slot="scope">
          <el-switch v-model="scope.row.enable" @change="changeEnable(scope.row)" active-color="#13ce66"
                     inactive-color="#ccc"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-popconfirm
              class="ml-5"
              confirm-button-text='确定'
              cancel-button-text='取消'
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              @confirm="handleDelete(scope.row)"
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
  </div>

</template>

<script>
import request from "@/utils/request";

export default {
  name: "File",
  data() {
    return {
      tableData: [],
      //分页数据
      current: 1,
      pageSize: 5,
      total: 0,

      //图片
      srcList: [],
      // ip: serverIp,
      //多删
      multipleSelection: [],
      name: '',

      //select框查询
      id: '',
      options:[],
      fileShow: false,
      server: this.serverIp
    }
  },
  methods: {
    IdChange(id){
      this.id = id
    },
    classifier(){
      request.get('classifier').then(
          res => {
            this.options = res.data
          }
      )
    },
    //文件上传
    fileUploadSuccess(resp) {
      if (resp.code === '200') {
        this.$message.success('文件上传成功')
        this.fileShow = false
        this.load()
      }
      if (resp.code === '0') {
        this.$message.info(resp.msg)
        this.fileShow = false
        this.load();
      }
      if (resp.code === '400') {
        this.$message.error(resp.msg)
      }
      if (resp.code === '500') {
        this.$message.error(resp.msg)
      }
    },

    //启用
    handleEnable() {
      let enables = this.multipleSelection.map(u => u.id);
      request.post('/files/enable', enables).then(
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
      request.post('/files/disable', disable).then(
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
    changeEnable(row) {
      request.post('/files/update', row).then(
          res => {
            if (res.code === '200'){
              if (row.enable){
                this.$message.success('启用成功')
              }else {
                this.$message.success('禁用成功')
              }
            }
          }
      )
    },
    handleDetail(row) {
      if (row.enable) {
        window.open(row.url)
      }else {
        this.$message.info("你已禁用此功能")
      }
    },
    //批量删除
    delBatch() {
      let ids = this.multipleSelection.map(i => i.id);
      let enable = this.multipleSelection.map(i => i.enable);
      if (ids.length > 0) {
        for (let i = 0; i < enable.length; i++) {
          if (!enable[i]){
            this.$message.info("有禁用功能，无法删除")
            return
          }
        }
        request.post('/files/del/batch', ids).then(
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
      if (id.enable){
        request.delete('files/' + id.id).then(
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
        this.$message.info("你已禁用此功能")
      }
    },
    load() {
      request.get('files/find', {
        params: {
          current: this.current, pageSize: this.pageSize,
          name: this.name, classifierId: this.id
        }
      }).then(
          res => {
            if (res.code !== '401') {
              this.tableData = res.data.records
              this.total = res.data.total
            }
          }
      )
    },
    //重置查询
    reset() {
      this.name = ''
      this.id = ''
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
    this.load()
    this.classifier()
  }
}
</script>