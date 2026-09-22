<!-- 与订单详情合并了 -->
<!-- 门禁（参与的）详情 -->

<script setup lang="ts">
import { ref } from 'vue';
import { useSystemStore } from '@/stores'

const mySystem = useSystemStore(); // 主要用于切换语言

function switchLanguage() {
  console.log("切换语言");
  mySystem.switchLanguage();
}

function navitateToHome() {
  console.log("跳转到地图页面")
  // uni.reLaunch({url: "/pages/map/map"});
  uni.navigateBack({delta: 1});
}

function navitateToMyPhoto() {
  console.log("跳转到拍照详情页面")
  uni.navigateTo({url: "/pages/audi_vision_detail/audi_vision_detail"});
}



</script>

<template>
  <view class="top-container">
    <!-- 标题 -->
      <view class="language" @tap="switchLanguage"></view>
  </view>
  <!-- Audi Vision内容介绍 -->
  <view v-if="mySystem.system_config.language=='en'" class="index-content"></view>
  <view v-else class="index-content-cn"></view>

  <!-- 底部按钮栏 -->
  <view class="btn-container">
    <view v-if="mySystem.system_config.language=='en'" class="btn-home" @tap="navitateToHome"></view>
    <view v-else class="btn-home-cn" @tap="navitateToHome"></view>
    <view v-if="mySystem.system_config.language=='en'" class="btn-my-photo" @tap="navitateToMyPhoto"></view>
    <view v-else class="btn-my-photo-cn" @tap="navitateToMyPhoto"></view>
  </view>

</template>

<style lang="scss">
page {
  background-color: black;
  width: 100vw;
  height: 100vh;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_index/bg.jpg") top center no-repeat;
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
  width: 661rpx;
  height: 247rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_index/content.png") top center no-repeat;
  background-size: 100% 100%;
}
.index-content-cn {
  position: absolute;
  top: 100rpx;
  margin-left: 30rpx;
  width: 572rpx;
  height: 250rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/audi_vision_index/文案介绍.png") top center no-repeat;
  background-size: 100% 100%;
}

.photo-container {
  position: absolute;
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
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_index/btn-home.png") top center no-repeat;
    background-size: 100% 100%;
    width: 85rpx;
    height: 24rpx;
  }
  .btn-home-cn {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/audi_vision_index/主页按钮.png") top center no-repeat;
    background-size: 100% 100%;
    width: 61rpx;
    height: 30rpx;
  }
  .btn-my-photo {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_index/btn-my-photo.png") top center no-repeat;
    background-size: 100% 100%;
    width: 136rpx;
    height: 32rpx;
  }
  .btn-my-photo-cn {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/audi_vision_index/我的照片按钮.png") top center no-repeat;
    background-size: 100% 100%;
    width: 124rpx;
    height: 30rpx;
  }
}

</style>