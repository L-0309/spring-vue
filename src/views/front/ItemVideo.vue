<template>
  <div style="margin: 10px 0">
    <h1> 视频 </h1>
    <el-card>
      <div v-for="item in files" :key="item.id" style="margin: 10px 0; padding: 10px; color: #666; border-bottom: 1px dashed #ccc">
        <span style="font-size: 18px; cursor: pointer" class="item" @click="detail(item.id)">{{item.name}}</span>
        <span style="float: right;font-size: 12px;margin-top: 10px">文件大小：{{item.size}}</span>
      </div>
    </el-card>
<!--    <el-row :gutter="5">-->
<!--      <el-col :span="6" v-for="(item,index) in files" :key="item.id"-->
<!--              style="height: 300px;border-bottom: 1px solid #ccc">-->
<!--        <div>-->
<!--          <video :src="item.url" style="width: 100%;" controls/>-->
<!--          <span style="color: #666">{{ item.name.substring(0, item.name.indexOf('.')) }}</span>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>
import request from "@/utils/request";
import videoPlayer from 'vue-video-player'

export default {
  name: "ItemVideo",
  components:{videoPlayer},
  data() {
    return {
      files: [],
    }
  },
  methods: {
    detail(id) {
      this.$router.push({path: '/front/videoDetail', query:{id: id}})
    },
    load() {
      request.get('files/items').then(
          res => {
            this.files = res.data.filter(v => v.type === 'mp4')
          }
      )
    }
  },
  created() {
    this.load()
  }
}
</script>

<style scoped>
.item:hover{
  color: #2a98ff;
}
</style>