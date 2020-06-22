import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from "../components/user/users.vue"
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import cate from '../components/goods/cate.vue'
import params from '../components/goods/params.vue'
Vue.use(VueRouter)

const routes = []

const router = new VueRouter({
        routes: [
            // 路由重定项
            { path: '/', redirect: '/login' },
            { path: '/login', component: Login },
            {
                path: '/home',
                component: Home,
                redirect: '/Welcome',
                children: [{
                        path: '/Welcome',
                        component: Welcome
                    }, {
                        path: '/users',
                        component: Users
                    }, { path: '/rights', component: rights },
                    { path: '/roles', component: roles },
                    { path: '/categories', component: cate },
                    { path: '/params', component: params }
                ]
            }
        ]
    })
    //挂载路由导航守卫
    // router.beforeEach(to,form,next)   to 将访问哪个路径  form代表从哪个路径跳转而来  next()放行 next('/) 表示强制跳转的路径
router.beforeEach((to, form, next) => {
    // 假如是访问登录页直接放行
    if (to.path == '/login') return next();
    // 获取token 
    const tokenStr = window.sessionStorage.getItem('token');
    // token不存在就强制跳转到登录页面
    if (!tokenStr) return next('/login');
    next();

})
export default router