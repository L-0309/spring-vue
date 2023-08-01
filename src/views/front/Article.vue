<template>
  <div style="margin: 10px 0">
    <h1>文章列表</h1>
    <div class="pd-10">
      <el-input style="width: 200px" v-model="name" placeholder="请输入标题" suffix-icon="el-icon-s-promotion"
                clearable></el-input>
      <el-select v-model="userId" no-data-text="登录后可搜索" clearable placeholder="请选择发布人" @change="getUserId" size="mini">
        <el-option v-for="item in options" :key="item.id" :label="item.nickname" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" class="ml-5" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="info" class="ml-5" icon="el-icon-document" @click="handleAddArticle">写文章</el-button>
    </div>
    <el-card>
      <div v-for="item in article" :key="item.id" style="margin: 10px 0; padding: 20px; color: #666; border-bottom: 1px dashed #ccc">
        <span style="font-size: 18px; cursor: pointer;color: rgba(215,40,231,0.87)" @click="detail(item.id)">标题:{{item.name}}</span>
        <div style="float: right;width: 400px;text-align: center;height: 40px;line-height: 40px">
          <span style="font-size: 12px;margin: 10px 20px;color: rgba(245,8,34,0.62);"> <i class="el-icon-user"></i> 发布人：{{item.user.nickname}}</span>
          <span style="font-size: 12px;margin-top: 10px;color: rgba(154,4,173,0.62)"> <i class="el-icon-time"></i> 发布时间：{{item.time}}</span>
        </div>
      </div>
    </el-card>
    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="[5, 10, 15, 20, 30]"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total">
      </el-pagination>
    </div>

    <el-dialog title="文章信息" :visible.sync="dialogFormVisible" width="60%">
      <el-form label-width="90px">
        <el-form-item label="标题：">
          <el-input v-model="form.name"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <mavon-editor ref="md" v-model="form.content" :ishljs="true" @imgAdd="imgAdd"></mavon-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" type="info" @click="dialogFormVisible = false">取 消</el-button>
        <el-button icon="el-icon-circle-check" type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import axios from "axios";

export default {
  name: "Picture",
  data() {
    return {
      article: [],
      //分页数据
      current: 1,
      pageSize: 10,
      total: 0,
      name: '',
      options: [],
      userId: '',
      dialogFormVisible: false,
      server: this.serverIp,
      form: {},
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : {},
    }
  },
  methods: {
    handleAddArticle() {
      //添加文章
      if (this.user.id) {
        this.form = {}
        this.dialogFormVisible = true
      }else {
        this.$message.info("登录后可写文章")
      }
    },
    save() {
      this.form.userId = this.user.id
      request.post('article/save', this.form).then(
          res => {
            if (res.code === '200') {
              this.$message.success('发布成功')
              this.dialogFormVisible = false
              this.load()
            }
          }
      )
    },
    imgAdd(pos, $file) {
      // 绑定@imgAdd event
      // 第一步.将图片上传到服务器.
      let formdata = new FormData();
      formdata.append('file', $file);
      axios ({
        url: this.server,
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((url) => {
        this.$refs.md.$img2Url(pos, url.data.data);
      })
    },
    getUserId(userId) {
      this.userId = userId;
      this.load()
    },
    userNickname() {
      request.get('user/nickname').then(
          res => {
            this.options = res.data
          }
      )
    },
    //改变页面大小触发
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    //改变当前页码触发
    handleCurrentChange(current) {
      this.current = current
      this.load()
    },
    detail(id) {
      if (this.user.id) {
        this.$router.push({path: '/front/articleDetail', query:{id: id}})
      }else {
        this.$message({
          duration: 1000, // 弹窗时间
          showClose: true, // 是否又关闭按钮，true为有
          center: true, // 文字是否居中，true为居中
          type: 'warning', // 弹窗类型
          message: '请登录', // 文字
        })
      }
    },
    load() {
      request.get('article/findAll',{
        params: {
          current: this.current, pageSize: this.pageSize,
          name: this.name,userId: this.userId
        }
      }).then(
          res => {
            this.article = res.data.records
            this.total = res.data.total
          }
      )
    },
    //搜索
    search() {
      if (this.user.id){
        this.load()
      }else {
        this.$message.info('登录后可搜索')
      }
    },
  },
  created() {
    this.load()
    if (this.user.id){
      this.userNickname();
    }
  }
}
</script>

<style scoped>
</style>