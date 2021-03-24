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
              <h4>{{ $t("pool.text06") }}</h4>
              <span>{{ token_list.pre_coin }} {{ token_list.coin_name }}</span
              ><br />
              <span v-if="token_list.coin != 'TT'">
                {{ token_list.next_coin || "0.0000" }} USDT</span
              >
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
// @ is an alias to /src
import spg from "@/apis/spg.js";
import { huiwanSinglePoolAddr } from "@/apis/addr/spg.js";
export default {
  name: "Home",
  data() {
    return {
      token_list: {
        coin: "TT",
        day: "",
        mounth: "",
        query: "TT",
        pre_coin: "",
        next_coin: "",
        coin_name: "TT",
        apy: "",
      },
      tt_timer: null,
    };
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
    spg_init_fn() {
      return new Promise((resolve, reject) => {
        spg.init((res) => {
          if (res) {
            resolve(res);
          } else {
            reject("error");
          }
        });
      });
    },
    spg_init() {
      let that = this;
      that.spg_init_fn().then((res) => {
        spg.getInitreward(function (res) {
          console.log("当前奖励数量：" + res);
          that.token_list.day = that.$wei(res);
          that.token_list.mounth = that.$wei(res) * 30;
        });

        // 计算年利率
        that.calc_lp_rate_year();
        // 查询 mdex 中配对合约拥有 huiwanToken 的数量
        spg.getTotalSupply(function (res) {
          console.log("next_coin00", res);
          that.token_list.pre_coin = (that.$wei(res) * 1).toFixed(2);
        });

        // 查询 mdex 中配对合约拥有 usdtToken 的数量
        spg.getBalanceFromUsdtTokenContract(
          huiwanSinglePoolAddr,
          function (res) {
            that.token_list.next_coin = that.$wei(res);
          }
        );
        that.calc_timer()
      });
    },
    // 计算年利率以及每天每日的收益
    calc_lp_rate_year() {
      let that = this;
      spg.getInitreward(function (res) {
        that.token_list.day = that.$wei(res);
        that.token_list.mounth = that.$wei(res) * 30;
      });
      spg.getTotalSupply(function (res) {
        // console.log("pre_coin  " + res);
        let total = that.$wei(res);
        that.token_list.pre_coin = (that.$wei(res) * 1).toFixed(2);
        if (total == 0) {
          that.token_list.apy = `0.00%`;
          return;
        }
        that.token_list.apy =
          ((that.token_list.day / total) * 360 * 100).toFixed(2) + "%";
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
    this.spg_init();
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