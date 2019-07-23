<template>
  <div class="box">
    <h3 style="text-align:center;margin-bottom:10px;">选择设备</h3>
    <!-- {{projectid}} -->
    <el-tabs tab-position="left" border>
        <el-tab-pane v-for="log in devices" :label="log.brand" :key="log.id" >
            <el-checkbox-group v-model="checkList" size="mini">
                <el-checkbox-button v-for="item in log.device" :label="item.id" :key="item.id" :disabled="item.state">{{item.name}}</el-checkbox-button>
            </el-checkbox-group>
        </el-tab-pane>
    </el-tabs>
    <div class="footer">
        <el-button type="primary" size="small" @click="choose">确定</el-button>
        <el-button size="small" @click="modelflag(false)">取消</el-button>
    </div>
  </div>
</template>



<script>
import {mapState} from 'vuex'

  export default {
    data() {
      return {
        devices:[],
        checkList: [],
      }
    },
    props: ['projectid'],
    computed:{
        ...mapState({
          isDevicesData:state => state.isDevicesData,
        }),
    },
    mounted(){
            this.getdevices()
            this.checkList=this.$store.state.isDevicesData
        },
    methods: {
        //修改模态flag
        modelflag(flag){   
            this.$store.commit('isDevicesFlag',flag)
        },
        //获取设备
        getdevices(){
            let _this=this;
            _this.$axios({
              method:'post',
              url:'/api/devices/select',
              data:_this.$qs.stringify({'project_id':_this.projectid}),
            }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                _this.devices=res.data.data
              }
            }).catch(function (error) {
              console.log(error)
            })
        },
        choose(){
            console.log(this.checkList)
            this.$store.commit('isDevicesData',this.checkList)
            this.$store.commit('isDevicesFlag',false)
            return this.$message.success('设备已选择！')
        },
    },

  };
</script>

<style scoped>
  .box{
    width: 40%;
    background-color: #fff;
    margin:  0 auto;
    margin-top: 3%;
    margin-bottom: 5%;
    padding: 2em;
    border-radius: 10px;
  }
  .footer{
    padding: 0;
    margin-left: 0;
    height: 30px;
    text-align: right;
    padding-right: 5%;
  }
  .titleh3{
    text-align:center;
    margin-bottom:10px;
    color: #666;
  }
</style>