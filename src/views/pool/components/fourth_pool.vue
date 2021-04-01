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
              <span>{{ token_list.pre_coin }} USDT</span><br />
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
import hbo from "@/apis/hbo.js";
export default {
  name: "Home",
  props: {
    rate: {
      default: 0,
    },
    tt_rate: {
      default: 0,
    },
  },
  data() {
    return {
      token_list: {
        coin: "MDX",
        day: "",
        mounth: "",
        query: "MDX",
        pre_coin: "",
        next_coin: "",
        coin_name: "BSA",
        apy: "",
      },
      tt_timer: null,
    };
  },
  watch: {
    rate(val) {
      console.log(this.rate, "qwlekhklqwh");
      this.rate = val;
    },
    tt_rate(val) {
      this.tt_rate = val;
    },
  },
  methods: {
    choose_click(path) {
      this.$router.push({
        path: "/pool_detail",
        query: {
          token: path,
        },
      });
    },
    // 初始化
    hbo_init_fn() {
      return new Promise((resolve, reject) => {
        hbo.init((res) => {
          if (res) {
            resolve(res);
          } else {
            reject("error");
          }
        });
      });
    },
    hbo_init() {
      let that = this;
      that.hbo_init_fn().then((res) => {
        console.log(res);
        hbo.getInitreward(function (res) {
          console.log("当前奖励数量：666" + res);
          that.token_list.day = that.$wei(res);
          that.token_list.mounth = that.$wei(res) * 30;
        });

        // 计算年利率
        that.calc_lp_rate_year();
        // 查询 mdex 中配对合约拥有 huiwanToken 的数量
        hbo.getTotalSupply(function (res) {
          console.log(res, "getTotalSupply");
          that.token_list.pre_coin = (that.$wei(res) * 1).toFixed(0);
        });

        that.calc_timer();
      });
    },
    // 计算年利率以及每天每日的收益
    calc_lp_rate_year() {
      let that = this;
      hbo.getInitreward(function (res) {
        that.token_list.day = that.$wei(res);
        that.token_list.mounth = that.$wei(res) * 30;
      });
      hbo.getTotalSupply(function (res) {
        console.log("HBO 444 " + res);
        let total = that.$wei(res);
        that.token_list.pre_coin = (that.$wei(res) * that.rate).toFixed(0);
        if (total == 0) {
          that.token_list.apy = `0.00%`;
          return;
        }
        // console.log(
        //   `tt_rate:${that.tt_rate} HBO_rate:${that.rate} ${
        //     that.token_list.day * that.tt_rate
        //   } ${total * that.rate}`
        // );
        that.token_list.apy =
          (
            ((that.token_list.day * that.tt_rate) / (total * that.rate)) *
            360 *
            100
          ).toFixed(2) + "%";
        // console.log("apy  " +     that.token_list.apy);
      });
    },
    calc_timer() {
      this.tt_timer && clearTimeout(this.tt_timer);
      this.calc_lp_rate_year();
      this.tt_timer = setTimeout(() => {
        this.calc_timer();
      }, 2000);
    },
  },
  created() {
    this.hbo_init();
  },
  mounted() {},
  beforeDestroy() {
    this.tt_timer && clearTimeout(this.tt_timer);
  },
};
</script>
<style scoped lang='less'>
@import "~@mobile/page/pool-index.less";
</style>