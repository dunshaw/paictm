<template>
    <div>
      <el-header style="height:40px;">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item :to="{ path: '/Project' }" >工作台</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/Functions' }" >兼容性测试</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.project_name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
<!--       <p>{{ $route.params.project_id }}</p>
      <p>{{ $route.params.project_name }}</p> -->


      <el-main>
        <MyTable :projectid="project_id" :projectname="project_name"></MyTable>
      </el-main>
        

      

        
    </div>

</template>




<script>
import {mapState} from 'vuex'
import TestTable from '../../components/TestcaseTable'



export default {
    name: 'functionTestcase',
      data(){
        return {
          project_name:'',
          project_id:'',
        }
      },
      created(){
        this.getRouterData()
      },
      components:{
        MyTable:TestTable,
      },
      methods: {
        getRouterData(){
          this.project_name = this.$route.query.project_name
          this.project_id = this.$route.query.project_id
        },
        modelflag(state,flag){
            this.$store.commit(state,flag)
        },
        
      },

    };
</script>
<style scoped>
  .el-main{
    /*border: 1px solid red;*/
    border-radius: 4px;
    width:96%;
    margin:0 auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    min-height: 200px;
  }
</style>