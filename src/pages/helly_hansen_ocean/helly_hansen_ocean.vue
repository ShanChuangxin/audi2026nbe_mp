<!-- 与订单详情合并了 -->
<!-- 门禁（参与的）详情 -->

<script setup lang="ts">
import { ref } from 'vue';

function navitateToHome() {
  console.log("跳转到地图页面")
  uni.navigateTo({url: "/pages/map/map"});
}

</script>

<template>
  <view class="top-container">
    <!-- 标题 -->
      <view class="language"></view>
  </view>
  <view class="index-content"></view>

  <!-- 底部按钮栏 -->
  <view class="btn-container">
    <view class="btn-home" @tap="navitateToHome"></view>
  </view>

</template>

<style lang="scss">
page {
  background-color: black;
  width: 100vw;
  height: 100vh;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/helly_hansen_ocean/bg.jpg") top center no-repeat;
  background-size: cover;
  overflow: hidden;
  padding-top: 100rpx;
}
// 顶部Bar
.top-container {
  position: absolute;
  top: 50rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  // background-color: pink;
  width: 90%;

  .language {
    float: right;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/language.png") top center no-repeat;
    background-size: 100% 100%;
    width: 60rpx;
    height: 60rpx;
  }
}

.index-content {
  position: absolute;
  top: 150rpx;
  margin-left: 30rpx;
  width: 602rpx;
  height: 321rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/helly_hansen_ocean/content.png") top center no-repeat;
  background-size: 100% 100%;

}

.btn-container {
  position: absolute;
  bottom: 50rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  // background-color: pink;
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btn-home {
    float: left;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/helly_hansen_ocean/btn-home.png") top center no-repeat;
    background-size: 100% 100%;
    width: 125rpx;
    height: 24rpx;
  }
}

</style>