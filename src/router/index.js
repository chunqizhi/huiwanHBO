import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/home/home.vue') //首页
const PoolIndex = () => import('../views/pool/pool.vue')   //矿池首页
const PoolDetail =() =>import('../views/pool/pool_detail.vue')   //矿池详情
const Info = () => import('../views/info/info.vue')  //信息

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Html',
		redirect:'/pool_index'
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
	},
	{
		path: '/pool_index',
		name: 'PoolIndex',
		component:PoolIndex,
	},
	{
		path: '/pool_detail',
		name: 'PoPoolDetailol',
		component:PoolDetail
	},
	{
		path: '/info',
		name: 'Info',
		component: Info,
	},
]

const router = new VueRouter({
	routes,
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router