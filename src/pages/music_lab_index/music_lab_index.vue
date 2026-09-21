<!-- 与订单详情合并了 -->
<!-- 门禁（参与的）详情 -->

<script setup lang="ts">
import { ref } from 'vue';
import { useSystemStore } from '@/stores'

const mySystem = useSystemStore(); // 主要用于切换语言

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

function switchLanguage() {
  console.log("切换语言");
  mySystem.switchLanguage();
}

</script>

<template>
  <view class="top-container">
    <!-- 标题 -->
      <view class="language" @tap="switchLanguage"></view>
  </view>

  <view v-if="mySystem.system_config.language=='en'" class="index-content"></view>
  <view v-else class="index-content-cn"></view>

  <!-- 小程序跳转 -->
  <view v-if="mySystem.system_config.language=='en'" class="navigate-to-mp" @tap="navitateToMP"></view>
  <view v-else class="navigate-to-mp-cn" @tap="navitateToMP"></view>

  <!-- 底部按钮栏 -->
  <view v-if="mySystem.system_config.language=='en'" class="btn-container">
    <view class="btn-home" @tap="navitateToHome"></view>
    <view class="btn-my-music" @tap="navitateToMyMusic"></view>
  </view>
  <view v-else class="btn-container-cn">
    <view class="btn-home-cn" @tap="navitateToHome"></view>
    <view class="btn-my-music-cn" @tap="navitateToMyMusic"></view>
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
  top: 100rpx;
  margin-left: 30rpx;
  width: 662rpx;
  height: 274rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_index/content.png") top center no-repeat;
  background-size: 100% 100%;
}
.index-content-cn {
  position: absolute;
  top: 100rpx;
  margin-left: 30rpx;
  width: 662rpx;
  height: 274rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/music_lab_index/标题.png") top center no-repeat;
  background-size: 100% 100%;
}

.navigate-to-mp {
  position: absolute;
  top: 1100rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 275rpx;
  height: 80rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_index/navigate-to-mp.png") top center no-repeat;
  background-size: 100% 100%;
}
.navigate-to-mp-cn {
  position: absolute;
  top: 1100rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 206rpx;
  height: 80rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/music_lab_index/探索其它按钮.png") top center no-repeat;
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
    width: 85rpx;
    height: 24rpx;
  }
  .btn-my-music {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_index/btn-my-music.png") top center no-repeat;
    background-size: 100% 100%;
    width: 136rpx;
    height: 31rpx;
  }
}
.btn-container-cn {
  position: absolute;
  bottom: 80rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  // background-color: pink;
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .btn-home-cn {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/music_lab_index/主页按钮.png") top center no-repeat;
    background-size: 100% 100%;
    width: 71rpx;
    height: 33rpx;
  }
  .btn-my-music-cn {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/music_lab_index/我的音乐按钮.png") top center no-repeat;
    background-size: 100% 100%;
    width: 151rpx;
    height: 33rpx;
  }
}

</style>