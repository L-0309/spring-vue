<template>
<div>
  <el-row>
    <el-col :span="12">
      <div id="main" style="width: 500px;height: 400px"></div>
    </el-col>
    <el-col :span="12">
      <div id="pie" style="width: 500px;height: 400px"></div>
    </el-col>
  </el-row>
</div>
</template>
<script>
import * as echarts from 'echarts';
import request from "@/utils/request";

export default {
  name: "Home",
  data() {
    return {
    }
  },
  mounted() {
    //页面元素渲染之后
    let chartDom = document.getElementById('main');
    let myChart = echarts.init(chartDom);
    let option = {
      title: {
        text: '个季度会员统计',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: ["第一季度",'第二季度','第三季度','第四季度']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [],
          type: 'line'
        },
        {
          data: [],
          type: 'bar',
        }
      ]
    };


    //饼图
    let pieDom = document.getElementById('pie');
    let pieChart = echarts.init(pieDom);
    let pieOption = {
      title: {
        text: '个季度会员比例图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '80%',
          label: { //饼图上的标签图形
            normal: {
              show: true,
              position: 'inner', //标签的位置
              textStyle: {
                fontWeight: 300,
                fontSize: 16, //文字的大小
                color: '#282c34'
              },
              formatter: '{d}%'
            }
          },
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    request.get('echarts/members').then(
        res => {
          //填空
          //折线图
          option.series[0].data = res.data
          option.series[1].data = res.data
          myChart.setOption(option)
          //饼图
          pieOption.series[0].data = [
            {name: '第一季度', value: res.data[0]},
            {name: '第二季度', value: res.data[1]},
            {name: '第三季度', value: res.data[2]},
            {name: '第四季度', value: res.data[3]},
          ]
          pieChart.setOption(pieOption)
        }
    )
  }
}
</script>

<style scoped>

</style>