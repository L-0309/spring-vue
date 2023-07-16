<template>
  <div class="frem">
    <p>404</p>
    <h2>看起来你迷路了</h2>
    <h5>你所寻找的页面已丢失!</h5>
    <el-button style="font-size: 30px;" type="info" @click="handleHome">返回首页</el-button>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  data() {
    return {
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : {},
    }
  },
  methods: {
    handleHome() {
      if (this.user.role === 'ROLE_STUDENT') {
        this.$router.push('/front/home')
      }else {
        this.$router.push('/home')
      }
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.frem{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: url('http://175.178.184.206/usr/themes/handsome/gifs.gif') no-repeat center;
}
.frem p{
  position: absolute;
  top: 3rem;
  font-size: 7rem;
  color: #00000063;
}
.frem h2{
  position: absolute;
  bottom: 8rem;
  font-size: 34px;
}
.frem h5{
  position: absolute;
  bottom: 6rem;
  color: #9c9c9c;
}
.frem a{
  position: absolute;
  bottom: 1rem;
  background: linear-gradient(45deg, #2a98ff, #09ff00);
  padding: 12px;
  color: white;
  text-decoration: none;
  font-size: 20px;
  border-radius: 13px;
}
</style>