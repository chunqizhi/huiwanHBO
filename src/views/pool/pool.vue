<template>
  <div class="home-div">
    <!-- TT-USDT_LP 矿池 -->
    <FirstPool/>
    <!-- TT 矿池 -->
    <SecondPool/>
  </div>
</template>

<script>
import FirstPool from './components/first_pool.vue'
import SecondPool from  './components/second_pool.vue'
export default {
  name: "Pool",
  components:{
    FirstPool,
    SecondPool
  },
};
</script>