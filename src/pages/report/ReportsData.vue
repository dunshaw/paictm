<template>
    <div>
      <el-header>
        <h1>{{taskname.split('_')[0]}} - {{taskname.split('_')[1]}}</h1>
        <el-tag size='mini' type='info'>{{taskname.split('_')[2]}}</el-tag>
        <el-tag size='mini' type='info'>{{devicename}}</el-tag>
      </el-header>
      <el-main>
        <section class="el-compatible" v-show='showflag' >
          <el-tag>适配性屏幕截图</el-tag>
          <el-row :gutter="50">
            <el-col :span="12" v-for='(item,index) in tabledata' :key='item.id' >
              <div class="mycontent">
                <img :src="item.image_url" @click='dialogs(item.result_id)'>
                <div class="right-box">
                  <div>
                    <el-link :underline="false" icon="el-icon-view">结 果:</el-link>
                    <el-tag size='medium' v-if='item.result=="false"' type="danger" closable @close="handleClose(index,item.result)">失败</el-tag>
                    <el-tag size='medium' v-else='item.result=="false"' closable @close="handleClose(index,item.result)">成功</el-tag>
                  </div>
                  <div>
                    <el-link :underline="false" icon="el-icon-view">相 似:</el-link>
                    <el-rate v-model="item.rate" :colors="colors" disabled show-score text-color="#ff9900">
                    </el-rate>
                  </div>
                  <el-link :underline="false" icon="el-icon-discover">网 络:</el-link>
                  <el-input v-model="item.net" size='small' style='margin-bottom:2px;'>
                  </el-input>
                  <el-link :underline="false" icon="el-icon-paperclip">备 注:</el-link>
                  <el-input type="textarea" :rows="4" v-model="item.annotation" resize='none' :disabled="true">
                  </el-input>
                  <el-link :underline="false" icon="el-icon-edit">描 述:</el-link>
                  <el-input type="textarea" :rows="4" v-model="item.desc" resize='none'>
                  </el-input>
                </div>
                <div style="clear:both"></div>
              </div>
            </el-col>
            <el-button type="success" round size="small" @click='save_adapt_report'>保存更改</el-button>
          </el-row>
        </section>
        <!-- 图片详细模态框 -->
        <el-dialog :visible.sync="dialogVisible">
          <el-row :gutter="20">
            <el-col :span="12" v-for="item in dialogSrc" :key="item.id">
              <el-image :src="item" lazy fit="fill" style='height:580px;box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);margin-bottom:20px;'></el-image>
            </el-col>
          </el-row>
        </el-dialog>
        <section class="el-perfor" v-show='!showflag'>
          <el-tag size='medium' type='info'>性能测试报告</el-tag>
          <div id="cpubox" class="el-echarts"></div>
          <div class="el-result">
            <b>CPU测试结论：</b>
            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="conclusions.cpu" resize='none'></el-input></div>
          <div id="fpsbox" class="el-echarts"></div>
          <div class="el-result">
            <b>FPS测试结论：</b>
            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="conclusions.fps" resize='none'></el-input></div>
          <div id="batterybox" class="el-echarts"></div>
          <div class="el-result">
            <b>电量测试结论：</b>
            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="conclusions.battery" resize='none'></el-input></div>
          <div id="netbox" class="el-echarts"></div>
          <div class="el-result">
            <b>流量测试结论：</b>
            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="conclusions.net" resize='none'></el-input></div>
            <el-button type="primary" round size="small" @click='conclusion'>保存结论</el-button>
            <hr>
          <div class="el-notes">
            <h3>性能分析参考：</h3>
            <span>1. CPU 占用率：</span><p>当前应用占整个手机的CPU的百分比。</p>
            <p>一般情况下认为CPU占用率处于20%-40%之间为合理，超过80%需要高度关注。</p>
            <span>2. 内存占用：</span>
            <p>VSS-Virtual Set Size：虚拟耗用内存（包含共享库占用的内存）。</p>
            <p>RSS-Resident Set Size：实际使用物理内存（包含共享库占用的内存，不精确，不推荐作为参考值）。</p>
            <p>PSS-Proportional Set Size：实际使用的物理内存（USS + 共享内存）。</p>
            <p>USS-Unique Set Size：进程独自占用的物理内存（不包含共享库占用的内存）。</p>
            <p>native heap：本地堆空间。</p>
            <p>dalvik heap：android java 虚拟机堆空间。</p>
            <span>3. 电量耗用：</span><p>测试设备测试时耗电量。<b>警告:当连接usb时耗电量测试结果不准确。</b></p>
            <span>4. 流量耗用：</span>
            <p>rec：当前应用接收的字节数，包含蜂窝网络和WiFi等；</p>
            <p>send：当前应用发送的字节数，包含蜂窝网络和WiFi等。</p>
            <span>5. FPS帧率：</span>
            <p>系统合成帧率：针对有大量动画的场景情况下，当动画很少，不需要频繁刷屏时，值为0。<br> 
            12fps：由于人类眼睛的特殊生理结构，如果所看画面之帧率高于每秒约10-12帧的时候，就会认为是连贯的。<br> 
            24fps：有声电影的拍摄及播放帧率均为每秒24帧，对一般人而言已算可接受。<br> 
            30fps：早期的高动态电子游戏，帧率少于每秒30帧的话就会显得不连贯，这是因为没有动态模糊使流畅度降低。<br> 
            60fps：在实际体验中，60帧相对于30帧有着更好的体验。<br> 
            85fps：一般而言，大脑处理视频的极限。<br> 
            有大量动画的应用大于30；<br> 
            非大量动画的应用无硬性要求。</p>
          </div>
        </section>
      </el-main>
    </div>
