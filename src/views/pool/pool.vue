<template>
  <div class="home-div">
    <!-- TT-USDT_LP 矿池 -->
    <FirstPool  :rate ='TT_USDT_Rate'/>
    <!-- TT 矿池 -->
    <SecondPool :rate ='TT_USDT_Rate'/>
  </div>
</template>

<script>
import FirstPool from "./components/first_pool.vue";
import SecondPool from "./components/second_pool.vue";

import cfg from "@/apis/cfg.js";
import { huiwanUsdtMdexAddr } from "@/apis/token.js";
export default {
  name: "Pool",
  components: {
    FirstPool,
    SecondPool,
  },
  data() {
    return {
      TT_USDT_Rate: 0,
      timer: null,
    };
  },
  methods: {
    get_rate() {
      cfg.initFnPromise().then((data) => {
        this.pre_coin().then(async (pre) => {
          let next = await this.next_coin();
          if (pre * next != 0) {
            this.TT_USDT_Rate = next / pre;
                        // this.TT_USDT_Rate=Math.random()*1
          } else this.TT_USDT_Rate = 0;
        });
      });
    },
    timer_fn() {
      this.timer && clearTimeout(this.timer);
      this.get_rate();
      this.timer = setTimeout(() => {
        this.timer_fn();
      }, 5000);
    },
    pre_coin() {
      return new Promise((resolve, reject) => {
        cfg.getBalanceFromHuiwanTokenContract(huiwanUsdtMdexAddr, (res) => {
          resolve(res);
        });
      });
    },
    next_coin() {
      return new Promise((resolve, reject) => {
        cfg.getBalanceFromUsdtTokenContract(huiwanUsdtMdexAddr, (res) => {
          resolve(res);
        });
      });
    },
  },
  mounted() {
    this.timer_fn();
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
  },
};
</script>