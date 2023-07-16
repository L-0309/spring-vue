<template>
  <div style="height: 100%">
    <el-container style="height: 100%">
      <!--      侧边栏-->
      <el-aside :width="width + 'px'"
                style="background-color: rgb(238, 241, 246); height: 100%; overflow: hidden; box-shadow: 2px 0 6px rgb(0 21 41 / 35%)">
        <Aside :isCollapse="isCollapse" :titleName="titleName"/>
      </el-aside>

      <el-container>
        <!--        头部-->
        <el-header style="border: 1px solid #ccc">
          <Header :collapseBtnClass="collapseBtnClass" :collapse="isCollapse"/>
        </el-header>

        <!--        主体-->
        <el-main>
<!--          表示当前页面的子路由会在router里面展示-->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from "@/components/Aside";
import Header from "@/components/Header";

export default {
  data() {
    return {
      collapseBtnClass: 'el-icon-s-fold',
      width: 200,
      isCollapse: false,
      titleName: true,
    }
  },
  components: {Aside, Header},
  methods: {
    //控制侧边栏收缩
    collapse() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        // 点击收缩
        this.collapseBtnClass = 'el-icon-s-unfold'
        this.width = 64
        this.titleName = false
      } else {
        // 点击展开
        this.collapseBtnClass = 'el-icon-s-fold'
        this.width = 200
        this.titleName = true
      }
    },
  },
}
</script>
