<template>
  <div class="info-div">
    <h2>{{ $t("info.title") }}</h2>
   <div class="img-box">
      <img src="@assets/image/apply.png" alt="" class="header-logo" />
   </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
h2 {
  text-align: center;
  color: #120e47;
  text-align: center;
  font-size: 0.18rem;
  position: relative;
  padding: 0.18rem 0;
}
.img-box{
  width: 92%;
  margin: 0 auto ;
}
img{  
  width: 100%;
}
</style>