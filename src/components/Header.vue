<template>
  <div class="header-box">
    <div class="header">
      <img src="@assets/image/icon.png" alt="" class="header-logo" />
      <span class="header-title">Search Artifacts</span>
      <ul class="list-ul">
        <li class="btn-li list-li">{{ $t("header.nav04") }}</li>
        <li class="btn-li list-li">{{ account }}</li>
        <li class="btn-li list-li" @click="show_mune">
          {{ $t("header.nav05") }}
        </li>
      </ul>
    </div>
    <ul class="nav-ul list-ul" v-if="mune_flag">
      <li class="empty-li"></li>
      <li
        class="nav-li list-li"
        v-for="item in nav_list"
        :key="item.path"
        @click="nav_click(item)"
        :class="{
          active:
            item.path == $route.path ||
            ($route.path.indexOf('pool_') > 0 &&
              item.path.indexOf('pool_') > 0),
        }"
      >
        {{ $t(item.text) }}
      </li>
      <li class="nav-li list-li lang-btn" @click="lang_click">CN/EN</li>
    </ul>
    <div class="header-desc">{{ $t("header.desc01") }}</div>
  </div>
</template>

<script>
import cfg from "@/apis/cfg.js";
export default {
  // inject: ["reload"],
  data() {
    return {
      nav_list: [
        {
          text: "header.nav01",
          path: "/home",
          desc: "",
        },
        {
          text: "header.nav02",
          path: "/pool_index",
          desc: "header.desc01",
        },
        {
          text: "header.nav03",
          path: "/info",
        },
      ],
      current_router: "",
      mune_flag: false,
      pool_desc: {
        "/pool_detail": "header.desc01",
        "/pool_index": "header.desc02",
      },
      account: "",
    };
  },
  watch: {
    $route(to, from) {
      this.current_router = to.path;
      console.log(to.path);
    },
  },
  methods: {
    // 导航栏点击
    nav_click(item) {
      this.$router.push(item.path);
    },
    // 语言切换
    lang_click() {
      let temp = this.$i18n.locale;
      temp == "zh" ? (this.$i18n.locale = "en") : (this.$i18n.locale = "zh");
      // this.reload();
    },
    // 菜单栏
    show_mune() {
      this.mune_flag = !this.mune_flag;
    },
    init() {
      let _this = this;
      cfg.init(function (res) {
        let pre = res.substring(0, 6);
        let next = res.substring(res.length - 4);
        _this.account = `${pre}...${next}`;
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang='less' scoped>
@import "~@mobile/header.less";
</style>