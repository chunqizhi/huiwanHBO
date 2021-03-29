<template>
  <div class="footer">
    <ul class="footer-ul">
      <li
        class="footer-li"
        v-for="item in nav_list"
        :key="item.text"
        @click="item_click(item)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      nav_list: [
        {
          text: "GitHub",
          url: "https://github.com/BSA-team/BSAcontract",
        },
        {
          text: "Twitter",
          url: "https://mobile.twitter.com/Bsa38227026Bsa",
        },
        {
          text: "Telegram",
          url: "http://bsa-coin.org/bsa/bsa.pdf",
        },
      ],
    };
  },
  methods: {
    item_click(item) {
      window.open(item.url);
    },
  },
};
</script>

<style lang='less' scoped>
@import "~@mobile/footer.less";
</style>