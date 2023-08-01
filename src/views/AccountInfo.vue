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
<!--    菜单-->
    <div style="width: 300px;padding: 30px;float: right">
      <el-card>
        <div style="color: rgba(238,83,83,0.6);text-align: center">账号所拥有的菜单权限</div>
        <el-tree :data="treeDate" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-card>
    </div>

<!--   发布的文章 -->
    <div style="width: 800px;background: #f4f4f4; margin-top: 5px; padding: 30px;float: left">
      <el-card>
        <div style="color: rgba(141,5,5,0.6);text-align: center;font-size: 17px"><b>发布的文章</b></div>
        <div v-if="article.length > 0">
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
        </div>
        <div v-else style="margin: 10px 0; padding: 20px; color: #666; border-bottom: 1px dashed #ccc">
          <div style="font-size: 18px; width: 250px; color: #ccc;display: inline-block">
            暂无发布的文章
          </div>
        </div>
      </el-card>
    </div>
<!-- 关注的用户-->
    <div style="float: left;padding: 30px;background: #f4f4f4;margin-top: 5px;width: 800px">
      <el-card>
        <div style="color: #ccc;text-align: center;font-size: 17px"><b>关注的用户</b></div>
        <div v-if="attentionUser !== null">
          <div v-for="item in attentionUser" :key="item.id"
               style="margin: 10px 0; padding: 20px; color: #666; border-bottom: 1px dashed #ccc">
            <div style="font-size: 18px; width: 250px; color: #ccc;display: inline-block">
              用户名:{{item.username}}
            </div>
            <div style="font-size: 18px; width: 250px; color: #ccc;display: inline-block">
              电话:{{item.phone}}
            </div>
            <div style="font-size: 18px; width: 100px; cursor: pointer;color: #ccc; float: right" @click="handleDrawer(item)">
              昵称:{{item.nickname}}
            </div>
          </div>
        </div>
        <div v-else style="margin: 10px 0; padding: 20px; color: #666; border-bottom: 1px dashed #ccc">
          <div style="font-size: 18px; width: 250px; color: #ccc;display: inline-block">
            暂无关注的用户
          </div>
        </div>
      </el-card>
    </div>

<!--    关注的文章-->
    <div style="width: 800px;background: #f4f4f4; margin-top: 5px; padding: 30px;float: left">
      <el-card>
        <div style="color: rgba(75,11,232,0.6);text-align: center;font-size: 17px"><b>关注的文章</b></div>
        <div v-if="attentionArticle !== null">
          <div v-for="item in attentionArticle" :key="item.id" style="margin: 10px 0;
         padding: 20px; color: #666; border-bottom: 1px dashed #ccc">
          <span style="font-size: 18px; cursor: pointer;color: rgba(201,6,123,0.87)"
                @click="detail(item.id)">标题:{{item.name}}</span>
            <div style="float: right;width: 500px;text-align: center;height: 40px;line-height: 30px">
            <span v-for="count in countArticleComment">
              <span v-if="item.id === count.articleId" style="font-size: 12px;color: rgba(84,2,82,0.62);margin: 10px 20px">
                <i class="el-icon-more"></i> 评论数：{{count.count}}
              </span>
            </span>
              <span style="font-size: 12px;margin-top: 10px;color: rgba(154,4,173,0.62)">
                <i class="el-icon-user"></i> 发布人：{{item.user.nickname}}
              </span>
            </div>
          </div>
        </div>
        <div v-else style="margin: 10px 0; padding: 20px; color: #666; border-bottom: 1px dashed #ccc">
          <div style="font-size: 18px; width: 250px; color: #ccc;display: inline-block">
            暂无关注的文章
          </div>
        </div>
      </el-card>
    </div>

    <el-drawer
        :title="promptInfo"
        :visible.sync="drawer"
        :direction="direction"
        :show-close="false"
        size="50%"
        :before-close="handleClose">
      <div v-for="item in otherUserArticles" :key="item.id" style="margin: 10px 0;
         padding: 20px; color: #666; border-bottom: 1px dashed #ccc">
          <span style="font-size: 18px; cursor: pointer;color: rgba(0,133,243,0.87)"
                @click="detail(item.id)">标题:{{item.name}}</span>
        <div style="float: right;width: 500px;text-align: center;height: 40px;line-height: 30px">
          <span style="font-size: 12px;margin-top: 10px;color: rgba(0,133,243,0.87)">
            <i class="el-icon-time"></i> 发布时间：{{item.time}}
          </span>
        </div>
      </div>
    </el-drawer>

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
      otherUserArticles:[],
      attentionUser: [],
      attentionArticle: [],
      drawer: false,
      direction: 'btt',
      promptInfo: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    handleDrawer(item) {
      this.promptInfo = item.nickname + "的文章"
      request.get('article/findAll/' + item.id).then(
          res =>{
            console.log(res)
            if (res.code === '200') {
              this.otherUserArticles = res.data
              this.drawer = true
            }
          }
      )
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
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
    loadAttentionArticle() {
      request.get('attention/findAllByArticleId/' + this.user.id).then(
          res => {
            this.attentionArticle = res.data
          }
      )
    },
    loadAttention() {
      request.get('attention/findAllByUserId/' + this.user.id).then(
          res => {
            this.attentionUser = res.data
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
    this.loadAttention()
    this.loadAttentionArticle()
  }
}
</script>

<style scoped>

</style>