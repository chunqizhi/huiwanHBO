<template>
  <div>
    <div class="detail-box">
      <ul class="detail-ul">
        <!-- 余额信息 -->
        <li class="detail-li">
          <h4>{{ $t("pool.text07") }}</h4>
          <div class="desc-div">
            <p class="desc"></p>
          </div>
          <p>
            <img src="@assets/image/coin.png" alt="" />
            <!-- 余额 -->
            <span>{{ bonus_value }}</span>
          </p>
          <!-- 按钮 -->
          <div class="staked-box">
            <div class="detail-btn" @click="btn_click('reward')">
              {{ $t("pool.text08") }}
            </div>
          </div>
        </li>
        <!-- 抵押信息 -->
        <li class="detail-li">
          <h4>{{ $t("pool.text09") }}</h4>
          <div class="desc-div">
            <p class="desc">{{ current_pool_name }}</p>
          </div>
          <p>
            <span>{{ pool_value }}</span>
          </p>
          <!-- 解押按钮 -->
          <div class="staked-box">
            <!-- 授权/解押 -->
            <div
              class="detail-btn"
              :class="[pool_value * 1 > 0 ? 'active' : '']"
              @click="btn_click('mask')"
            >
              {{ staked_flag ? $t("pool.text12") : $t("pool.text10") }}
            </div>
            <div>
              <!-- 将货币抵押到池子 -->
              <span
                class="add-btn"
                v-if="staked_flag"
                @click="add_staked"
                :class="[mdex_value * 1 > 0 ? 'active' : '']"
                >+</span
              >
            </div>
          </div>
        </li>
      </ul>
      <!-- 获取&解押 -->
      <div class="all-btn" @click="all_btn_click">{{ $t("pool.text11") }}</div>
    </div>

    <div class="mask" v-if="mask_flag" @click.stop="close_mask"></div>

    <van-dialog
      show-cancel-button
      v-model="mask_flag"
      confirm-button-color="#3bc278"
      @confirm="confirm_click"
      @cancel="close_mask"
      :cancelButtonText="calc_confirm"
      :confirmButtonText="calc_cancal"
    >
      <div class="mask-content">
        <h4>
          {{
            current_type == "withdraw" ? $t("pool.text12") : $t("pool.text13")
          }}
        </h4>
        <p class="span-text">
          <span class="span-coin">TT-USDT-LP</span>
          <span class="span-balance">{{
            current_type == "withdraw" ? pool_value : mdex_value
          }}</span>
        </p>
        <div class="input-box">
          <input type="text" v-model="value1" />
          <span class="text-all" @click="all_staked">{{
            $t("pool.text14")
          }}</span>
        </div>
      </div>
    </van-dialog>
  </div>
</template>


