<template>
  <div>
    <el-header style="height:30px;padding-left:5%;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item :to="{ path: '/Systems' }" replace>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item >移动设备管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main>
      <el-header style="height: 40px;" >
        <label class="mylabel">
<!--             搜索关键字: -->
            <input type="text" v-model="seachname" placeholder="请输入要查找的设备名">
            <!-- <el-button type="primary" icon="el-icon-search" size="mini"></el-button> -->
            <el-button size="mini" @click="showModel">添加设备</el-button>
        </label>
      </el-header>

      <el-tabs type="border-card" @tab-click="handleClick">
        <el-tab-pane v-for="item in titles" :label="item" :key="item.id">
          <!-- {{item}} -->
          <el-row class="block-col-2">
            <el-col :span="24">
             <el-table :data="tables | conditions('ios',tabindex)" style="width: 50%;" align="center" height="520">
                <el-table-column label="Ios" align="center" >
                  <template slot-scope="scope">
                    <el-tag size="medium" type="info" align="center" @click="handleEdit(scope.row.id,scope.row.name)">{{ scope.row.name }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <el-table :data="tables | conditions('android',tabindex) " style="width: 50%;" align="center" height="520">
                <el-table-column label="Android" align="center">
                  <template slot-scope="scope">
                    <el-tag size="medium" align="center" @click="handleEdit(scope.row.id,scope.row.name)">{{ scope.row.name }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs> 

    <transition enter-active-class="fadeInDown" leave-active-class="fadeOutDown" :duration='{enter:800, leave: 800}'> 
      <myform class="animated" v-if="isModelFlag" @transferData='AddData' @transferDalete="DeleteData" :editFlag='editFlag'></myform>
    </transition>

    </el-main>
  </div>
</template>




<script>
import {mapState} from 'vuex'
import myforms from '../../components/Froms'


export default {
    name: 'Equipment',
      data(){
        return {
          editFlag:true,
          seachname:'',
          titles:['功能/适配测试','性能测试','稳定性测试'],
          tabindex:'',
          showData:[],
        }
      },
      components:{
        myform:myforms,
      },
      computed:{
        ...mapState({
          isModelFlag:state => state.isModelFlag,
        }),
        tables() {
          let search = this.seachname
          if (search) {
            return this.showData.filter(item=>{
                if(item.name.toLowerCase().includes(search.toLowerCase())){
                    return item
                }
            });
          }
          return this.showData 
        },
      },
      mounted(){
        this.tabindex=0
        this.$store.commit('isModelFlag',false)
        this.$store.commit('isModelData',false)
        this.getdevicelist()
      },
      methods:{
        getdevicelist(){
          let _this=this;
          _this.$axios({
              method:'post',
              url:'/api/device/select_all',
          }).then(function (res){
              console.log(res);
              if(res.data.status===200){
                  _this.showData = res.data.data
              }
          }).catch(function (error) {
              console.log(error)
          })
        },
        //tab修改
        handleClick(tab, event) {
          this.tabindex=tab.index
        },
        
        //开启模态框
        showModel(){
          this.$store.commit('isModelFlag',true)
        },
        handleEdit(id,name){
          let data = {'id':id,'name':name}
          console.log(data)
          let _this=this;
          _this.$axios({
            method:'post',
            url:'/api/device/select',
            data:_this.$qs.stringify(data)
          }).then(function (res){
            if(res.data.status===200){
              console.log(res)
              _this.$store.commit('isModelData',res.data.data)
              _this.showModel()
            }
          }).catch(function (error) {
            console.log(error)
          })

        },
        AddData(data){
          if(data){
            this.getdevicelist()
          }
        },
        DeleteData(data){
          let _this=this;
          // console.log('DeleteData',data);
          var index = this.showData.findIndex(item =>{
              if(item.id==data.id){
                  return true;
              }
            })
          this.showData.splice(index,1);
        },
      },

      //手机类型判断&&type判断,
      filters:{
        conditions:function(arr,con,index){
          let data=[]
          arr.forEach(item=>{
            if(item.os.toLowerCase() == con && String(item.test_type)[index] ==='1'){
                data.push(item);
            }
          })
          return data
        }
      },
    };
</script>
<style scoped>
  .el-tabs{
    margin: 2em;
    margin-top: 0px;
  }

  .mylabel{
    display: inline-block;
    max-width: 100%;
    margin-left: 1em;
    font-weight: bold;
    color: #999;
  }
  .mylabel input{
    /*height: 34px;*/
    padding: 6px;
    font-size: 12px;
    line-height: 1.22857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .mylabel input::-webkit-input-placeholder{
    color: #999;
  }

  .el-table{
    float: left;
    cursor: pointer;
  }


  myform{
    width: 50%;
  }
</style>