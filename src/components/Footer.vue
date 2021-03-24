<template>
  <div class="footer">
    <ul class="footer-ul">
      <li
        class="footer-li"
        v-for="item in nav_list"
        :key="item.text"
        @click="item_click(item.url)"
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
      nav_list: [
        {
          text: "GitHub",
          url: "",
        },
        {
          text: "Twitter",
          url: "",
        },
        {
          text: "Telegram",
          url: "",
        },
      ],
    };
  },
  methods: {
    item_click(item) {},
  },
};
</script>

<style lang='less' scoped>
@import "~@mobile/footer.less";
</style>