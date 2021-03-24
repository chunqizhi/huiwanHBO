<template>
  <div class="home">
    <h2>{{$t('home.title')}}</h2>
    <ul class="home-ul"> 
        <li class="home-li" v-for="item in nav_list" :key="item.title">
          <h4>{{$t(item.title)}}</h4>
          <p class="desc">{{$t(item.desc)}}</p>
        </li>
    </ul>
  </div>
</template>

<script>
export default {
  data(){
    return{
      nav_list:[
        {
          title:'home.title01',
          desc:'home.desc01',
        },
         {
          title:'home.title02',
          desc:'home.desc02',
        },
         {
          title:'home.title03',
          desc:'home.desc03',
        },
         {
          title:'home.title04',
          desc:'home.desc04',
        },
      ]
    }
  }
}
</script>

<style  scoped lang='less'>
@import "~@mobile/page/home-index.less";
</style>
