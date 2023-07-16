<template>
  <div class="wrapper">
    <div style="margin: 200px auto; background-color: #fff;width: 350px ; height: 300px; padding: 20px; border-radius: 10px">
      <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>注 册</b></div>
      <el-input size="medium" placeholder="请输入账号" style="margin: 10px 0" prefix-icon="el-icon-user" v-model="user.username"></el-input>
      <el-input size="medium" placeholder="请输入密码" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password v-model="user.password"></el-input>
      <el-input size="medium" placeholder="请确认密码" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password v-model="user.confirmPassword"></el-input>
      <div style="margin: 10px 0; text-align: right">
        <el-button type="info" size="small" @click="handleLogin" autocomplete="off">返回登录</el-button>
        <el-button type="warning" size="small" @click="handleRegister" autocomplete="off">注 册</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Register",
  data() {
    return {
      user:{}
    }
  },
  methods: {
    handleRegister(){
      if (this.user.username === '' || this.user.username === null){
        this.$message.error("用户名为空")
        return
      }
      if (this.user.password === '' || this.user.password === null){
        this.$message.error("密码为空")
        return
      }
      if (this.user.confirmPassword !== this.user.password){
        this.$message.error('两次密码不一致')
        return;
      }

      request.post('user/register', this.user).then(
          res =>{
            if (res.code === '200'){
              this.$message.success('注册成功')
              this.$router.push('/login')
            }
            if (res.code === '400' || res.code === '500'){
              this.$message.error(res.msg)
            }
            if (res.code === '0'){
              this.$message.info(res.msg)
            }
          }
      )
    },
    handleLogin(){
      this.$router.push("/login")
    }
  },
}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom right, #FC466B, #3F5EFB);
  overflow: hidden;
}
</style>