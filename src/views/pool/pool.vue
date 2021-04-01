<template>
  <div class="home-div">
    <!-- TT-USDT_LP 矿池 -->
    <FirstPool
      :rate="TT_USDT_Rate"
      :HBOtotal="HBO_total"
      key="FirstPool"
      :FifthTptal="FifthTptal"
    />
    <!--  -->
    <ThirdPool :rate="TT_USDT_Rate" key="ThirdPool" />
    <!-- TT 矿池 -->
    <SecondPool :rate="TT_USDT_Rate" key="SecondPool" />
    <!--    -->
    <FourthPool
      :rate="HBO_USDT_Rate"
      :tt_rate="TT_USDT_Rate"
      key="FourthPool"
    />
    <!--  -->
    <FifthPool :rate="HBO_USDT_Rate" :tt_rate="TT_USDT_Rate" key="FifthPool" />
  </div>
</template>

<script>
import FirstPool from "./components/first_pool.vue";
import SecondPool from "./components/second_pool.vue";
import ThirdPool from "./components/third_pool.vue";
import FourthPool from "./components/fourth_pool.vue";
import FifthPool from "./components/fifth_pool.vue";
import cfg from "@/apis/cfg.js";
import hbo from "@/apis/hbo.js";
import five from "@/apis/five.js";

import {
  huiwanUsdtMdexAddr,
  contractType,
  HBOUSDTMdexAddr,
} from "@/apis/token.js";

import HBOUSDTBalance from "@/apis/contract/USDTContract.js";
export default {
  name: "Pool",
  components: {
    FirstPool,
    SecondPool,
    ThirdPool,
    FourthPool,
    FifthPool,
  },
  data() {
    return {
      TT_USDT_Rate: 0,
      timer: null,
      HBO_USDT_Rate: 0,
      HBO_total: 0,
      FifthTptal: 0,
    };
  },
  methods: {
    get_rate() {
      cfg.initFnPromise().then((data) => {
        this.pre_coin().then(async (pre) => {
          let next = await this.next_coin();
          // console.log(pre,next)
          if (pre * next != 0) {
            switch (contractType) {
              case "okex":
                this.TT_USDT_Rate = this.$usdtBig(next) / pre;
                break;
              case "ttex":
                this.TT_USDT_Rate = next / pre;
                break;
              default:
            }
          } else this.TT_USDT_Rate = 0;
        });
      });
    },
    timer_fn() {
      this.timer && clearTimeout(this.timer);
      this.get_rate();
      this.get_HBO_rate();
      this.get_fifth_total()
      this.timer = setTimeout(() => {
        this.timer_fn();
      }, 4000);
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
    //
    get_fifth_total() {
      five.init(() => {
        five.getBalanceFromHuiwanTokenContract(
          HBOUSDTMdexAddr,
          (res) => {
            console.log("BSA 66661116" + res);
            this.FifthTptal = (
              this.$wei(res) *
              1 *
              this.HBO_USDT_Rate *
              2
            ).toFixed(0);
          },
          (err) => {}
        );
      });
    },
    get_HBO_rate() {
      HBOUSDTBalance.getHBOUSDTBalance().then((res) => {
        hbo.init(() => {
          hbo.getBalanceFromHuiwanTokenContract(
            HBOUSDTMdexAddr,
            (result) => {
              this.HBO_USDT_Rate = res / result;
              hbo.getTotalSupply((total) => {
                this.HBO_total = (
                  this.$wei(total) * this.HBO_USDT_Rate
                ).toFixed(0);
              });
            },
            () => {}
          );
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