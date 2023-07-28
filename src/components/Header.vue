<template>
  <div style="font-size: 22px;line-height: 60px; display: flex">
    <div style="flex: 1">
      <span :class="collapseBtnClass" style="cursor: pointer;" @click="collapse"></span>
      <el-breadcrumb separator="/" style="display: inline-block;margin-left: 30%">
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div style="float: right;line-height: 60px">
        <el-button type="info" @click="pushHome">去前台页面</el-button>
      </div>
    </div>

    <div style="display: inline-block">
      <el-avatar shape="circle" style="margin-top: 5px; width: 50px;height: 50px" :src="user.avatar"/>
    </div>

    <div style="line-height: 53px">
      <el-dropdown split-button @command="handleCommand" type="primary">
        {{ user.nickname }}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="personal">个人信息</el-dropdown-item>
          <el-dropdown-item command="password">修改密码</el-dropdown-item>
          <el-dropdown-item command="switchUser">切换用户</el-dropdown-item>
          <el-dropdown-item command="quit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {serverIp} from "../../public/config";

export default {
  name: "Header",
  props: {
    collapseBtnClass: String,
    collapse: Boolean
  },
  data() {
    return {
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : {},
      server: serverIp
    }
  },
  mounted() {
    if (this.user.avatar === null || this.user.avatar === ''){
      this.user.avatar = `http://${this.server}:8111/images/defaultPhoto.jpg`
    }
    if (this.user.nickname === null || this.user.nickname === ''){
      this.nickname = '无昵称'
      this.$message.info('没有昵称，请设置昵称后重新登录')
    }
  },
  computed: {
    currentPathName(){
      return this.$store.state.currentPathName
    }
  },
  methods: {
    pushHome() {
      this.$router.push('/front/home')
    },
    handleCommand(command){
      if (command === 'quit'){
        this.quit()
      }
      if (command === 'personal'){
        this.personal()
      }
      if (command === 'password') {
        this.passwordEdit()
      }
      if (command === 'switchUser') {
        this.switchUser()
      }
    },
    switchUser() {
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    quit () {
      this.$store.commit('resetUser')
      this.$message.success('退出成功')
    },
    passwordEdit() {
      this.$router.push('/password')
    },
    personal(){
      this.$router.push('/person')
    }
  }
}
</script>

<style scoped>

</style>