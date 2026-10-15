<script setup lang="ts">
import { ref } from 'vue';
import { getAreaCheckAPI } from '@/services/login'
import { useMyStore, useSystemStore } from '@/stores'

// 显示隐私条款
const showPrivacy = ref(true);  // false为不显示弹窗；true为显示弹窗

// 持久化存储
const myStore = useMyStore();
const mySystem = useSystemStore(); // 主要用于切换语言

const areaCheck = async (open_id: string) => {
  const res = await getAreaCheckAPI({open_id, area: "cinema"})
  console.log("打卡的结果为：", res)
  if (0 == res.errcode) {
    myStore.setProfile(res.data.user_info);
    console.log("打完卡后，更新用户信息成功");
  } else {
    uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~",
      duration: 1000
    });
  }
}

// 关闭隐私条款弹窗
function closePopWindow(){
  console.log("关闭隐私条款弹窗");
  showPrivacy.value = false;
  const open_id = myStore.profile?.open_id || ""
  if (!open_id) {
    console.log("没有获取到 open_id")
    uni.reLaunch({url: "/pages/index/index"});
    return;
  }
  areaCheck(open_id);
}

function navitateToHome() {
  console.log("跳转到地图页面")
  // uni.reLaunch({url: "/pages/map/map"});
  uni.navigateBack({delta: 1});
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
    <view v-if="mySystem.system_config.language=='en'" class="btn-home" @tap="navitateToHome"></view>
    <view v-else class="btn-home-cn" @tap="navitateToHome"></view>
  </view>

  <!-- 隐私条款弹窗 -->
  <!-- <view class="privacy-container" v-if="showPrivacy" @touchmove.stop.prevent=""> -->
  <view class="privacy-container" v-if="showPrivacy">
      <view class="pop-window">
        <view class="text-content">
          <scroll-view class="scroll" enhanced scroll-y>
            <view class="privacy-content"></view>
          </scroll-view>
        </view>
        
        <view class="btn-agree" @tap="closePopWindow">
        </view> 
      </view>
  </view>

</template>

<style lang="scss">
page {
  background-color: black;
  width: 100vw;
  height: 100vh;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/cinema/bg.jpg") top center no-repeat;
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
  height: 287rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/cinema/content.png") top center no-repeat;
  background-size: 100% 100%;
}
.index-content-cn {
  position: absolute;
  top: 100rpx;
  margin-left: 30rpx;
  width: 572rpx;
  height: 250rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/cinema/标题.png") top center no-repeat;
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
  justify-content: flex-start;
  align-items: center;

  .btn-home {
    // float: left;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cinema/btn-home.png") top center no-repeat;
    background-size: 100% 100%;
    width: 85rpx;
    height: 24rpx;
  }
  .btn-home-cn {
    // float: left;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/cinema/主页按钮.png") top center no-repeat;
    background-size: 100% 100%;
    width: 61rpx;
    height: 30rpx;
  }
}

// 隐私条款弹窗
.privacy-container {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: black;
  // opacity: .5;
  background-color: rgba(0, 0, 0, .5);

  // 模糊后面的地图
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  .pop-window {
    transform: translateY(-3vh);
    position: relative;
    width: 610rpx;
    height: 1202rpx;
    // background-color: pink;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/cinema/privacy-bg.png") top center no-repeat;
    background-size: 100% 100%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .text-content {
      width: 600rpx;
      height: 1000rpx;
      //
      margin: 10rpx auto 120rpx;
      overflow: hidden;
      .scroll {
        width: 600rpx;
        height: 960rpx;
        // 
        // padding-bottom: 150rpx;
        // height: 100%;
        // display: flex;
        // justify-content: center;
        .privacy-content {
          margin: 0 auto 150rpx;
          width: 506rpx;
          height: 5252rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/cinema/privacy.png") top center no-repeat;
          background-size: 100% 100%;
        }
      }
    }

    .btn-agree {
      position: absolute;
      bottom: 50rpx;
      width: 485rpx;
      height: 110rpx;
      background: url("https://www.mbcstyle.cn/projects/static/audi2026wuhan/cinema/btn-agree-privacy.png") top center no-repeat;
      background-size: 100% 100%;
    }
  }
}

</style>