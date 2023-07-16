<template>
  <div>
    <h2>文章详情 </h2>
    <span style="font-size: 18px; color: rgba(215,40,231,0.87)">标题:{{article.name}}</span>
    <div style="float: right;width: 400px;text-align: center;height: 40px;line-height: 40px">
      <span><el-button type="info" @click="back">返回</el-button></span>
      <span style="font-size: 12px;margin: 10px 20px;color: rgba(245,8,34,0.62);"> <i class="el-icon-user"></i> 发布人：{{article.userNickname}}</span>
      <span style="font-size: 12px;margin-top: 10px;color: rgba(154,4,173,0.62)"> <i class="el-icon-time"></i> 发布时间：{{article.time}}</span>
    </div>
    <div style="padding: 20px">
      <mavon-editor
          class="md"
          :value="article.content"
          :subfield="false"
          :defaultOpen="'preview'"
          :toolbarsFlag="false"
          :editable="false"
          :scrollStyle="true"
          :ishljs="true"
      />
    </div>
    <div style="padding: 30px">
      <div class="mr-5 mr-5">
        <div style="border-bottom: 1px solid orangered;padding: 10px 0;font-size: 20px">评论</div>
        <div style="padding: 10px">
          <el-input size="medium" type="textarea" v-model="commentFrom.content"></el-input>
        </div>
        <div class="pd-10" style="text-align: right">
          <el-button type="primary" size="medium" @click="save">评论</el-button>
        </div>
      </div>
<!--      评论列表-->
      <div>
        <div v-for="item in comments" :key="item.id" style="border-bottom: 1px solid #ccc;padding: 10px 0;display: flex">
          <!--          头像-->
          <div style="width: 100px;text-align: center">
            <el-image :src="item.avatarUrl" style="width: 50px;height: 50px;border-radius: 50%"></el-image>
          </div>
          <!--          评论内容-->
          <div style="flex: 1;color: rgba(86,58,58,0.59);padding: 3px 0;line-height: 30px">
            <div v-if="item.userId === article.userId" style="color: red;font-size: 10px">作者评论</div>
            <b>{{ item.nickname }}：</b>
            <span>{{ item.content }}</span>
            <div style="display: flex">
              <div style="width: 200px">
                <i class="el-icon-time"></i> <span style="color: rgba(154,4,173,0.62)">{{item.time}}</span>
              </div>
              <div style="text-align: right;flex: 1">
                <el-button style="margin-left: 5px" type="text" @click="handleReply(item.id)">回复</el-button>
                <el-button style="color: red" type="text" @click="del(item.id)"
                           v-if="user.role === 'ROLE_ADMIN' || item.userId === user.id">删除
                </el-button>
              </div>
            </div>
<!--            回复内容-->
            <div v-if="item.children.length" v-for="subItem in item.children" style="margin-left: 10px;padding: 10px;display: flex;border-bottom: 1px solid #ccc">
              <div style="width: 70px;text-align: center;">
                <el-image :src="subItem.avatarUrl" style="width: 50px;height: 50px;border-radius: 50%"></el-image>
              </div>
              <div style="flex: 1;background: #dedede">
                <div v-if="subItem.userId === article.userId" style="color: red;font-size: 10px;">作者回复</div>
                <div style="color: #2a98ff">
                  <span>@{{subItem.nickname}}</span>
                </div>
                <b v-if="subItem.pname !== null && subItem.pname !== ''">{{ subItem.nickname }} <span style="color: rgba(140,147,157,0.52)">回复</span> {{ subItem.pname }}：</b>
                <b v-else>{{ subItem.nickname }}：</b>
                <span>{{ subItem.content }}</span>
                <div style="display: flex">
                  <div style="width: 200px">
                    <i class="el-icon-time"></i> <span style="color: rgba(53,55,168,0.8)">{{subItem.time}}</span>
                  </div>
                  <div style="text-align: right;flex: 1">
                    <el-button style="margin-left: 5px" type="text" @click="handleReply(subItem.id)">回复</el-button>
                    <el-button style="color: red" type="text" @click="del(subItem.id)"
                               v-if="user.role === 'ROLE_ADMIN' || subItem.userId === user.id">删除
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="回复信息" :visible.sync="dialogFormVisible" width="50%">
      <el-form label-width="100px">
        <el-input type="textarea" v-model="commentFrom.conentReply" size="medium" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" type="info" @click="dialogFormVisible = false;">取 消</el-button>
        <el-button icon="el-icon-circle-check" type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "ArticleDetail",
  data() {
    return {
      article: {},
      comments: [],
      commentFrom:{},
      id: this.$route.query.id,
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : {},
      dialogFormVisible: false,
    }
  },
  methods:{
    handleReply(pid) {
      this.commentFrom = { pid: pid}
      this.dialogFormVisible = true
    },
    save() {
      this.commentFrom.articleId = this.id
      this.commentFrom.userId = this.user.id
      if (this.commentFrom.conentReply) {
        this.commentFrom.content = this.commentFrom.conentReply
      }
      request.post('comment/save',this.commentFrom).then(
          res => {
            if (res.code === '200') {
              this.loadComment()
              this.$message.success('评论成功')
              this.dialogFormVisible = false
              this.commentFrom = {}
            }else {
              this.$message.error(res.msg)
            }
          }
      )
    },
    del(id) {
      request.delete('comment/del/' + id).then(
          res =>{
            if (res.code === '200') {
              this.$message.success('删除成功')
              this.loadComment()
            }
            if (res.code === '0'){
              this.$message.info(res.msg)
            }
            if (res.code === '500') {
              this.$message.error(res.msg)
            }
          }
      )
    },
    back() {
      this.$router.push('/front/article')
    },
    load() {
      request.get('article/detail/' + this.id).then(
          res => {
            this.article = res.data
          }
      )

    },
    loadComment() {
      request.get('comment/tree/' + this.id).then(
          res => {
            this.comments = res.data
          }
      )
    }
  },
  mounted() {
    this.load()
    this.loadComment()
  }
}
</script>

<style scoped>

</style>