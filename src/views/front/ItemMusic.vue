<template>
  <div style="margin: 10px 0">
    <h1> 所有音乐 </h1>
    <!--music：当前播放的音乐。 list：播放列表 ：showlrc：是否显示歌词-->
    <aplayer :music="audio[0]" :list="audio"  :showlrc="true"></aplayer>

<!--    <el-row :gutter="5">-->
<!--      <el-col :span="8" v-for="(item,index) in files" :key="item.id" style="height: 100px;border-bottom: 1px solid #ccc">-->
<!--        <div>-->
<!--          <audio :src="item.url" style="width: 400px;" controls></audio>-->
<!--          <span style="color: #666">{{item.name.substring(0,item.name.indexOf('.'))}}</span>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>
import request from "@/utils/request";
import aplayer from "vue-aplayer";

export default {
  name: "ItemMusic",
  components: { aplayer },
  data(){
    return{
      // 音频列表
      audio:  [{title:'', artist: '', url: '',}],
    }
  },
  methods: {
    load() {
      request.get('files/items/music').then(
          res => {
            this.audio = res.data.filter(v => v.type === 'mp3')
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

</style>