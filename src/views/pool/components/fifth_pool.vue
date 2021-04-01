<template>
  <div class="home-div">
    <div>
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
              <span> {{ fifth_total || "0.0000" }} USDT</span>
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
import five from "@/apis/five.js";
import { HBOUSDTMdexAddr, contractType } from "@/apis/token.js";
export default {
  name: "Home",
  props: {
    rate: {
      default: 1,
    },
    tt_rate: {
      default: 0,
    },
    fifth_total: {
      default: 0,
    },
    fifth_unfixed_total: {
      default: 0,
    },
  },
  data() {
    return {
      token_list: {
        coin: "MDX-USDT-LP",
        day: "",
        mounth: "",
        query: "MDX-USDT-LP",
        pre_coin: "",
        next_coin: "",
        coin_name: "BSA",
        apy: "",
      },

      lp_timer: null,
      lp_coin_timer: null, //币对抵押数量定时器
    };
  },
  watch: {
    rate(val) {
      this.rate = val;
    },
    tt_rate(val) {
      this.tt_rate = val;
    },
    fifth_total(val) {
      this.fifth_total = val;
    },
    fifth_unfixed_total(val) {
      this.fifth_unfixed_total = val;
    },
  },
  methods: {
    init() {
      five
        .initFnPromise()
        .then((res) => {
          // 初始化拿到自己的地址
          this.account = res;
          this.five_init_callback();
          // this.get_second_tt();
          this.calc_lp_rate_year_fn();
          this.five_coin_timer();
        })
        .catch((err) => {});
    },
    // init成功后的callback
    five_init_callback() {
      let that = this;
      five.getFiveDay(function (res) {
        that.token_list.day = that.$wei(res);
        that.token_list.mounth = that.$wei(res) * 30;
      });
    },
    five_coin_timer() {
      this.lp_coin_timer && clearTimeout(this.lp_coin_timer);
      this.lp_coin_timer = setTimeout(() => {
        this.five_coin_timer();
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
      five.getFiveDay(function (res) {
        that.token_list.day = that.$wei(res);
        that.token_list.mounth = that.$wei(res) * 30;
        // fifth_unfixed_total
        if (that.fifth_unfixed_total == 0) {
          that.token_list.apy = `0.00%`;
          return;
        }
        that.token_list.apy =
          (
            ((that.token_list.day * that.tt_rate) / that.fifth_unfixed_total) *
            360 *
            100
          ).toFixed(2) + "%";
      });
    },
    // 定时器 查询 LP年利率
    calc_lp_rate_year_fn() {
      this.calc_lp_rate_year();
      this.lp_timer && clearTimeout(this.lp_timer);
      this.lp_timer = setTimeout(() => {
        this.calc_lp_rate_year_fn();
      }, 3000);
    },
  },
  created() {
    this.init();
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