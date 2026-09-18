<!-- 与订单详情合并了 -->
<!-- 门禁（参与的）详情 -->

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

function navitateToMyMusic() {
  console.log("跳转到音乐详情页面")
  uni.navigateTo({url: "/pages/music_lab_detail/music_lab_detail"});
}



</script>

<template>
  <view class="top-container">
    <!-- 标题 -->
      <view class="language"></view>
  </view>
  <!-- Audi Vision内容介绍 -->
  <view class="index-content"></view>

  <!-- 小程序跳转 -->
  <view class="navigate-to-mp" @tap="navitateToMP"></view>

  <!-- 底部按钮栏 -->
  <view class="btn-container">
    <view class="btn-home" @tap="navitateToHome"></view>
    <view class="btn-my-music" @tap="navitateToMyMusic"></view>
  </view>

</template>

<style lang="scss">
page {
  background-color: black;
  width: 100vw;
  height: 100vh;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_index/bg.jpg") top center no-repeat;
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
  top: 150rpx;
  margin-left: 30rpx;
  width: 711rpx;
  height: 290rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_index/content.png") top center no-repeat;
  background-size: 100% 100%;

}

.navigate-to-mp {
  position: absolute;
  top: 1100rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 329rpx;
  height: 80rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_index/navigate-to-mp.png") top center no-repeat;
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
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_index/btn-home.png") top center no-repeat;
    background-size: 100% 100%;
    width: 125rpx;
    height: 24rpx;
  }
  .btn-my-music {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_index/btn-my-music.png") top center no-repeat;
    background-size: 100% 100%;
    width: 209rpx;
    height: 31rpx;
  }
}

</style>