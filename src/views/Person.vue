<template>
  <el-card style="width: 500px">
    <el-form label-width="80px">
      <el-form-item label="id：">
        <el-input v-model="form.id" autocomplete="off" readonly></el-input>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input v-model="form.username" disabled autocomplete="off"></el-input>
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
      <el-upload
          class="avatar-uploader"
          :action="server"
          :show-file-list="false"
          :on-success="handleAvatarSuccess">
        <img v-if="form.avatar" :src="form.avatar" class="avatar" alt="logo">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
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
      <el-form-item>
        <el-button icon="el-icon-circle-check" type="primary" @click="save">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Person",
  data() {
    return {
      form: {},
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : {},
      options:[],
      server: this.serverIp,
    }
  },
  methods: {
    //修改添加下拉框变化回调
    load(){
      request.get('user/username/' + this.user.username).then(
          res =>{
            if (res.code === '200'){
              this.form = res.data
            }else {
              this.$message.error(res.msg)
            }
          }
      )
    },
    handleSave(id){
      this.form.addressId = id
    },
    //下拉框数据初始化加载
    addresses(){
      request.get('address').then(
          resp =>{
            this.options = resp.data
          }
      )
    },
    save(){
      request.post('user/save', this.form).then(
          res => {
            if (res.code === '200') {
              this.user.avatar = this.form.avatar
              this.user.nickname = this.form.nickname
              localStorage.setItem('user',JSON.stringify(this.user))
              location.reload()
              this.$message.success('保存成功')
            } else {
              this.$message.error('保存失败')
            }
          }
      )
    },
    handleAvatarSuccess(res){
      this.form.avatar = res.data
    },
  },
  created() {
    this.load()
    this.addresses()
  }
}
</script>

<style scoped>
.avatar-uploader {
  text-align: center;
}
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
  text-align: center;
}
.avatar {
  width: 118px;
  height: 118px;
  display: block;
}
</style>