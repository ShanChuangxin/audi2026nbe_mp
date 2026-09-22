<script setup lang="ts">
import { ref } from 'vue';
import { useSystemStore } from '@/stores'


const mySystem = useSystemStore(); // 主要用于切换语言

function navitateToHome() {
  console.log("跳转到地图页面")
  // uni.reLaunch({url: "/pages/map/map"});
  uni.navigateBack({delta: 1});
}

function navigateToLeaderboard() {
  console.log("跳转到模拟赛车详情页面")
  uni.navigateTo({url: "/pages/car_detail/car_detail"});
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

  <!-- 底部按钮栏 -->
  <view class="btn-container">
    <view v-if="mySystem.system_config.language=='en'" class="en-container">
      <view class="btn-home" @tap="navitateToHome"></view>
      <view class="btn-leaderboard" @tap="navigateToLeaderboard"></view>
    </view>
    <view v-else class="cn-container">
      <view class="btn-home-cn" @tap="navitateToHome"></view>
      <view class="btn-leaderboard-cn" @tap="navigateToLeaderboard"></view>
    </view>
  </view>

</template>

<style lang="scss">
page {
  background-color: black;
  width: 100vw;
  height: 100vh;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/car_index/bg.jpg") top center no-repeat;
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
  width: 666rpx;
  height: 247rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/car_index/content.png") top center no-repeat;
  background-size: 100% 100%;
}
.index-content-cn {
  position: absolute;
  top: 100rpx;
  margin-left: 30rpx;
  width: 572rpx;
  height: 256rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/car_index/标题.png") top center no-repeat;
  background-size: 100% 100%;
}

.btn-container {
  position: absolute;
  bottom: 80rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  // background-color: pink;
  width: 90%;
  .en-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn-home {
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/car_index/btn-home.png") top center no-repeat;
      background-size: 100% 100%;
      width: 85rpx;
      height: 24rpx;
    }
    .btn-leaderboard {
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/car_index/btn-leaderboard.png") top center no-repeat;
      background-size: 100% 100%;
      width: 183rpx;
      height: 25rpx;
    }
  }
  .cn-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn-home-cn {
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/car_index/主页按钮.png") top center no-repeat;
      background-size: 100% 100%;
      width: 61rpx;
      height: 30rpx;
    }
    .btn-leaderboard-cn {
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/car_index/排行榜按钮.png") top center no-repeat;
      background-size: 100% 100%;
      width: 93rpx;
      height: 30rpx;
    }
  }

  
}

</style>