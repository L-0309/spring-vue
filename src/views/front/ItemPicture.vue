<template>
  <div style="margin: 10px 0">
    <h1> 所有图片 </h1>
    <h3 style="color: red">因为此处图片是后添加的，此处的字段和库中的字段发生了冲突，此处仅显示两张</h3>
    <vue-picture-swipe :items="items"></vue-picture-swipe>

<!--    <el-row :gutter="5">-->
<!--      <el-col :span="4" v-for="(item,index) in files" :key="item.id"-->
<!--              style="height: 300px;border-bottom: 1px solid #ccc">-->
<!--        <el-card>-->
<!--          <div style="height: 200px">-->
<!--            <img :src="item.url" alt="logo" style="width: 100%;"/>-->
<!--            <span style="color: #666">{{ item.name.substring(0, item.name.indexOf('.')) }}</span>-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>
import request from "@/utils/request";
import {serverIp} from "../../../public/config";

export default {
  name: "ItemPicture",
  data() {
    return {
      files: [],
      items: [
        {
          //点击打开时候的图片
          src: '',
          //页面显示的土图片
          thumbnail: '',
          //打开图片时的宽和高
          w: '',
          h: '',
          //打开后的标题
          title: ''
        },
        // {
        //   src: 'http://' + serverIp + ':8111/images/OIP-C.jpg',
        //   thumbnail: 'http://' + serverIp + ':8111/images/OIP-C.jpg',
        //   w: 600,
        //   h: 400,
        //   title: 'ikun'
        // }
      ]
    }
  },
  methods: {
    load() {
      request.get('files/items/picture').then(
          res => {
            this.items = res.data.filter(v => v.type === 'jpg' || v.type === 'png')
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