<template>
  <div class="pdf">
    <div class="test" @click="temp">{{$t('tips.tips05')}}</div>
    <iframe
      :src="url + '#toolbar=0'"
      frameborder="0"
      width="100%"
      height="100%"
      scrolling="no"
    >
    </iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "http://bsa-coin.org/bsa/bsa.pdf",
    };
  },
  methods: {
    temp() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang='less' scoped>
.pdf {
  width: 100vw;
  height: 100vh;
  iframe {
    border: medium none;
  }
}
.test {
  position: fixed;
  width: 0.46rem;
  height: 0.46rem;
  background-color: #616af0;
  border-radius: 50%;
  z-index: 66;
  right: 0.2rem;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  line-height: 0.46rem;
  color: #fff;
}
</style>