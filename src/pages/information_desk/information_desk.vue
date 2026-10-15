
<script setup lang="ts">
import { ref } from 'vue';
import { useSystemStore } from '@/stores'

const mySystem = useSystemStore(); // 主要用于切换语言

function navitateToMP() {
  console.log("跳转到视频号页面")
  // #ifdef MP-WEIXIN
  wx.openChannelsActivity({
    finderUserName: 'sphnLFrbJzXJyxq',
    feedId: 'export/UzFfBgAAxNCvGBIoaHClk8zT4DCajqHsr7VMX2ogmensFHebIw',
    success(res) {
      console.log('文章打开成功', res)
    },
    fail(err) {
      console.log('文章打开失败', err)
      // uni.showToast({
      //   title: '文章打开失败',
      //   icon: 'none'
      // })
    }
  })
  // #endif
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
  <image v-if="mySystem.system_config.language=='en'" 
    class="page-bg"
    src="https://www.mbcstyle.cn/projects/static/audi2026wuhan/information_desk/bg.jpg"
    mode="widthFix"
  />
  <image v-else
    class="page-bg"
    src="https://www.mbcstyle.cn/projects/static/audi2026wuhan/information_desk/bg-cn.jpg"
    mode="widthFix"
  />
  <view class="top-container">
    <!-- 标题 -->
      <view class="language" @tap="switchLanguage"></view>
  </view>

  <view v-if="mySystem.system_config.language=='en'" class="index-content"></view>
  <view v-else class="index-content-cn"></view>

  <!-- 视频号跳转 -->
  <view v-if="mySystem.system_config.language=='en'" class="navigate-to-mp" @tap="navitateToMP"></view>
  <view v-else class="navigate-to-mp-cn" @tap="navitateToMP"></view>

  <!-- 游戏规则 -->
  <view v-if="mySystem.system_config.language=='en'" class="gift-ruler" ></view>
  <view v-else class="gift-ruler-cn"></view>

  <!-- 资讯 -->
  <!-- <view v-if="mySystem.system_config.language=='en'" class="tips" ></view>
  <view v-else class="tips-cn" ></view> -->

  <!-- 底部按钮栏 -->
  <view v-if="mySystem.system_config.language=='en'" class="btn-container">
    <view class="btn-home" @tap="navitateToHome"></view>
  </view>
  <view v-else class="btn-container-cn">
    <view class="btn-home-cn" @tap="navitateToHome"></view>
  </view>

</template>

<style lang="scss">
page {
  background-color: black;
  width: 100%;
  min-height: 100vh;
  padding: 0;
  overflow: visible;
}
// 绝对定位的长背景图
.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: -1;
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
  width: 592rpx;
  height: 232rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/information_desk/title.png") top center no-repeat;
  background-size: 100% 100%;
}
.index-content-cn {
  position: absolute;
  top: 100rpx;
  margin-left: 30rpx;
  width: 592rpx;
  height: 213rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/information_desk/标题.png") top center no-repeat;
  background-size: 100% 100%;
}

.navigate-to-mp {
  position: absolute;
  top: 828rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 337rpx;
  height: 80rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/information_desk/btn-sph.png") top center no-repeat;
  background-size: 100% 100%;
}
.navigate-to-mp-cn {
  position: absolute;
  top: 828rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 203rpx;
  height: 80rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/information_desk/按钮-跳转视频号.png") top center no-repeat;
  background-size: 100% 100%;
}

.gift-ruler {
  position: absolute;
  top: 1558rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 638rpx;
  height: 1698rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/information_desk/rules.png") top center no-repeat;
  background-size: 100% 100%;
}
.gift-ruler-cn {
  position: absolute;
  top: 1558rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 546rpx;
  height: 1392rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/information_desk/规则.png") top center no-repeat;
  background-size: 100% 100%;
}

// .tips {
//   position: absolute;
//   top: 2658rpx;
//   left: 130rpx;
//   width: 359rpx;
//   height: 284rpx;
//   background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/information_desk/qrcode.png") top center no-repeat;
//   background-size: 100% 100%;
// }
// .tips-cn {
//   position: absolute;
//   top: 2358rpx;
//   left: 130rpx;
//   width: 192rpx;
//   height: 258rpx;
//   background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/information_desk/太阳码.png") top center no-repeat;
//   background-size: 100% 100%;
// }

.btn-container {
  position: absolute;
  top: 3529rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  // background-color: pink;
  width: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .btn-home {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_index/btn-home.png") top center no-repeat;
    background-size: 100% 100%;
    width: 85rpx;
    height: 24rpx;
  }
}
// .btn-container {
//   position: fixed;
//   bottom: 0;
//   left: 50%;
//   transform: translateX(-50%);

//   width: 90%;
//   padding-top: 70rpx;
//   padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
//   box-sizing: border-box;

//   display: flex;
//   justify-content: flex-start;
//   align-items: center;

//   z-index: 100;

//   // 底部黑色渐变遮罩
//   &::before {
//     content: "";
//     position: absolute;

//     // 遮罩左右铺满整个屏幕
//     left: -50vw;
//     right: -50vw;

//     // 增加渐变高度，让上方过渡更自然
//     top: -60rpx;
//     bottom: 0;

//     // 从透明、柔和变暗，到底部适度变暗
//     background: linear-gradient(
//       to bottom,
//       rgba(0, 0, 0, 0) 0%,
//       rgba(0, 0, 0, 0.02) 15%,
//       rgba(0, 0, 0, 0.3) 35%,
//       rgba(0, 0, 0, 0.5) 60%,
//       rgba(0, 0, 0, 0.9) 80%,
//       rgba(0, 0, 0, 1) 100%
//     );

//     pointer-events: none;
//     z-index: -1;
//   }

//   .btn-home {
//     position: relative;
//     background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_index/btn-home.png") top center no-repeat;
//     background-size: 100% 100%;
//     width: 85rpx;
//     height: 24rpx;
//   }
// }
.btn-container-cn {
  position: absolute;
  top: 3239rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  // background-color: pink;
  width: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .btn-home-cn {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/music_lab_index/主页按钮.png") top center no-repeat;
    background-size: 100% 100%;
    width: 61rpx;
    height: 30rpx;
  }
}
// .btn-container-cn {
//   position: fixed;
//   bottom: 0;
//   left: 50%;
//   transform: translateX(-50%);

//   width: 90%;
//   padding-top: 70rpx;
//   padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
//   box-sizing: border-box;

//   display: flex;
//   justify-content: flex-start;
//   align-items: center;

//   z-index: 100;

//   // 底部黑色渐变遮罩
//   &::before {
//     content: "";
//     position: absolute;

//     // 遮罩左右铺满整个屏幕
//     left: -50vw;
//     right: -50vw;

//     // 增加渐变高度，让上方过渡更自然
//     top: -100rpx;
//     bottom: 0;

//     // 从透明、柔和变暗，到底部适度变暗
//     background: linear-gradient(
//       to bottom,
//       rgba(0, 0, 0, 0) 0%,
//       rgba(0, 0, 0, 0.02) 15%,
//       rgba(0, 0, 0, 0.08) 35%,
//       rgba(0, 0, 0, 0.20) 60%,
//       rgba(0, 0, 0, 0.38) 80%,
//       rgba(0, 0, 0, 0.55) 100%
//     );

//     pointer-events: none;
//     z-index: -1;
//   }

//   .btn-home-cn {
//     position: relative;
//     background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/music_lab_index/主页按钮.png") top center no-repeat;
//     background-size: 100% 100%;
//     width: 61rpx;
//     height: 30rpx;
//   }
// }

</style>