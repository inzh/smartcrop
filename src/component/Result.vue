<script setup lang="ts">
const props = defineProps(['frontimgUrl', 'backimgUrl'])

</script>

<template>
  <div class="result">
    <div class="front">
      <img class="img" :src="props.frontimgUrl" alt="">
    </div>
    <div class="back">
      <img class="img" :src="props.backimgUrl" alt="">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result {
  position: relative;
  width: 595.28px;
  height: 841.89px;
}

.front {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -140%);
  display: flex;
  justify-content: center;
  width: 596px;
  height: 189px;
}

.back {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -0%);
  display: flex;
  justify-content: center;
  width: 596px;
  height: 189px;
}

.img {
  width: 278px;
  height: 186px;
}
</style>
