<script setup lang="ts">
import { ref } from 'vue';


function navitateToMP() {
  console.log("跳转到其它小程序页面")
}

function navitateToHome() {
  console.log("跳转到地图页面")
  // uni.reLaunch({url: "/pages/map/map"});
  uni.navigateBack({delta: 1});
}

function navigateToMyScore() {
  console.log("跳转到网球详情页面")
  uni.navigateTo({url: "/pages/tennis_detail/tennis_detail"});
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
    <view class="btn-my-score" @tap="navigateToMyScore"></view>
  </view>

</template>

<style lang="scss">
page {
  background-color: black;
  width: 100vw;
  height: 100vh;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_index/bg.jpg") top center no-repeat;
  background-size: cover;
  overflow: hidden;
  padding-top: 100rpx;
}
// 顶部Bar
.top-container {
  position: absolute;
  top: 20rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  // background-color: pink;
  width: 90%;

  .language {
    float: right;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-language.png") top center no-repeat;
    background-size: 100% 100%;
    width: 60rpx;
    height: 60rpx;
  }
}

.index-content {
  position: absolute;
  top: 100rpx;
  margin-left: 30rpx;
  width: 665rpx;
  height: 332rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_index/content.png") top center no-repeat;
  background-size: 100% 100%;

}

.btn-container {
  position: absolute;
  bottom: 80rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  // background-color: pink;
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btn-home {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_index/btn-home.png") top center no-repeat;
    background-size: 100% 100%;
    width: 100rpx;
    height: 24rpx;
  }
  .btn-my-score {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_index/btn-my-score.png") top center no-repeat;
    background-size: 100% 100%;
    width: 161rpx;
    height: 31rpx;
  }
}

</style>