<script>
import cfg from "@/apis/cfg.js";
import spg from "@/apis/spg.js";
export default {
  data() {
    return {
      //
      staked_flag: false, //显示授权/抵押
      mask_flag: false, //弹框
      current_type: "add",
      mask_content: {},
      value1: "",
      bonus_value: "0.0000", //余额

      pool_value: "0.0000", //可解押的LP
      pool_un_value: "0.0000", //可解押未经过处理LP
      pool_deal_value: "0", //可解押用于请求的LP数字

      mdex_value: "0", //未抵押的LP
      mdex_un_value: "0", //未抵押未经过处理的LP数字
      mdex_deal_value: "0", //用于请求的LP数字

      current_type: "withdraw",
      timer: null, //查询收益余额定时器
      deal_timer: null, //查询交易定时器

      current_pool: null,
      current_pool_name: "",
    };
  },
  computed: {
    calc_cancal() {
      return this.$t("pool.text15");
    },
    calc_confirm() {
      return this.$t("pool.text16");
    },
  },
  watch: {
    value1(current, pre) {
      switch (this.current_type) {
        case "withdraw":
          if (current * 1 >= this.pool_un_value * 1) {
            this.value1 = this.pool_un_value;
          }
          this.pool_deal_value = this.value1 * Math.pow(10, 18) + "";
          break;
        // 抵押
        case "stake":
          if (current * 1 >= this.mdex_un_value * 1) {
            this.value1 = this.mdex_un_value;
          }
          this.mdex_deal_value = this.value1 * Math.pow(10, 18) + "";
          break;
      }
    },
  },
  methods: {
    //  获取所有token/解押点击
    btn_click(type) {
      let _this = this;
      // 解押
      if (type == "mask") {
        if (this.staked_flag) {
          // 有抵押的LP
          if (this.pool_un_value * 1 > 0) {
            this.mask_flag = true;
          }
          this.current_type = "withdraw"; //当前状态为解押
          return;
        } else {
          // 未授权 点击授权
          _this.current_pool.approveHuiwanUsdtLoopAddr(
            function () {
              _this.calc_staked_flag();
              console.log("success");
            },
            function () {
              _this.calc_staked_flag();
              console.log("error");
            }
          );
        }
      }
      //
      else if (type == "reward") {
        _this.current_pool.getReward(
          function (res) {
            _this.get_bonus_value_fn();
            console.log(res, "+++++++++");
          },
          function (err) {
            console.log(err);
            _this.get_bonus_value_fn();
          }
        );
      }
    },
    //是否授权过
    calc_staked_flag() {
      let _this = this;
      _this.current_pool.getAccountStakedStatus(
        function (res) {
          console.log(res);
          _this.staked_flag = res * 1 > 0 ? true : false;
        },
        function (err) {
          _this.staked_flag = false;
        }
      );
    },
    close_mask() {
      this.mask_flag = false;
      this.value1 = "";
    },
    add_staked() {
      if (this.mdex_value * 1 == 0) return;
      this.mask_flag = true;
      this.current_type = "stake"; //当前状态为抵押
    },
    calc_show_num(res, len) {
      let result = "";
      if (res.length <= 18) {
        res = this.format_zero(res * 1, 19);
      }
      let length = res.length;
      let pre = res.substring(0, res.length - 18);
      let next = res.substring(length - 18).substring(0, len);
      result = `${pre}.${next}`;

      return result;
    },
    format_zero(num, len) {
      if (String(num).length > len) return num;
      return (Array(len).join(0) + num).slice(-len);
    },
    // 获取盈利余额
    get_bonus_value() {
      let _this = this;
      _this.get_bonus_value_fn();
      _this.timer = setTimeout(() => {
        _this.get_bonus_value_fn();
        if (_this.timer) {
          clearTimeout(_this.timer);
        }
        _this.get_bonus_value();
      }, 3000);
    },
    // 查询盈利余额
    get_bonus_value_fn() {
      let _this = this;
      _this.current_pool.getEarned(
        window.accountAddress,
        function (res) {
          if (res * 1 > 0) {
            _this.bonus_value = _this.calc_show_num(res, 10);
          } else _this.bonus_value = "0.0000";
        },
        function (err) {}
      );
    },
    // 获取抵押的LP
    get_pool_value() {
      let _this = this;
      _this.current_pool.getPoolLP(
        window.accountAddress,
        function (res) {
          console.log(res);
          if (res * 1 > 0) {
            _this.pool_value = _this.calc_show_num(res, 10);
            _this.pool_un_value = _this.calc_show_num(res);
            _this.pool_deal_value = res;
          } else _this.pool_value = "0.0000";
        },
        function () {}
      );
    },
    // 全部抵押/解押
    all_staked() {
      switch (this.current_type) {
        // 解押
        case "withdraw":
          this.value1 = this.pool_un_value;
          break;
        // 抵押
        case "stake":
          this.value1 = this.mdex_un_value;
          break;
      }
    },
    // 弹框点击确定
    confirm_click() {
      // console.log(this.staked_flag);
      switch (this.current_type) {
        // 解押
        case "withdraw":
          this.withdraw_fn();
          break;
        // 抵押
        case "stake":
          this.stake_fn();
          break;
      }
    },
    // 确认解押
    withdraw_fn() {
      let _this = this;
      _this.current_pool.withdrawFromHuiwanUsdtLoopContract(
        _this.pool_deal_value,
        function (res) {
          if (res) {
            _this.check_deal(res);
          }
        },
        function (res) {
          _this.refresh_data();
        }
      );
    },
    // 确认抵押
    stake_fn() {
      let _this = this;
      _this.current_pool.stakingToHuiwanUsdtLoopContract(
        _this.mdex_deal_value,
        function (res) {
          if (res) {
            _this.check_deal(res);
          }
        },
        function (res) {
          _this.refresh_data();
        }
      );
    },
    // 获取未抵押的LP
    get_un_lp() {
      let _this = this;
      _this.current_pool.getBalanceFromhuiwanUsdtMdexContract(
        window.accountAddress,
        function (res) {
          _this.mdex_value = _this.calc_show_num(res, 10);
          _this.mdex_un_value = _this.calc_show_num(res);
          _this.mdex_deal_value = res;
        },
        function () {}
      );
    },
    // 重新获取数据
    refresh_data(res) {
      this.get_pool_value();
      this.get_un_lp();
      this.mask_flag = false;
    },
    // 检测交易状态？
    check_deal(res) {
      let _this = this;
      _this.deal_timer = setTimeout(() => {
        _this
          .get_deal_by_hash(res.result)
          .then((result) => {
            _this.refresh_data();
            setTimeout(() => {
              _this.refresh_data();
              _this.deal_timer && clearTimeout(_this.deal_timer);
            }, 2000);
          })
          .catch((error) => {
            _this.check_deal(res);
          });
      }, 1000);
    },
    get_deal_by_hash(hash) {
      let _this = this;
      return new Promise((resolve, reject) => {
        _this.current_pool.getDealStatusByHash(hash, function (err, res) {
          console.log(err, res);
          if (res) {
            resolve(res);
          } else {
            reject(res);
          }
        });
      });
    },
    test_fn() {
      return new Promise((resolve, reject) => {
        this.current_pool.init(() => {
          resolve();
        });
      });
    },
    // 解押&获取
    all_btn_click() {
      let _this = this;
      _this.current_pool.getExit(
        function () {
          _this.refresh_page_fn();
        },
        function () {
          _this.refresh_page_fn();
        }
      );
    },
    // 获取收益 抵押 解押
    refresh_page_fn() {
      this.get_bonus_value_fn();
      this.get_pool_value();
      this.get_un_lp();
    },
  },
  created() {
    this.current_pool_name = this.$route.query.token;
    if (this.$route.query.token == "TT-USDT_LP") {
      this.current_pool = cfg;
    } else if (this.$route.query.token == "TT") {
      this.current_pool = spg;
    }
    this.test_fn().then(() => {
      this.calc_staked_flag();
      this.refresh_page_fn();
    });
  },
  mounted() {
    this.$nextTick(() => {});
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
    this.deal_timer && clearTimeout(this.deal_timer);
  },
};
</script>

<style scoped lang='less'>
@import "~@mobile/page/pool-detail.less";
</style>