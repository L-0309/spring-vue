<template>
<div class="wrapper">
  <div style="margin: 200px auto; background-color: #fff;width: 350px ; height: 300px; padding: 20px; border-radius: 10px">
    <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>登 录</b></div>
    <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-user" v-model="user.username"></el-input>
    <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password v-model="user.password"></el-input>
    <div style="margin: 10px 0; text-align: right">
      <el-button type="primary" size="small" @click="handleLogin" autocomplete="off">登 录</el-button>
      <el-button type="warning" size="small" @click="handleRegister" autocomplete="off">注 册</el-button>
    </div>
  </div>
</div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Login",
  data() {
    return {
      user:{username: 'zhadan', password: 'zhadan'}
    }
  },
  methods: {
    handleLogin(){
      if (this.user.username === '' || this.user.username === null){
        this.$message.error("用户名为空")
        return
      }
      if (this.user.password === '' || this.user.password === null){
        this.$message.error("密码为空")
        return
      }
      request.post('user/login',this.user).then(
          res =>{
            if (res.code === '200'){
              localStorage.setItem("user", JSON.stringify(res.data)) //存储用户信息到浏览器
              this.$router.push('/home')
              this.$message({
                type: 'success',
                message: '登录成功',
                duration: 1000
              })
            }
            if (res.code === '400' || res.code === '0' || res.code === '500'){
              if (res.code === '0'){
                this.$message.info(res.msg)
                return
              }
              this.$message.error(res.msg)
            }
          }
      )
    },
    handleRegister(){
      this.$router.push('/register')
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