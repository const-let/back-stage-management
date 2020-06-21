<template>
       <el-container class="home-container">
           <!-- 头部区域 -->
   <el-header>
       <div>
           <span>电商后台管理系统</span>
       </div>
       <el-button type="danger" @click="quit">退出登录</el-button>
       </el-header>
  <!-- 页面主体 -->
   <el-container>
      <!-- 侧边栏 -->
    <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggle">|||</div>
        <!-- 侧边栏菜单区域 -->
          <el-menu background-color="#3A3D4C" text-color="#fff" active-text-color="#00A6A6" unique-opened 
          :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="icons[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
             <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in item.children" :key="subItem.id"
              @click="state('/'+subItem.path)">
                   <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
             </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 右侧内容主体 -->
    <el-main>
        <router-view></router-view>
    </el-main>
   </el-container>
    </el-container>
   </template>
<script>
export default {
    data(){
        return {
            menulist:[],
            icons:{
                '125':'el-icon-s-custom',
                 '103':'el-icon-s-help',
                  '101':'el-icon-s-cooperation',
                   '102':'el-icon-s-claim',
                    '145':'el-icon-s-data'
            },
            isCollapse:false,
            // 被激活的链接地址
            activePath:''
        }
    },
    created() {
        this.getMenuList()
        this.activePath=window.sessionStorage.getItem('state')
    },
    methods: {
        quit(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
         async getMenuList(){
         const {data:res}= await this.$http.get('menus');
         if(res.meta.status!==200) return this.$message.error(res.meta.msg)
         this.menulist=res.data
         console.log(res);
          },
          toggle(){
       this.isCollapse=!this.isCollapse
          },
        //   保存链接的激活状态
        state(activePath){
            window.sessionStorage.setItem('state',activePath)
            this.activePath=activePath
        }
    },
  
}
</script>
<style lang="less" scoped>
.home-container {
    height: 100%;
}
  .el-header {
    background-color: #00A6A6;
    display: flex;
    justify-content:space-between;
    align-items: center;
    font-size: 26px;
    color: #fff;
    >div span{
        margin-left: 50px;
    }
  }
  .el-aside {
      background-color: #3A3D4C;
      .el-menu {
          border-right: none;
      }
  }
  .el-main{
      background-color: #Eaedf1;
  }
  .toggle-button {
      background-color: #4a5064;
      font-size: 12px;
      text-align: center;
      line-height: 30px;
      color: #fff;
      letter-spacing: 0.2em;
      cursor: pointer;
  }
</style>