</template>

<script>
import {mapState} from 'vuex'
const echarts = require('echarts');

  export default {
    data() {
      return {
        dialogVisible:false,
        dialogSrc:[],
        showflag:'',
        textarea:'',
        taskname:'',
        taskid:'',
        deviceid:'',
        devicename:'',
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
        titles:{'cpu':'CPU（单位：百分比）：','battery':'电量（单位：百分比）：','fps':'帧率（单位：帧/每秒）：','net':'流量（单位：KB）'},
        conclusions:{cpu:'',fps:'',battery:'',net:''},
        fit: 'fill',
        tabledata:[],

      }
    },
    mounted(){
      this.getRouterData()
    },
    methods: {
      getRouterData(){
        this.taskname = this.$route.query.taskname
        this.taskid = this.$route.query.taskid
        this.deviceid = this.$route.query.deviceid
        this.devicename = this.$route.query.devicename
        if(this.$route.query.reportmodel == 1){
          this.showflag = true
        }else {
          this.showflag = false
        }
        this.getData()
      },
      backform(){
        this.$router.go(-1)
      },
      getData(){
        if(this.$route.query.reportmodel == 1){
          this.compatibilityData()
        }else {
          this.performanceData()
        }
        
      },
      handleClose(index,old){
        console.log(index)
        if(old == 'false'){
          return this.tabledata[index].result = 'true'
        }else{
          return this.tabledata[index].result = 'false'
        }
        
      },
      // 兼容性
      compatibilityData(){
        let _this=this;
        _this.$axios({
          method:'post',
          url:'/api/task/get_adapt_report',
          data:_this.$qs.stringify({'task_id':_this.taskid,'device_id':_this.deviceid}),
        }).then(function (res){
          console.log('data',res.data);
          if(res.data.status==200){
            for (let i of res.data.data) {
              if(i.rate){
                i.rate = Math.floor(i.rate/2*100)/10
              }else{
                i.rate = 0;
              }
            }
            _this.tabledata = res.data.data
          }else{
            return _this.$message.error(res.data.msg)
          }
        }).catch(function (error){
          console.log(error)
          return _this.$message.error(error)
        })
      },
      // 保存兼容性更改
      save_adapt_report(){
        let _this=this;
        _this.$axios({
          method:'post',
          url:'/api/task/save_adapt_report',
          data:_this.$qs.stringify({'task_id':_this.taskid,'device_id':_this.deviceid,'conclusion':JSON.stringify(_this.tabledata)}),
        }).then(function (res){
          console.log(res.data);
          if(res.data.status==200){
            return _this.$message.success(res.data.msg)
          }
          return _this.$message.error(res.data.msg)
        }).catch(function (error){
          return _this.$message.error(error)
        })
      },
      dialogs(result_id){
        console.log(result_id)
        let _this=this;
        _this.$axios({
          method:'post',
          url:'/api/task/get_compare_pic',
          data:_this.$qs.stringify({'task_id':_this.taskid,'result_id':result_id}),
        }).then(function (res){
          console.log(res.data);
          if(res.data.status==200){
            _this.dialogSrc = res.data.data
          }else{
            return _this.$message.error(res.data.msg)
          }
        }).catch(function (error){
          console.log(error)
          return _this.$message.error(error)
        })
        this.dialogVisible = true
        
      },
      // 性能
      performanceData(){
        let _this=this;
        _this.$axios({
          method:'post',
          url:'/api/task/get_task_report',
          data:_this.$qs.stringify({'task_id':_this.taskid,'device_id':_this.deviceid}),
        }).then(function (res){
          // console.log(res.data);
          if(res.data.status==200){
            // 处理性能测试数据
            for(var key in res.data['performance']){
              _this.clsssData(key,res.data['performance'][key])
            }
            _this.conclusions = res.data.conclusion
          }
        }).catch(function (error){
          console.log(error)
        })
      },
      // 保存结论
      conclusion(){
        console.log(this.conclusions)
        let _this=this;
        _this.$axios({
          method:'post',
          url:'/api/task/save_reprot_conclusion',
          data:_this.$qs.stringify({'task_id':_this.taskid,'device_id':_this.deviceid,'conclusion':_this.conclusions}),
        }).then(function (res){
          // console.log(res.data);
          if(res.data.status==200){
            return _this.$message.success(res.data.msg)
          }
          return _this.$message.error(res.data.msg)
        }).catch(function (error){
          return _this.$message.error(error)
        })
      },
      // 性能数据解析和拆分
      clsssData(mold,data){
        // console.log(mold,data)
        let interval = data['interval']
        let sum = 0
        let xAxisData = ['0s']
        for(let i=0;i<data['list'].length;i++){
          xAxisData.push((sum+=interval)+'s');
        }
        // console.log('xAxis',xAxisData)
        this.mycharts(mold,xAxisData,data['list'])

      },
      // 画图
      mycharts(name,xAxisData,yAxisData){
        // console.log(name,xAxisData,yAxisData)
        let myChart = echarts.init(document.getElementById(name+'box'));
        myChart.setOption({
          title : {text:this.titles[name]},
          tooltip:{},
          xAxis:{
            data:xAxisData,
            axisLine:{
              lineStyle:{color:'#2ec7c9'},
              width:1
            }
          },
          calculable : true,
          yAxis:{
            type:'value',
            axisLine:{
              lineStyle:{color:'#2ec7c9'},
              width:1
            }
          },
          series:[{
            name:this.titles[name],
            type:'line',
            smooth:true,
            itemStyle: {
              normal: {
                color:'#2ec7c9',
                areaStyle: {type: 'default',color:'#8fdcdd'},
                lineStyle: {color: '#2ec7c9'}
              }
            },
            data:yAxisData,
            markPoint : {
              data : [
                {type : 'max', name: '最大值'},
                {type : 'min', name: '最小值'}
              ]
            },
            markLine : {
              data : [
                {type : 'average', name: '平均值'}
              ]
            }
          }]
        });
      },
    },
    filters: {},
  };
