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
    <div style="width: 300px;padding: 20px;float: left">
      <el-card>
        <div style="color: rgba(238,83,83,0.6);text-align: center">账号所拥有的菜单权限</div>
        <el-tree :data="treeDate" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-card>
    </div>
    <div style="width: 800px;padding: 30px;float: left">
      <el-card>
        <div style="color: rgba(141,5,5,0.6);text-align: center;font-size: 17px"><b>发布的文章</b></div>
        <div v-for="item in article" :key="item.id" style="margin: 10px 0;
         padding: 20px; color: #666; border-bottom: 1px dashed #ccc">
          <span style="font-size: 18px; cursor: pointer;color: rgba(215,40,231,0.87)"
                @click="detail(item.id)">标题:{{item.name}}</span>
          <div style="float: right;width: 500px;text-align: center;height: 40px;line-height: 30px">
            <span v-for="count in countArticleComment">
              <span v-if="item.id === count.articleId" style="font-size: 12px;color: rgba(245,8,34,0.62);margin: 10px 20px"> <i class="el-icon-more"></i> 评论数：{{count.count}}</span>
            </span>
            <span style="font-size: 12px;margin-top: 10px;color: rgba(154,4,173,0.62)"> <i class="el-icon-time"></i> 发布时间：{{item.time}}</span>
          </div>
        </div>
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
      article: [],
      countArticleComment: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    detail(id) {
      this.$router.push({path: '/front/articleDetail', query:{id: id}})
    },
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
    loadArticle() {
      request.get('article/findAll/' + this.user.id).then(
          res => {
            this.article = res.data
          }
      )
    },
  loadComment() {
    request.get('comment/findCountArticleComment').then(
        res => {
          this.countArticleComment = res.data
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
    this.loadComment()
    this.loadArticle()
  }
}
</script>

<style scoped>

</style>