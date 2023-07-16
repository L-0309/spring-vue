<template>
  <div>
    <!--          搜索区域-->
    <div class="pd-10">
      <el-input style="width: 200px" v-model="username" placeholder="请输入名称" suffix-icon="el-icon-place"
                clearable></el-input>
      <el-input style="width: 200px" v-model="email" placeholder="请输入邮箱" suffix-icon="el-icon-message"
                class="ml-5" clearable></el-input>
<!--      下拉框-->
      <el-select class="ml-5" v-model.number="id" clearable placeholder="请选择地址" @change="IdChange" size="mini">
        <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.address"
            :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="role" clearable placeholder="请选择角色" @change="nameChange" size="mini">
        <el-option v-for="item in roles" :key="item.id"
                   :label="item.name"
                   :value="item.soleKey">
        </el-option>
      </el-select>
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
<!--      <el-button type="primary" class="ml-5" @click="handleImport">导入 <i class="el-icon-bottom"></i></el-button>-->
<!--      <el-button type="primary" class="ml-5" @click="handleExports">导出 <i class="el-icon-top"></i></el-button>-->
    </div>
    <!--          内容-->
    <el-table :data="tableData" @selection-change="handleSelectionChange" border stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="username" label="用户名" width="80"></el-table-column>
      <el-table-column prop="soleKey.name" label="角色" width="120">
<!--        <template v-slot="scope">-->
<!--          <span style="font-size: 1px"> {{  }} </span>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="phone" label="电话" width="150"></el-table-column>
      <el-table-column prop="address.address" label="地址" width="80"></el-table-column>
      <el-table-column label="封面" width="80">
        <template v-slot="scope">
          <el-image style="width: 50px;height: 50px" :src="scope.row.avatar"/>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="180"></el-table-column>
      <el-table-column label="操作" width="185">
        <template v-slot="scope">
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
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="80px">
        <el-form-item v-show="idVerify" label="id：">
          <el-input v-model="form.id" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="用户名：">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色：">
          <el-select v-model="form.role" clearable placeholder="请选择角色" disabled size="mini">
            <el-option v-for="item in roles" :key="item.id"
                :label="item.name"
                :value="item.soleKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称：">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像：">
          <el-upload
              :action="server"
              :show-file-list="false"
              :on-success="fileUploadSuccess">
            <img v-if="form.avatar" :src="form.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="地址：">
          <el-select v-model="form.addressId" clearable placeholder="请选择地址" @change="handleSave" size="mini">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.address"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" type="info" @click="dialogFormVisible = false; idVerify = false">取 消</el-button>
        <el-button icon="el-icon-circle-check" type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

    <!--    导出成功触发-->
    <el-dialog title="导出成功" :visible.sync="dialogVisible" width="30%">
      <span>是否打开此文件</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="dialogVisible = false">取 消 <i class="el-icon-circle-close"></i> </el-button>
        <el-button type="primary" @click="handleOpenFile">确 定 <i class="el-icon-circle-check"></i></el-button>
      </span>
    </el-dialog>

    <!--    导入弹窗-->
    <el-dialog :visible.sync="dialogImportVisible" width="10%">
      <el-upload accept=".xlsx" :show-file-list="false" :action='importPath' :on-success="dialogImport">
        <i class="el-icon-upload"></i>
        <span class="el-upload__text ml-5 pd-10">拖拽,或点击上传</span>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import {serverIp} from "../../public/config";

export default {
  name: "User",
  data() {
    return {
      //数据
      tableData: [],
      //输入框
      username: '',
      email: '',
      address: '',
      multipleSelection: [],
      //表单弹窗
      dialogFormVisible: false,

      //导出弹窗
      dialogVisible: false,
      //导入弹窗
      dialogImportVisible: false,
      //新增和修改是否有id
      idVerify: false,
      exportPath: '',

      role: '',

      form: {},
      roles : [],
      courses: [],
      //分页数据
      current: 1,
      pageSize: 5,
      total: 0,

      //select框查询
      id: '',
      options:[],

      //ip
      server: this.serverIp,
      //导入请求路径
      importPath: `http://${serverIp}:8111/user/import`
    }
  },
  methods: {
    nameChange(role) {
      this.role = role
      this.load()
    },
    //修改添加下拉框变化回调
    handleSave(id){
      this.form.addressId = id
    },
    //查询下拉框变化回调
    IdChange(id){
      this.addressId = id
      this.load()
    },
    //图片成功回调
    fileUploadSuccess(resp){
      if (resp.code === '200'){
        this.form.avatar = resp.data
        this.$message.success('文件上传成功')
      }
      if (resp.code === '0'){
        this.form.avatar = resp.data
        this.$message.info(resp.msg)
      }
      if (resp.code === '400'){
        this.$message.error(resp.msg)
      }
    },
    //打开导出文件
    handleOpenFile() {
      request.get('user/exportPath', {
        params: {exportPath: this.exportPath}
      }).then(
          res => {
            if (res.code === '200') {
              this.reset()
              this.dialogVisible = false
            } else {
              this.$message.error('打开失败')
            }
          }
      )
    },
    //处理导出
    handleExports() {
      request.get('user/export', {
        params: {
          current: this.current, pageSize: this.pageSize,
          username: this.username, email: this.email, addressId: this.addressId
        }
      }).then(
          res => {
            if (res.code === '200') {
              //成功
              this.$message.success('导出成功')
              this.exportPath = res.data.exportPath
              this.dialogVisible = false
            }
            if (res.code === '500'){
              this.$message.error(res.msg)
            }
          }
      )
    },
    //初始化加载
    load() {
      //请求分页数据
      request.get('user/find', {
        params: {
          current: this.current, pageSize: this.pageSize,
          username: this.username, email: this.email, addressId: this.addressId, role: this.role
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
    //下拉框数据初始化加载
    addresses(){
      request.get('address').then(
          resp =>{
            this.options = resp.data
          }
      )
    },
    //批量删除
    delBatch() {
      let ids = this.multipleSelection.map(i => i.id);
      if (ids.length > 0) {
        request.post('user/del/batch', ids).then(
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
      request.delete('user/' + id).then(
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
    //执行修改和添加
    save() {
      request.post('user/save', this.form).then(
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
      this.username = ''
      this.email = ''
      this.addressId = 0
      this.id = ''
      this.role = ''
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
    //打开文件上传弹窗
    handleImport() {
      this.dialogImportVisible = true
    },
    //关闭
    dialogImport() {
      this.$message.success("文件导入成功")
      this.dialogImportVisible = false
      this.load()
    }
  },
  //页面呈现之前执行
  created() {
    this.load()
    this.addresses()
  },
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 118px;
  height: 118px;
  line-height: 118px;
  border-style: dashed;
  text-align: center;
}
.avatar {
  width: 118px;
  height: 118px;
  display: block;
}
</style>