</script>

<style scoped lang="scss">
$text-align:center;
$font-weight:bold;
.el-header{
  text-align: $text-align;
  margin-top: 20px;
  margin-bottom: 20px;
  h1{
    margin: 5px;
    color: #333;
  }
  .el-button{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
.el-main{
  width: 90%;
  margin: 0 auto;
  // border: 1px solid #eee;
  .el-compatible{
    text-align: $text-align;
    .el-row{
      padding:2em;
    }
    .mycontent{
      border: 1px solid #ddd;
      padding:5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      text-align: left;
      margin-bottom: 3rem;
      .el-link{
        color: #666;
        font-weight: bold;
      }
      .el-rate{
        display: inline;
      }
      img{
        outline: 1px solid #eee;
        float: left;
        width: 220px;
        height: 380px;
        object-fit: fill;
        &:hover{
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        } 
      }
      .right-box{
        overflow: hidden;
        padding: 5px;
        .el-link{margin:5px;}
      }
    }
    
  }
  .el-perfor{
    padding: 1rem;
    text-align: $text-align;
    .el-echarts{
      width: 100%;
      height: 400px;
      // border: 1px solid #000;
      text-align: center;
      margin: 0 auto;
    }
    .el-result{
      text-align: left;
      width: 85%;
      display: block;
      margin: 0 auto;
      margin-bottom: 10px;
      .el-textarea{
        margin:5px;
      }
    }
  }
  .el-notes{
    text-align: left;
    // border:1px solid #eee;
    padding:1rem;
    font-size: 22px;
    line-height: 28px;
    h3{
      margin-bottom: 10px;
      font-weight: $font-weight;
    }
    span{
      font-weight: $font-weight;
      font-size: 18px;
    }
    p{
      font-size: 1rem;
      padding-left: 1rem;
    }
    b{
      color: red;
    }
  }
  hr{
    border:1px dashed #eee;
  }

}

</style>