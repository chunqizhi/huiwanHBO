<template>
  <div class="home-div">
    <div >
      <div class="home-all">
        <div class="all-desc">{{$t('pool.text01')}}10.00 USDT</div>
      </div>
      <div>
        <ul class="coin-ul">
          <li class="coin-li" v-for="(item,index) in token_list" :key="item.coin+index">
            <h2>{{ item.coin }}</h2>
            <div class="info-div">
              <p>{{$t('pool.text02')}} {{ initReward }} TT({{$t('pool.text03')}})</p>
              <p>{{$t('pool.text02')}} {{ monthReward }} TT({{$t('pool.text04')}})</p>
            </div>

            <div class="token-coin">
              <h4>{{$t('pool.text06')}}</h4>
              <span>{{ huiwanToken }} TT</span><br />
              <span> {{ huiwanUsdt }} USDT</span>
            </div>

            <div class="choose-div percent-div">
              <span>APY</span>
              <span>0%</span>
            </div>
            <div  class="choose-div click-div" @click='choose_click'>{{$t('pool.text05')}}</div>
          </li>
        </ul>

      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import cfg from "@/apis/nodeServer.js";
import {huiwanUsdtMdexAddr} from  '@/apis/token.js'
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
        },
        // {
        //   coin: "TT-USDT_LP",
        //   day: "",
        //   mounth: "",
        // },
        // {
        //   coin: "TT-USDT_LP",
        //   day: "",
        //   mounth: "",
        // },
        // {
        //   coin: "TT-USDT_LP",
        //   day: "",
        //   mounth: "",
        // },
        // {
        //   coin: "TT-USDT_LP",
        //   day: "",
        //   mounth: "",
        // },
      ],
    };
  },
  methods: {
    init() {
      let that = this;
      cfg.init(function (res) {
        that.account = res;
        console.log("当前钱包地址 ：" + res);
        // 查询 huiwanUsdtLoop 池子初始奖励数量 57600000000000000000000
        cfg.getInitreward(function (res) {
          console.log("当前奖励数量：" + res);
          that.initReward = res / 1000000000000000000;
          that.monthReward = that.initReward * 30;
        });
        // 查询项目方 huiwanUsdtLoop 池子里面的 lp 总数量
        cfg.getTotalSupply(function (res) {
          console.log("当前池子 lp 总量：" + res);
          that.totalSupply = res / 1000000000000000000;
        });
        // 查询某个用户在 huiwanUsdtLoop 池子中的当前收益
        cfg.getEarned(res, function (res) {
          console.log("地址：" + that.account + " 的收益数量：" + res);
        });
        // 查询 mdex 中配对合约拥有 huiwanToken 的数量
        cfg.getBalanceFromHuiwanTokenContract(
          huiwanUsdtMdexAddr,
          function (res) {
            console.log("mdex 中配对合约拥有 huiwanToken 数量：" + res);
            that.huiwanToken = res / 1000000000000000000;
          }
        );
        // 查询 mdex 中配对合约拥有 usdtToken 的数量
        cfg.getBalanceFromUsdtTokenContract(
          huiwanUsdtMdexAddr,
          function (res) {
            console.log("mdex 中配对合约拥有 usdtToken 数量：" + res);
            that.huiwanUsdt = res / 1000000000000000000;
          }
        );
        // 授权 huiwanUsdtLoop 池子合约可以帮我在 mdex 配对合约花费我的 100000000 个 lp 份额
        //cfg.approveHuiwanUsdtLoopAddr(function(res) {
        //   console.log("授权 huiwanUsdtLoop 池子合约可以帮我在 mdex 配对合约花费我的 100000000 个 lp 份额: " + res);
        //});
        // 在 mdex 配对合约中获取我的 lp 数量
        cfg.getBalanceFromhuiwanUsdtMdexContract(that.account, function (res) {
          that.huiwanUsdtMdex = res;
          console.log(
            "地址：" +
              that.account +
              " 在 mdex 配对合约中的 lp 数量 = " +
              that.huiwanUsdtMdex
          );
        });
        // 抵押 lp 到 huiwanUsdtLoop 池子
        //cfg.stakingToHuiwanUsdtLoopContract("499999999999000",function(res) {
        //    console.log("lalallalal " + res);
        //}, function(res){
        //    console.log("lalallalal failed: " + res);
        //});
        // 查询某个用户在 huiwanUsdtLoop 池子中的余额
        cfg.getBalanceFromHuiwanUsdtLoopContract(that.account, function (res) {
          console.log(
            "地址：" + that.account + " 在 huiwanUsdtLoop 池子中的余额 = " + res
          );
        });
        // 解押
        cfg.withdrawFromHuiwanUsdtLoopContract(
          "499999999999000",
          function (res) {
            console.log(res);
          },
          function (res) {
            console.log(res);
          }
        );
      });
    },
    choose_click(){
        this.$router.push('/pool_detail')
    }
  },
  created() {
    this.init();
  },
};
</script>
<style scoped lang='less'>
@import "~@mobile/page/pool-index.less";

</style>