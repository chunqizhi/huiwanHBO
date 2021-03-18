<template>
  <div class="home-div">
    <div>
      <div class="home-all">
        <div class="all-desc">{{ $t("pool.text01") }}10.00 USDT</div>
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
                {{ $t("pool.text02") }} {{ item.day }} {{ item.coin }}({{
                  $t("pool.text03")
                }})
              </p>
              <p>
                {{ $t("pool.text02") }} {{ item.mounth }} {{ item.coin }}({{
                  $t("pool.text04")
                }})
              </p>
            </div>

            <div class="token-coin">
              <h4>{{ $t("pool.text06") }}</h4>
              <span>{{ item.pre_coin }} {{ item.coin }}</span
              ><br />
              <span> {{ item.next_coin }} USDT</span>
            </div>

            <div class="choose-div percent-div">
              <span>APY</span>
              <span>0%</span>
            </div>
            <div class="choose-div click-div" @click="choose_click(item.coin)">
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
        },
        {
          coin: "HBO",
          day: "",
          mounth: "",
          query: "HBO",
          pre_coin: "",
          next_coin: "",
        },
      ],
    };
  },
  methods: {
    init() {
      let that = this;
      cfg.init(function (res) {
        that.account = res;
        // console.log("当前钱包地址 ：" + res);
        // 查询 huiwanUsdtLoop 池子初始奖励数量 57600000000000000000000
        cfg.getInitreward(function (res) {
          // console.log("当前奖励数量：" + res);
          that.token_list[0].day = res / 1000000000000000000;
          that.token_list[0].mounth =( res / 1000000000000000000) * 30;
        });
        // 查询项目方 huiwanUsdtLoop 池子里面的 lp 总数量
        cfg.getTotalSupply(function (res) {
          // console.log("当前池子 lp 总量：" + res);
          that.totalSupply = res / 1000000000000000000;
        });
        // 查询某个用户在 huiwanUsdtLoop 池子中的当前收益
        cfg.getEarned(res, function (res) {
          // console.log("地址：" + that.account + " 的收益数量：" + res);
        });
        // 查询 mdex 中配对合约拥有 huiwanToken 的数量
        cfg.getBalanceFromHuiwanTokenContract(
          huiwanUsdtMdexAddr,
          function (res) {
            // console.log("mdex 中配对合约拥有 huiwanToken 数量：" + res);
            // that.huiwanToken = res / 1000000000000000000;
            that.token_list[0].pre_coin = res / 1000000000000000000;
          }
        );
        // 查询 mdex 中配对合约拥有 usdtToken 的数量
        cfg.getBalanceFromUsdtTokenContract(huiwanUsdtMdexAddr, function (res) {
          // console.log("mdex 中配对合约拥有 usdtToken 数量：" + res);
          // that.huiwanUsdt = res / 1000000000000000000;

          res = res>0? res:0
          that.token_list[0].next_coin = res / 1000000000000000000;
        });
        // 在 mdex 配对合约中获取我的 lp 数量
        cfg.getBalanceFromhuiwanUsdtMdexContract(that.account, function (res) {
          that.huiwanUsdtMdex = res;
          // console.log(
          //   "地址：" +
          //     that.account +
          //     " 在 mdex 配对合约中的 lp 数量 = " +
          //     that.huiwanUsdtMdex
          // );
        });
        // 查询某个用户在 huiwanUsdtLoop 池子中的余额
        cfg.getBalanceFromHuiwanUsdtLoopContract(that.account, function (res) {
          // console.log(
          //   "地址：" + that.account + " 在 huiwanUsdtLoop 池子中的余额 = " + res
          // );
        });
      });
    },
    choose_click(path) {
      this.$router.push({
        path:'/pool_detail',
        query:{
          token:path
        }
      });
    },
    spg_init() {
      let that = this;
      spg.init(function (res) {
        // that.account = res;
        console.log("当前钱包地址 ：1111" + res);
        // 查询 huiwanUsdtLoop 池子初始奖励数量 57600000000000000000000
        spg.getInitreward(function (res) {
          console.log("当前奖励数量：" + res);
          that.token_list[1].day = res / 1000000000000000000;
          that.token_list[1].mounth = (res / 1000000000000000000) * 30;
          // that.monthReward = that.initReward * 30;
        });
        // 查询项目方 huiwanUsdtLoop 池子里面的 lp 总数量
        spg.getTotalSupply(function (res) {
          console.log("当前池子 lp 总量：" + res);
          // that.totalSupply = res / 1000000000000000000;
        });
        // 查询某个用户在 huiwanUsdtLoop 池子中的当前收益
        spg.getEarned(res, function (res) {
          // console.log("地址：" + that.account + " 的收益数量：" + res);
        });
        // 查询 mdex 中配对合约拥有 huiwanToken 的数量
        spg.getBalanceFromHuiwanTokenContract(
          huiwanSinglePoolAddr,
          function (res) {
            console.log("mdex 中配对合约拥有 huiwanToken 数量：" + res);
            // that.huiwanToken = res / 1000000000000000000;
            that.token_list[1].pre_coin = res / 1000000000000000000;
          }
        );
        // 查询 mdex 中配对合约拥有 usdtToken 的数量
        spg.getBalanceFromUsdtTokenContract(
          huiwanSinglePoolAddr,
          function (res) {
            // console.log("mdex 中配对合约拥有 usdtToken 数量：" + res);
              res = res>0? res:0
            that.token_list[1].next_coin = res / 1000000000000000000;
            // that.huiwanUsdt = res / 1000000000000000000;
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
        // 查询某个用户在 huiwanUsdtLoop 池子中的余额
        // spg.getBalanceFromHuiwanUsdtLoopContract(that.account, function (res) {
        //   console.log(
        //     "地址：" +
        //       that.account +
        //       " 在 huiwanUsdtLoop 池子中的余额 111= " +
        //       res
        //   );
        // });
      });
    },
  },
  created() {
    this.init();
    this.spg_init();
  },
};
</script>
<style scoped lang='less'>
@import "~@mobile/page/pool-index.less";
</style>