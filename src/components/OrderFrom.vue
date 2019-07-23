<template>
    <div class="box">
        <h3 class="titleh3">步骤顺序</h3>
        <ul class="list" id="list" ref="list">
            <li v-for="(item,index) in items" :name="item.Sort">
                <p>
                    <b>{{item.content}}</b><i class="el-icon-mouse"></i>
                </p>
                <div class="btns btn_move">
                    <button class="btn_no" @touchend="btnDown(index)">
                        <i class="sprites_all sprites_draw"></i>
                    </button>
                </div>
            </li>
        </ul>
        <div class="footer">
            <el-button type="success" size="small" @click="Handlecreate" v-if='ordertype=="1"'>确定</el-button>
            <el-button type="success" size="small" @click="HandlecreateSuite" v-if='ordertype=="2"'>确定</el-button>
            <el-button size="small" @click="modelflag()">取消</el-button>
      </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import Sortable from 'sortablejs'
export default {
    data() {
        return {
            uwasc:true,
            idx:'1',
            items: [],
        }
    },
    props: ['datalist','ordertype'],
    mounted () {
        this.datalist.map((item,i)=>{item.Sort=i})
        this.items = this.datalist
        console.log(this.items,this.ordertype)
        var $ul = this.$el.querySelector('#list')
        new Sortable($ul, {
            handle: '.btn_move', 
            animation: 150
        });
    },
    methods:{
        modelflag(){
            this.$store.commit('isOrderFlag',false)
        },
        Handlecreate(){
            let _this = this;
            let list = this.$refs.list;
            let liArr = list.getElementsByTagName('li');
            let sortList = [];
            let allItem = this.items;
            this.items=[];
            for(let i=0;i<liArr.length;i++){
                allItem.forEach((item)=>{
                    if(item.Sort==liArr[i].getAttribute('name')){
                        sortList.push(item);
                    }
                })
                if(i==liArr.length-1){
                    setTimeout(()=>{
                        this.items = sortList;
                    })
                }
            }
            let newdata = JSON.stringify(sortList);
            console.log(newdata)
              _this.$axios({
                  method:'post',
                  url:'/api/test_step/change_step_order',
                  data:_this.$qs.stringify({'data':newdata}),
              }).then(function (res){
                  console.log(res);
                  if(res.data.status==200){
                    _this.$store.commit('isOrderFlag',false)
                    _this.$emit('transferData',res.data.msg)
                  }else{
                    return _this.$message.error(res.data.msg)
                  }
              }).catch(function (error) {
                  console.log(error)
              })

        },
        HandlecreateSuite(){
            let _this = this;
            let list = this.$refs.list;
            let liArr = list.getElementsByTagName('li');
            let sortList = [];
            let allItem = this.items;
            this.items=[];
            for(let i=0;i<liArr.length;i++){
                allItem.forEach((item)=>{
                    if(item.Sort==liArr[i].getAttribute('name')){
                        sortList.push(item);
                    }
                })
                if(i==liArr.length-1){
                    setTimeout(()=>{
                        this.items = sortList;
                    })
                }
            }
            let newdata = JSON.stringify(sortList);
            console.log(newdata)
              _this.$axios({
                  method:'post',
                  url:'/api/test_suit/change_case_order',
                  data:_this.$qs.stringify({'data':newdata}),
              }).then(function (res){
                  console.log(res);
                  if(res.data.status==200){
                    _this.$store.commit('isOrderFlag',false)
                    _this.$emit('transferData',res.data.msg)
                  }else{
                    return _this.$message.error(res.data.msg)
                  }
              }).catch(function (error) {
                  console.log(error)
              })
        },
        btnUp(index){
            var item = this.items[index];
            this.items.splice(index,1);
            this.items.unshift(item);
        },
        btnDown(index){
            let _this = this;
            let list = this.$refs.list;
            let liArr = list.getElementsByTagName('li');
            let sortList = [];
            let allItem = this.items;
            this.items=[];
            for(let i=0;i<liArr.length;i++){
                allItem.forEach((item)=>{
                    if(item.Sort==liArr[i].getAttribute('name')){
                        sortList.push(item);
                    }
                })
                if(i==liArr.length-1){
                    setTimeout(()=>{
                        this.items = sortList;
                    })
                }
            }
        },
    }
};
</script>
<style scoped lang="scss">
.box{
    width: 40%;
    max-height: 85%;
    overflow-y: auto;
    background-color: #fff;
    margin:  0 auto;
    margin-top: 3%;
    margin-bottom: 5%;
    padding: 1em;
    border-radius: 10px;
    .titleh3{
        text-align:center;
      }
    li{
        list-style-type: none;
        background-color:rgba(103,194,58,.3);
        height: 30px;
        margin: 5px;
        padding:5px;
        position:relative;
        p{
            position: absolute;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            width: 95%;
            i{
                position: absolute;
                right: 0;
                font-size:18px;
                height: 30px;
                line-height: 30px;
            }
        }
        .btn_move{
            height: 30px;
            opacity: 0;
        }
    }
    .footer{
        padding: 0;
        margin-left: 0;
        height: 30px;
        text-align: right;
        padding-right: 5%;
    }
}
</style>
