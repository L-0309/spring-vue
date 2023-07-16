<template>
<div>
  <el-card style="width: 500px">
    <el-form label-width="120px" size="small" :model="form" ref="pass">
      <el-form-item label="原密码：">
        <el-input v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码：">
        <el-input v-model="form.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：">
        <el-input v-model="form.confirmPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-circle-check" type="primary" @click="save">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Password",
  data() {
    return {
      form: {},
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : {},
    }
  },
  methods: {
    save() {
      if (this.form.newPassword !== this.form.confirmPassword) {
        this.$message.error('两次密码不一致')
        return;
      }
      this.form.username = this.user.username
      request.post('user/password', this.form).then(
          res => {
            if (res.code === '500') {
              this.$message.error(res.msg)
            }else {
              this.$message.success('修改成功')
              this.$store.commit('resetUser')
            }
          }
      )
    }
  },
  created() {

  }
}
</script>

<style scoped>

</style>