<template>
  <div>
    <h1>账号信息</h1>
    <div style="">
      <span style="color: rgba(8,137,182,0.75)">当前账号角色：</span>
      <el-select style="margin-left: 20px" v-model="user.role" disabled size="mini">
        <el-option v-for="item in roles" :key="item.id"
                   :label="item.name"
                   :value="item.soleKey">
        </el-option>
      </el-select>
    </div>
    <div style="width: 300px;padding: 20px">
      <el-card>
        <div style="color: rgba(238,83,83,0.6);text-align: center">账号所拥有的菜单权限</div>
        <el-tree :data="treeDate" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "AccountInfo",
  data() {
    return {
      roles : [],
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : {},
      treeDate: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    load() {
      request.get('user/limit/' + this.user.role).then(
          res => {
            this.treeDate = res.data
          }
      )
      request.get('role').then(
          res => {
            this.roles = res.data
          }
      )
    },
    handleNodeClick(data) {
      console.log(data);
    }
  },
  created() {
  },
  mounted() {
    this.load()
  }
}
</script>

<style scoped>

</style>