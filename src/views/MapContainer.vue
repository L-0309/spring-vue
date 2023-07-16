<template>
  <div id="container"></div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
export default {
  name: "MapContainer",
  data(){
    return{
      //此处不声明 map 对象，可以直接使用 this.map赋值或者采用非响应式的普通对象来存储。
      map:null,
    }
  },
  methods:{
    initMap(){
      AMapLoader.load({
        key:"https://webapi.amap.com/maps?v=1.4.15&key='04a621eea71066887b8590be861e54ea'",             // 申请好的Web端开发者Key，首次调用 load 时必填
        version:"1.4.15",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins:['AMap.Driving','AMap.Map'],  // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap)=>{
        this.map = new AMap.Map("container",{  //设置地图容器id
          viewMode:"3D",    //是否为3D地图模式
          pitch:75, // 地图俯仰角度，有效范围 0 度- 83 度
          terrain: true, // 开启地形图
          zoom:15,           //初始化地图级别
          mapStyle: 'amap://styles/whitesmoke',  //设置地图的显示样式
          center:[112.364145,34.67523], //初始化地图中心点位置
        });
      }).catch(e=>{
        console.log(e);
      })

      //停留1s后执行
      setTimeout(() => {
        //地图坐标点
        const markerAddress = new AMap.Marker({
          position: new AMap.LngLat(112.364145,34.67523),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '国宏科创产业社区'
        })
        const markerHome = new AMap.Marker({
          position: new AMap.LngLat(112.353343,34.666395),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '江南绿苑'
        })
        const markerFriend = new AMap.Marker({
          position: new AMap.LngLat(112.367,34.672092),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '河柴01号小区'
        })
        const zhengZhou = new AMap.Marker({
          position: new AMap.LngLat(113.625152,34.745754),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '郑州市政府'
        })
        const markerList = [markerAddress, markerHome, markerFriend,zhengZhou];

        // 地图上点击事件
        const clickHandler = function(e) {
          alert('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
        };
        this.map.on('click', clickHandler);

        //设置折线
        //折线的节点坐标数组
        let path = [
          new AMap.LngLat(112.364145,34.67523),
          new AMap.LngLat(112.353343,34.666395),
          new AMap.LngLat(112.367,34.672092),
          new AMap.LngLat(113.625152,34.745754),
        ];
        // 创建折线实例
        let polyline = new AMap.Polyline({
          path: path,
          borderWeight: 1, // 线条宽度，默认为 1
          strokeColor: '#666', // 线条颜色
          lineJoin: 'round' // 折线拐点连接处样式
        });
        this.map.add(markerList);
        this.map.add(polyline)
      },1000)
    },
  },
  mounted(){
    //DOM初始化完成进行地图初始化
    this.initMap();
  }
}
</script>

<style scoped>
#container{
  padding:0;
  margin: 0;
  width: 100%;
  height: 650px;
}
</style>