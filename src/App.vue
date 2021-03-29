<template>
  <div id="app" :class="[calc_router ? 'active' : 'unactive']">
    <Header v-if="calc_router" />
    <router-view :key="$route.fullPath" />
    <Footer v-if="calc_router" />
  </div>
</template>

<script>
import Header from "@components/Header.vue";
import Footer from "@components/Footer.vue";

export default {
  components: {
    Header,
    Footer,
  },
  computed: {
    calc_router() {
      return this.$route.fullPath.indexOf("pdf") < 0;
    },
  },
};
</script>
<style scoped>
.active {
  padding-bottom: 0.2rem;
}
.unactive {
  padding-bottom: 0;
}
</style>