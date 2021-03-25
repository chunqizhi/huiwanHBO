<template>
  <div class="home-div">
    <div>
      <div class="home-all">
        <!-- {{ $t("pool.text01") }}0.00 USDT -->
        <div class="all-desc">
          <div class="all-text">
            {{ $t("pool.text01") }}: USDT:{{ calc_total }}
          </div>
        </div>
      </div>
      <div>
        <ul class="coin-ul">
          <li class="coin-li">
            <h2>{{ token_list.coin }}</h2>
            <div class="info-div">
              <p>
                {{ $t("pool.text02") }} {{ token_list.day }}
                {{ token_list.coin_name }}({{ $t("pool.text03") }})
              </p>
              <p>
                {{ $t("pool.text02") }} {{ token_list.mounth }}
                {{ token_list.coin_name }}({{ $t("pool.text04") }})
              </p>
            </div>

            <div class="token-coin">
              <span> {{ token_list.next_coin || "0.0000" }} USDT</span>
            </div>

            <div class="choose-div percent-div">
              <span>APY</span>
              <span>{{ token_list.apy }}</span>
            </div>
            <div
              class="choose-div click-div"
              @click="choose_click(token_list.query)"
            >
              {{ $t("pool.text05") }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import cfg from "@/apis/cfg.js";
import { huiwanUsdtMdexAddr } from "@/apis/token.js";

import spg from "@/apis/spg.js";
import { huiwanSinglePoolAddr } from "@/apis/token.js";

export default {
  name: "Home",
  props:{
    rate:{
       default: 1,
    }
  },
  data() {
    return {
      token_list: {
        coin: "TT-USDT_LP",
        day: "",
        mounth: "",
        query: "TT-USDT_LP",
        pre_coin: "",
        next_coin: "",
        coin_name: "TT",
        apy: "",
      },

      lp_timer: null,
      lp_coin_timer: null, //币对抵押数量定时器

      first_pool_tt: 0,
      second_pool_tt: 0,
      usdt_total: 0,
    };
  },

  computed: {
    calc_total() {
      this.usdt_total = this.usdt_total || 0;
      this.first_pool_tt = this.first_pool_tt || 0;
      let total = this.first_pool_tt + this.second_pool_tt;
      return (total * this.rate + this.usdt_total*1).toFixed(0);
    },
  },
  methods: {
    init() {

      cfg.initFnPromise()
        .then((res) => {
          // 初始化拿到自己的地址
          this.account = res;
          this.cfg_init_callback();
          this.get_second_tt();
        })
        .catch((err) => {});
    },
    // init成功后的callback
    cfg_init_callback() {
      let that = this;
      // 获取奖励池中每日/每月
      cfg.getInitreward(function (res) {
        that.token_list.day = that.$wei(res);
        that.token_list.mounth = that.$wei(res) * 30;
      });
      // 查询项目方 huiwanUsdtLoop 池子里面的 lp 总数量
      cfg.getTotalSupply(function (res) {
        console.log("当前池子 lp 总量：" + res);
        let total = that.$wei(res);
        that.token_list.apy =
          ((that.token_list.day / total) * 360 * 100).toFixed(0) + "%";
      });
      that.cfg_coin_fn();
    },
    // cfg  pre_coin  next_coin   获取cfg抵押数量
    cfg_coin_fn() {
      let that = this;
      cfg.getBalanceFromHuiwanTokenContract(huiwanUsdtMdexAddr, function (res) {
        // console.log("first pool pre_coin  " + res);
        that.token_list.pre_coin = (that.$wei(res) * 1).toFixed(0);
        // 第一个池子的tt
        that.first_pool_tt = that.token_list.pre_coin * 1;
        // 查询 mdex 中配对合约拥有 usdtToken 的数量
        cfg.getBalanceFromUsdtTokenContract(
          huiwanUsdtMdexAddr,
          function (result) {
            // console.log("first pool next_coin  " + result);
            result = result * 1 > 0 ? result : 0;

            that.token_list.next_coin = (that.$wei(result) * 2).toFixed(0);
            //第一个矿池的USDT
            that.usdt_total =  (that.$wei(result) * 1).toFixed(0);
          }
        );
      });
    },
    cfg_coin_timer() {
      this.cfg_coin_fn();
      this.lp_coin_timer && clearTimeout(this.lp_coin_timer);
      this.lp_coin_timer = setTimeout(() => {
        this.cfg_coin_timer();
      }, 2000);
    },
    choose_click(path) {
      this.$router.push({
        path: "/pool_detail",
        query: {
          token: path,
        },
      });
    },
    // 计算年利率
    calc_lp_rate_year() {
      // 查询 huiwanUsdtLoop 池子初始奖励数量 57600000000000000000000
      let that = this;
      cfg.getInitreward(function (res) {
        that.token_list.day = that.$wei(res);
        that.token_list.mounth = that.$wei(res) * 30;
        // 拿到总收益
        cfg.getTotalSupply(function (result) {
          let total = that.$wei(result);

          that.token_list.apy =
            ((that.token_list.day / total) * 360 * 100).toFixed(2) + "%";

          // console.log("first pool apy    ", that.token_list.apy);
        });
      });
    },
    // 定时器 查询 LP年利率
    calc_lp_rate_year_fn() {
      this.calc_lp_rate_year();
      this.lp_timer && clearTimeout(this.lp_timer);
      this.lp_timer = setTimeout(() => {
        this.calc_lp_rate_year_fn();
      }, 4000);
    },
    // 获取第二个pool的TT数量
    get_second_tt() {
      let that = this;
      spg.init(() => {
        spg.getTotalSupply(function (res) {
          that.second_pool_tt = (that.$wei(res) * 1).toFixed(0) * 1;
        });
      });
    },
  },
  created() {
    this.init();
  },
  mounted() {
    this.$nextTick(() => {
      this.calc_lp_rate_year_fn(); // 年利率
      this.cfg_coin_timer(); //抵押币对数量
      this.get_second_tt(); //第二个矿池的TT
    });
  },
  beforeDestroy() {
    this.lp_timer && clearTimeout(this.lp_timer);
    this.lp_coin_timer && clearTimeout(this.lp_coin_timer);
  },
};
</script>
<style scoped lang='less'>
@import "~@mobile/page/pool-index.less";
</style>