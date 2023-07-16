<template>
  <el-menu style="height: 100%; overflow-x: hidden"
           background-color="rgb(48, 65, 86)"
           text-color="#fff"
           active-text-color="#ffd04b"
           :collapse-transition="false"
           :collapse="isCollapse"
           router
           :default-active="path"
  >
    <div v-show="titleName" style="height: 60px; line-height: 60px; text-align: center">
      <img src="../assets/logo.png" alt="" style="width: 20px; position: relative; top: 5px; margin-right: 5px">
      <b style="color: white">后台管理系统</b>
    </div>


<!--    一级菜单-->
    <div v-for="item in menus" :key="item.id">
<!--      一级菜单中没有子菜单-->
      <div v-if="item.path">
        <el-menu-item :index="item.path">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </div>
<!--      一级菜单中有子菜单-->
      <div v-else-if="!item.path && item.children">
        <el-submenu v-bind:index="item.name">
          <template slot="title">
            <i :class="item.icon"></i><span> {{item.name}} </span>
          </template>
<!--          循环二级菜单-->
          <div v-for="child in item.children">
            <!--      二级菜单中没有子菜单-->
            <div v-if="child.path">
              <el-menu-item :index="child.path">
                <i :class="child.icon"></i>
                <span slot="title">{{ child.name }}</span>
              </el-menu-item>
            </div>
            <!--      二级菜单中有子菜单-->
            <div v-else-if="!child.path">
              <el-submenu :index="child.name">
                <template slot="title">
                  <i :class="child.icon"></i><span> {{child.name}} </span>
                </template>
<!--                循环三级菜单-->
                <div v-for="children in child.children">
                  <!--      三级菜单中没有子菜单-->
                  <div v-if="children.path">
                    <el-menu-item :index="children.path">
                      <i :class="children.icon"></i>
                      <span slot="title">{{ children.name }}</span>
                    </el-menu-item>
                  </div>
                  <!--      三级菜单中有子菜单-->
                  <div v-if="!children.path">稍后补充</div>
                </div>
              </el-submenu>
            </div>
          </div>
        </el-submenu>
      </div>
    </div>


  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props: {
    isCollapse: Boolean,
    titleName: Boolean,
  },
  data() {
    return {
      menus: [],
      path: this.$route.path
    }
  },
  created() {
    this.menus = JSON.parse(localStorage.getItem('user')).menus
  }
}
</script>

<style scoped>

</style>