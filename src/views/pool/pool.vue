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
          <li
            class="coin-li"
            v-for="(item, index) in token_list"
            :key="item.coin + index"
          >
            <h2>{{ item.coin }}</h2>
            <div class="info-div">
              <p>
                {{ $t("pool.text02") }} {{ item.day }} {{ item.coin_name }}({{
                  $t("pool.text03")
                }})
              </p>
              <p>
                {{ $t("pool.text02") }} {{ item.mounth }}
                {{ item.coin_name }}({{ $t("pool.text04") }})
              </p>
            </div>

            <div class="token-coin">
              <h4>{{ $t("pool.text06") }}</h4>
              <span>{{ item.pre_coin }} {{ item.coin_name }}</span
              ><br />
              <span v-if="item.coin != 'TT'">
                {{ item.next_coin || "0.0000" }} USDT</span
              >
            </div>

            <div class="choose-div percent-div">
              <span>APY</span>
              <span>{{ item.apy }}</span>
            </div>
            <div class="choose-div click-div" @click="choose_click(item.query)">
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
import cfg from "@/apis/cfg.js";
import spg from "@/apis/spg.js";
import { huiwanUsdtMdexAddr } from "@/apis/token.js";
import { huiwanSinglePoolAddr } from "@/apis/addr/spg.js";
export default {
  name: "Home",
  data() {
    return {
      account: "",
      totalSupply: "",
      initReward: "",
      monthReward: "",
      huiwanToken: "",
      huiwanUsdt: "",
      huiwanUsdtMdex: 0,
      token_list: [
        {
          coin: "TT-USDT_LP",
          day: "",
          mounth: "",
          query: "TT-USDT_LP",
          pre_coin: "",
          next_coin: "",
          coin_name: "TT",
          apy: "",
        },
        {
          coin: "TT",
          day: "",
          mounth: "",
          query: "TT",
          pre_coin: "",
          next_coin: "",
          coin_name: "TT",
          apy: "",
        },
      ],
      lp_timer: null,
      tt_timer: null,

      tt_usdt_rate: 0,
      tt_total: 0,
      usdt_total: 0,
    };
  },

  computed: {
    calc_total() {
      this.usdt_total = this.usdt_total || 0;
      this.tt_usdt_rate = this.tt_usdt_rate || 0;
      this.tt_total = this.tt_total || 0;
      return (this.tt_total * this.tt_usdt_rate + this.usdt_total * 1).toFixed(
        2
      );
    },
  },
  methods: {
    init() {
      let that = this;
      cfg.init(function (res) {
        that.account = res;
        // console.log("当前钱包地址 ：" + res);
        // 查询 huiwanUsdtLoop 池子初始奖励数量 57600000000000000000000
        cfg.getInitreward(function (res) {
          //  that.$wei(res)
          that.token_list[0].day = that.$wei(res);
          that.token_list[0].mounth = that.$wei(res) * 30;
        });
        // 查询项目方 huiwanUsdtLoop 池子里面的 lp 总数量
        cfg.getTotalSupply(function (res) {
          console.log("当前池子 lp 总量：" + res);
          let total = that.$wei(res);
          that.token_list[0].apy =
            ((that.token_list[0].day / total) * 360 * 100).toFixed(2) + "%";
        });
        // 查询 mdex 中配对合约拥有 huiwanToken 的数量
        cfg.getBalanceFromHuiwanTokenContract(
          huiwanUsdtMdexAddr,
          function (res) {
            console.log("mdex 中配对合约拥有 huiwanToken 数量：" + res);
            that.token_list[0].pre_coin = (that.$wei(res) * 1).toFixed(2);
            // 第一个池子的tt
            that.tt_total += that.token_list[0].pre_coin * 1;
            // 查询 mdex 中配对合约拥有 usdtToken 的数量
            cfg.getBalanceFromUsdtTokenContract(
              huiwanUsdtMdexAddr,
              function (result) {
                console.log("mdex 中配对合约拥有 usdtToken 数量：" + result);
                result = result * 1 > 0 ? result : 0;

                that.token_list[0].next_coin = (that.$wei(result) * 1).toFixed(
                  2
                );
                //第一个矿池的USDT
                that.usdt_total = that.token_list[0].next_coin * 1;
                console.log(
                  that.usdt_total,
                  " that.usdt_total that.usdt_total that.usdt_total"
                );
                // 汇率
                if (that.token_list[0].pre_coin * 1 > 0) {
                  that.tt_usdt_rate =
                    that.token_list[0].next_coin / that.token_list[0].pre_coin;
                } else {
                  that.tt_usdt_rate = 0;
                }
              }
            );
          }
        );
      });
    },
    choose_click(path) {
      this.$router.push({
        path: "/pool_detail",
        query: {
          token: path,
        },
      });
    },
    spg_init() {
      let that = this;
      spg.init(function (res) {
        that.account = res;
        spg.getInitreward(function (res) {
          console.log("当前奖励数量：" + res);
          that.token_list[1].day = that.$wei(res);
          that.token_list[1].mounth = that.$wei(res) * 30;
        });
        // 查询项目方 huiwanUsdtLoop 池子里面的 lp 总数量
        spg.getTotalSupply(function (res) {
          console.log("当前池子 lp 总量：" + res);
          let total = that.$wei(res);
          if (total == 0) {
            that.token_list[1].apy = `0.00%`;
            return;
          }
          that.token_list[1].apy =
            ((that.token_list[1].day / total) * 360 * 100).toFixed(2) + "%";
        });
        // 查询 mdex 中配对合约拥有 huiwanToken 的数量
        spg.getTotalSupply(function (res) {
          that.token_list[1].pre_coin = (that.$wei(res) * 1).toFixed(2);
          that.tt_total += that.token_list[1].pre_coin * 1;
        });
        // 查询 mdex 中配对合约拥有 usdtToken 的数量
        spg.getBalanceFromUsdtTokenContract(
          huiwanSinglePoolAddr,
          function (res) {
            that.token_list[1].next_coin = that.$wei(res);
          }
        );
        // 在 mdex 配对合约中获取我的 lp 数量
        spg.getBalanceFromhuiwanUsdtMdexContract(that.account, function (res) {
          that.huiwanUsdtMdex = res;
          console.log(
            "地址：" +
              that.account +
              " 在 mdex 配对合约中的 lp 数量 = " +
              that.huiwanUsdtMdex
          );
        });
      });
    },
    // 计算年利率
    calc_lp_rate_year() {
      // 查询 huiwanUsdtLoop 池子初始奖励数量 57600000000000000000000
      let that = this;
      cfg.getInitreward(function (res) {
        that.token_list[0].day = that.$wei(res);
        that.token_list[0].mounth = that.$wei(res) * 30;
        // 拿到总收益
        cfg.getTotalSupply(function (result) {
          let total = that.$wei(result);
          that.token_list[0].apy =
            ((that.token_list[0].day / total) * 360 * 100).toFixed(2) + "%";
        });
      });
      spg.getInitreward(function (res) {
        that.token_list[1].day = that.$wei(res);
        that.token_list[1].mounth = that.$wei(res) * 30;
      });
      // 查询项目方 huiwanUsdtLoop 池子里面的 lp 总数量
      spg.getTotalSupply(function (res) {
        console.log("当前池子 lp 总量：" + res);
        let total = that.$wei(res);
        if (total == 0) {
          that.token_list[1].apy = `0.00%`;
          return;
        }
        that.token_list[1].apy =
          ((that.token_list[1].day / total) * 360 * 100).toFixed(2) + "%";
      });
    },
    calc_tt_rate_year() {},
    // 定时器 查询 LP年利率
    calc_lp_rate_year_fn() {
      this.calc_lp_rate_year();
      this.lp_timer && clearTimeout(this.lp_timer);
      this.lp_timer = setTimeout(() => {
        this.calc_lp_rate_year_fn();
      }, 5000);
    },
  },
  created() {
    this.init();
    this.spg_init();
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.calc_lp_rate_year_fn();
      }, 3000);
    });
  },
  // before
  beforerouteleave() {
    this.lp_timer && clearTimeout(this.lp_timer);
    this.tt_timer && clearTimeout(this.tt_timer);
  },
  beforeDestroy() {
    this.lp_timer && clearTimeout(this.lp_timer);
    this.tt_timer && clearTimeout(this.tt_timer);
  },
};
</script>
<style scoped lang='less'>
@import "~@mobile/page/pool-index.less";
</style>