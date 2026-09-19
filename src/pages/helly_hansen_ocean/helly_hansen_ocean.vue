<script setup lang="ts">
import { ref } from 'vue';
import { getAreaCheckAPI } from '@/services/login'
import { onLoad } from '@dcloudio/uni-app'
import { useMyStore, useSystemStore } from '@/stores'

// 持久化存储
const myStore = useMyStore();
const mySystem = useSystemStore(); // 主要用于切换语言

const areaCheck = async (open_id: string) => {
  const res = await getAreaCheckAPI({open_id, area: "helly_hansen"})
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
onLoad(() => {
  const open_id = myStore.profile?.open_id || ""
  if (!open_id) {
    console.log("没有获取到 open_id")
    uni.reLaunch({url: "/pages/index/index"});
    return;
  }
  areaCheck(open_id);
})


function navitateToHome() {
  console.log("跳转到地图页面")
  // uni.reLaunch({url: "/pages/map/map"});
  uni.navigateBack({delta: 1});
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
  width: 642rpx;
  height: 317rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/helly_hansen_ocean/content.png") top center no-repeat;
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
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/helly_hansen_ocean/btn-home.png") top center no-repeat;
    background-size: 100% 100%;
    width: 100rpx;
    height: 24rpx;
  }
}

</style>