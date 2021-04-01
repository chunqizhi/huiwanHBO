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
              <span> {{ token_list.pre_coin || "0.0000" }} USDT</span>
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
      that.five_coin_fn();
    },
    // five  pre_coin  next_coin   获取five抵押数量
    five_coin_fn() {
      let that = this;

      five.getBalanceFromHuiwanTokenContract(HBOUSDTMdexAddr, function (res) {
        console.log("BSA 66666" + res);
        that.token_list.pre_coin = (that.$wei(res) * 1 * that.rate * 2).toFixed(
          0
        );
        // 第一个池子的tt
        // 查询 mdex 中配对合约拥有 usdtToken 的数量
        five.getBalanceFromUsdtTokenContract(
          HBOUSDTMdexAddr,
          function (result) {
            // console.log("ht  " + result);/
            result = result * 1 > 0 ? result : 0;
            // usdt  10个 0
            // contractType
            switch (contractType) {
              case "okex":
                // that.token_list.next_coin = (that.$usdtMin(result) * 2).toFixed(0);
                // that.usdt_total = (that.$usdtMin(result) * 1).toFixed(0);
                break;
              case "ttex":
                // that.token_list.next_coin = (that.$wei(result) * 2).toFixed(0);
                // that.usdt_total = (that.$wei(result) * 1).toFixed(0);
                // that.token_list.pre_coin = ()
                break;
              default:
              // console.log(123123);
            }

            //第一个矿池的USDT
          }
        );
      });
    },
    five_coin_timer() {
      this.five_coin_fn();
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
        // console.log( 'qliwhelqhwe')

        that.token_list.day = that.$wei(res);
        that.token_list.mounth = that.$wei(res) * 30;
        // 拿到总收益
        five.getTotalSupply(function (result) {
          console.log(`that.tt_rate:${result} that.rate`);

          if (result * 1 == 0||that.token_list.pre_coin==0) {
            that.token_list.apy = `0.00%`;
            return;
          }
          let total = that.$wei(result);
          // this.rate
          that.token_list.apy =
            (
              ((that.token_list.day * that.tt_rate) / (total * that.rate)) *
              360 *
              100
            ).toFixed(2) + "%";
          // that.token_list.apy =
          //   (
          //     ((that.token_list.day * that.rate) / that.token_list.pre_coin) *
          //     360 *
          //     100
          //   ).toFixed(2) + "%";

          // that.token_list.apy =
          //   ((that.token_list.day * that.rate/ total) * 360 * 100).toFixed(2) + "%";

          // console.log("first pool apy    ", that.token_list.apy);
        });
      });
    },
    // 定时器 查询 LP年利率
    calc_lp_rate_year_fn() {
      this.calc_lp_rate_year();
      // console.log(123123)
      this.lp_timer && clearTimeout(this.lp_timer);
      this.lp_timer = setTimeout(() => {
        this.calc_lp_rate_year_fn();
      }, 3000);
    },
    // 获取第二个pool的TT数量
    // get_second_tt() {
    //   let that = this;
    //   spg.init(() => {
    //     spg.getTotalSupply(function (res) {
    //       that.second_pool_tt = (that.$wei(res) * 1).toFixed(0) * 1;
    //     });
    //   });
    // },
  },
  created() {
    this.init();
  },
  mounted() {
    console.log(12312312);
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