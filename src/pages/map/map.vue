<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useMeetingRoomList } from '@/composables'
import { useMyStore, useSystemStore } from '@/stores'
import type { UserInfoType } from '@/types/user_info'
import { getOpenIdAPI, getUserInfoAPI } from '@/services/login'

//@ts-ignore
import UQRCode from "uqrcodejs"; // ts忽略了类型校验
// 生成二维码
async function loadQrCode(codeValue: string, retryCount = 0) {
  if (!codeValue) {
    console.log("没有获取到用户的id，返回到登录页面");
    uni.navigateTo({
      url: "/pages/index/index"
    });
    return;
  }
  console.log(`开始生成二维码，第 ${retryCount + 1} 次`);
  try {
    // 等待页面和 Canvas 准备完成
    await nextTick();
    // 再稍微等待一下，给小程序 Canvas 初始化时间
    await new Promise(resolve => setTimeout(resolve, 200));
    const qr = new UQRCode();
    // 设置二维码内容
    qr.data = codeValue;
    // 二维码大小
    qr.size = 240;
    // 生成二维码
    qr.make();
    // 获取 Canvas 上下文
    const canvasContext = uni.createCanvasContext("qrcode");
    // 设置 Canvas 上下文
    qr.canvasContext = canvasContext;
    // 绘制二维码
    qr.drawCanvas();
    // 等待 Canvas 绘制
    await new Promise(resolve => setTimeout(resolve, 300));
    // 转成临时图片
    uni.canvasToTempFilePath({
      canvasId: "qrcode",
      success: (res) => {
        console.log("二维码图片生成成功");
        console.log("二维码图片地址：", res.tempFilePath);
        if (res.tempFilePath) {
          qrCodeImage.value = res.tempFilePath;
        } else {
          console.log("二维码图片地址为空");
          retryQrCode(codeValue, retryCount);
        }
      },
      fail: (err) => {
        console.log("二维码图片生成失败：", err);
        retryQrCode(codeValue, retryCount);
      }
    });
  } catch (error) {
    console.log("二维码生成异常：", error);
    retryQrCode(codeValue, retryCount);
  }
}
function retryQrCode(codeValue: string, retryCount: number) {
  if (retryCount >= 2) {
    console.log("二维码生成失败，已经达到最大重试次数");
    return;
  }
  console.log(`准备重新生成二维码，第 ${retryCount + 2} 次`);
  setTimeout(() => {
    loadQrCode(codeValue, retryCount + 1);
  }, 500);
}

// 页面加载
onLoad(async () => {
  const openId = myStore.profile?.open_id || "";
  if (!openId) {
    console.log("没有获取到 open_id");
    uni.navigateTo({
      url: "/pages/index/index"
    });
    return;
  }
  console.log("获取到 open_id：", openId);
  await nextTick();
  loadQrCode(openId);
});

const getUserInfoFunc = async (open_id: string) => {
  const res = await getUserInfoAPI({open_id, city: "beijing", is_register: false})
  console.log("同步用户信息的结果为：", res)
  if (0 == res.errcode) {
    myStore.setProfile(res.data.user_info);
    console.log("更新用户信息成功");
  } else {
    console.log("网络不佳，请稍后再试");
    // uni.showToast({
    //   icon: 'none',
    //   title: "网络不佳，请稍后重试~",
    //   duration: 1000
    // });
  }
}
onShow(() => {
  const open_id = myStore.profile?.open_id || ""
  if (!open_id) {
    console.log("没有获取到 open_id")
    uni.navigateTo({url: "/pages/index/index"});
    return;
  }
  getUserInfoFunc(open_id);
})

// 持久化存储
const myStore = useMyStore();
const mySystem = useSystemStore(); // 主要用于切换语言

// 获取页面参数
// 页面参数通过defineProps来定义
// 注意是把多个不同情况下传的不同参数取并集，且是可选的
const query = defineProps<{
  scene: string // scene是获取小程序码中官方指定的唯一参数scene，需要解码出需要的参数
}>();

// 二维码弹窗
const showQrcode = ref(false);
// 二维码图片
const qrCodeImage = ref("")
function openQrCode() {
    console.log("打开二维码弹窗");
    showQrcode.value = true;
}
function closeQrCode() {
    console.log("关闭二维码弹窗");
    showQrcode.value = false;
}

// 解析scene参数中的值
function parseScene(scene: string): Record<string, string> {
  const params: Record<string, string> = {}; // 明确指定类型
  scene.split("&").forEach(item => {
    const [key, value] = item.split("=");
    if (key && value) {
      params[key] = value;
    }
  });
  return params;
}

function switchLanguage() {
  console.log("切换语言");
  mySystem.switchLanguage();
}

function navigateToHistoryCapsule() {
  console.log("跳转到拍照互动页面")
  uni.navigateTo({url: "/pages/audi_vision_index/audi_vision_index"});
}
function navigateToVisionLab() {
  console.log("跳转到影院页面")
  uni.navigateTo({url: "/pages/cinema/cinema"});
}

function navigateToHellyHansen() {
  console.log("跳转到划船页面")
  uni.navigateTo({url: "/pages/helly_hansen_ocean/helly_hansen_ocean"});
}

function navigateToTerrainChallenge() {
  console.log("跳转到赛车互动页面")
  uni.navigateTo({url: "/pages/car_index/car_index"});
}

function navigateToTennisChallenge() {
  console.log("跳转到网球互动页面")
  uni.navigateTo({url: "/pages/tennis_index/tennis_index"});
}

function navigateToMusicRemix() {
  console.log("跳转到音乐互动页面")
  uni.navigateTo({url: "/pages/music_lab_index/music_lab_index"});
}

// 跳转到我的账户
function navigateToMyPage() {
  // 把填写的信息以参数形式传到列表页面
  console.log("跳转到账户页面")
  // uni.navigateTo({ url: `/pages/office_list/office_list?num_type=${peopleNum.value}&table_type=${selectedTableType.value}&city_type=${selectedCityType.value}&purpose_type=${selectedPurposeType.value}` })
  uni.navigateTo({url: "/pages/profile/profile"});

}

</script>

<template>
  <view class="page-container">
    <view class="body-view">
      <!-- 顶部 -->
      <view class="top-container">
        <!-- 标题 -->
         <!-- <view class="map-text"></view> -->
         <view class="language" @tap="switchLanguage"></view>
      </view>

      <!-- 地图容器 -->
      <view class="map-container">
        <!-- 静态不可点击的按钮 -->
        <view v-if="mySystem.system_config.language=='en'" class="static-information-desk"></view>
        <view v-else class="static-information-desk-cn"></view>
        <view v-if="mySystem.system_config.language=='en'" class="static-vibe-lounge"></view>
        <view v-else class="static-vibe-lounge-cn"></view>
        <view v-if="mySystem.system_config.language=='en'" class="static-social-hub"></view>
        <view v-else class="static-social-hub-cn"></view>
        <view v-if="mySystem.system_config.language=='en'" class="static-icon-stage"></view>
        <view v-else class="static-icon-stage-cn"></view>
        <view class="walk-in"></view>
        <view class="walk-out"></view>
        <!-- 拍照互动 -->
         <view class="history-capsule-container" @tap="navigateToHistoryCapsule">
          <view class="line-history-capsule"></view>
          <!-- <view  v-if="myStore.profile?.photo_time == 0" class="btn-history-capsule"></view>
          <view v-else class="btn-history-capsule-exp"></view> -->
          <view v-if="mySystem.system_config.language=='en'" class="btn-history-capsule"></view>
          <view v-else class="btn-history-capsule-cn"></view>
         </view>
         <!-- 4D影院 -->
         <view class="vision-lab-container" @tap="navigateToVisionLab">
          <view class="line-vision-lab"></view>
          <!-- <view v-if="myStore.profile?.cinema_time == 0" class="btn-vision-lab"></view>
          <view v-else class="btn-vision-lab-exp"></view> -->
          <view v-if="mySystem.system_config.language=='en'" class="btn-vision-lab"></view>
          <view v-else class="btn-vision-lab-cn"></view>
         </view>
         <!-- Helly Hansen划船区域 -->
         <view class="helly-hansen-container" @tap="navigateToHellyHansen">
          <view class="line-helly-hansen"></view>
          <!-- <view v-if="myStore.profile?.helly_hansen_time == 0" class="btn-helly-hansen"></view>
          <view v-else class="btn-helly-hansen-exp"></view> -->
          <view v-if="mySystem.system_config.language=='en'" class="btn-helly-hansen"></view>
          <view v-else class="btn-helly-hansen-cn"></view>
         </view>
         <!-- 赛车区域 -->
         <view class="terrain-challenge-container" @tap="navigateToTerrainChallenge">
          <view class="line-terrain-challenge"></view>
          <!-- <view v-if="myStore.profile?.latest_car_time == 0" class="btn-terrain-challenge"></view>
          <view v-else class="btn-terrain-challenge-exp"></view> -->
          <view v-if="mySystem.system_config.language=='en'" class="btn-terrain-challenge"></view>
          <view v-else class="btn-terrain-challenge-cn"></view>
         </view>
         <!-- 网球区域 -->
         <view class="tennis-challenge-container" @tap="navigateToTennisChallenge">
          <view class="line-tennis-challenge"></view>
          <!-- <view v-if="myStore.profile?.latest_tennis_time == 0" class="btn-tennis-challenge"></view>
          <view v-else class="btn-tennis-challenge-exp"></view> -->
          <view v-if="mySystem.system_config.language=='en'" class="btn-tennis-challenge"></view>
          <view v-else class="btn-tennis-challenge-cn"></view>
         </view>
         <!-- 音乐区域 -->
         <view class="music-remix-container" @tap="navigateToMusicRemix">
          <view class="line-music-remix"></view>
          <!-- <view v-if="myStore.profile?.music_time == 0" class="btn-music-remix"></view>
          <view v-else class="btn-music-remix-exp"></view> -->
          <view v-if="mySystem.system_config.language=='en'" class="btn-music-remix"></view>
          <view v-else class="btn-music-remix-cn"></view>
         </view>
       </view>

      <!-- 底部按钮栏 -->
      <view class="btn-container">
        <view class="qrcode-icon" @tap="openQrCode"></view>
        <view class="my-account" @tap="navigateToMyPage"></view>
      </view>
    </view>

    <!-- 隐藏的 Canvas，只负责生成二维码 -->
    <canvas
      id="qrcode"
      canvas-id="qrcode"
      class="qrcode-canvas"
    ></canvas>

    <!-- 二维码弹窗 -->
    <view class="pop-window" v-if="showQrcode" @tap="closeQrCode">
        <!-- 二维码容器 -->
        <view class="qrcode-container" @tap.stop>
          <!-- <canvas id="qrcode" canvas-id="qrcode" class="qrcode-style"></canvas> -->
          <!-- 生成好的二维码图片 -->
          <view class="qr-bg">
            <image v-if="qrCodeImage" :src="qrCodeImage" class="qrcode-style" mode="aspectFit"/>
          </view>
          <view class="text-container">
            <view class="proflie_text">User ID: {{ myStore.profile?.user_id }}</view>
            <view class="proflie_text">Name: {{ myStore.profile?.nick_name }}</view>
          </view>
        </view>
    </view>
  </view>

</template>

<style lang="scss">

.page-container {
  .body-view {
    // background-color: #f6f6f6; 
    // background-color: skyblue;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/bg.jpg") top center no-repeat;
    background-size: 100% 100%;
    width: 100vw;
    height: 100vh;
    // 顶部Bar
    .top-container {
      position: absolute;
      top: 20rpx;
      margin-left: 50%;
      transform: translateX(-50%);
      // background-color: pink;
      width: 90%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .map-text {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/text-map.png") top center no-repeat;
        background-size: 100% 100%;
        width: 71rpx;
        height: 21rpx;
      }
      .language {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-language.png") top center no-repeat;
        background-size: 100% 100%;
        width: 60rpx;
        height: 60rpx;
      }
    }

    // 地图容器
    .map-container {
      position: absolute;
      top: 150rpx;
      margin-left: 50%;
      transform: translateX(-50%);
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/map.png") top center no-repeat;
      background-size: 100% 100%;
      width: 749rpx;
      height: 933rpx;
      .static-information-desk{
        position: absolute;
        top: -60rpx;
        left: 35rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/static-information-desk.png") top center no-repeat;
        background-size: 100% 100%;
        width: 210rpx;
        height: 140rpx;
      }
      .static-information-desk-cn{
        position: absolute;
        top: -60rpx;
        left: 88rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/map/静态按钮-信息台.png") top center no-repeat;
        background-size: 100% 100%;
        width: 92rpx;
        height: 140rpx;
      }
      .static-vibe-lounge{
        position: absolute;
        top: 299rpx;
        left: 110rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/static-vibe-lounge.png") top center no-repeat;
        background-size: 100% 100%;
        width: 284rpx;
        height: 40rpx;
      }
      .static-vibe-lounge-cn{
        position: absolute;
        top: 299rpx;
        left: 110rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/map/静态按钮-悦享客厅.png") top center no-repeat;
        background-size: 100% 100%;
        width: 236rpx;
        height: 40rpx;
      }
      .static-social-hub{
        position: absolute;
        top: 560rpx;
        left: 145rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/static-social-hub.png") top center no-repeat;
        background-size: 100% 100%;
        width: 255rpx;
        height: 40rpx;
      }
      .static-social-hub-cn{
        position: absolute;
        top: 560rpx;
        left: 175rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/map/静态按钮-聚享空间.png") top center no-repeat;
        background-size: 100% 100%;
        width: 222rpx;
        height: 40rpx;
      }
      .static-icon-stage{
        position: absolute;
        bottom: 40rpx;
        left: 35rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/static-icon-stage.png") top center no-repeat;
        background-size: 100% 100%;
        width: 196rpx;
        height: 145rpx;
      }
      .static-icon-stage-cn{
        position: absolute;
        bottom: 40rpx;
        left: 35rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/map/静态按钮-高光舞台.png") top center no-repeat;
        background-size: 100% 100%;
        width: 164rpx;
        height: 145rpx;
      }
      .walk-in{
        position: absolute;
        top: 0rpx;
        left: 220rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/tip-direction.png") top center no-repeat;
        background-size: 100% 100%;
        width: 42rpx;
        height: 103rpx;
      }
      .walk-out{
        position: absolute;
        bottom: 30rpx;
        right: 240rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/tip-direction.png") top center no-repeat;
        background-size: 100% 100%;
        width: 42rpx;
        height: 103rpx;
      }

      .history-capsule-container {
        position: absolute;
        top: -20rpx;
        right: 100rpx;
        background-color: pink;
        .line-history-capsule{
          position: absolute;
          top: -20rpx;
          right: 150rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/line-history-capsule.png") top center no-repeat;
          background-size: 100% 100%;
          width: 6rpx;
          height: 173rpx;
        }
        .btn-history-capsule{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-history-capsule.png") top center no-repeat;
          background-size: 100% 100%;
          width: 243rpx;
          height: 40rpx;
        }
        .btn-history-capsule-cn{
          position: absolute;
          bottom: 0rpx;
          right: 70rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/map/按钮-历史胶囊.png") top center no-repeat;
          background-size: 100% 100%;
          width: 162rpx;
          height: 40rpx;
        }
        .btn-history-capsule-exp{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-history-capsule-exp.png") top center no-repeat;
          background-size: 100% 100%;
          width: 243rpx;
          height: 40rpx;
        }
      }
      .vision-lab-container {
        position: absolute;
        top: 290rpx;
        right: 240rpx;
        background-color: pink;
        .line-vision-lab{
          position: absolute;
          top: -20rpx;
          right: 60rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/line-vision-lab.png") top center no-repeat;
          background-size: 100% 100%;
          width: 6rpx;
          height: 97rpx;
        }
        .btn-vision-lab{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-vision-lab.png") top center no-repeat;
          background-size: 100% 100%;
          width: 190rpx;
          height: 40rpx;
        }
        .btn-vision-lab-cn{
          position: absolute;
          bottom: 0rpx;
          right: -40rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/map/按钮-视界工坊.png") top center no-repeat;
          background-size: 100% 100%;
          width: 162rpx;
          height: 40rpx;
        }
        .btn-vision-lab-exp{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-vision-lab-exp.png") top center no-repeat;
          background-size: 100% 100%;
          width: 190rpx;
          height: 40rpx;
        }
      }
      .helly-hansen-container {
        position: absolute;
        bottom: 250rpx;
        right: 180rpx;
        background-color: pink;
        .line-helly-hansen{
          position: absolute;
          top: -60rpx;
          right: 340rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/line-helly-hansen.png") top center no-repeat;
          background-size: 100% 100%;
          width: 121rpx;
          height: 42rpx;
        }
        .btn-helly-hansen{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-helly-hansen.png") top center no-repeat;
          background-size: 100% 100%;
          width: 424rpx;
          height: 40rpx;
        }
        .btn-helly-hansen-cn{
          position: absolute;
          bottom: 0rpx;
          right: 40rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/map/按钮-划船.png") top center no-repeat;
          background-size: 100% 100%;
          width: 391rpx;
          height: 40rpx;
        }
        .btn-helly-hansen-exp{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-helly-hansen-exp.png") top center no-repeat;
          background-size: 100% 100%;
          width: 424rpx;
          height: 40rpx;
        }
      }
      .terrain-challenge-container {
        position: absolute;
        bottom: 180rpx;
        right: 240rpx;
        background-color: pink;
        .line-terrain-challenge{
          position: absolute;
          top: -20rpx;
          right: -85rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/line-terrain-challenge.png") top center no-repeat;
          background-size: 100% 100%;
          width: 91rpx;
          height: 6rpx;
        }
        .btn-terrain-challenge{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-terrain-challenge.png") top center no-repeat;
          background-size: 100% 100%;
          width: 372rpx;
          height: 40rpx;
        }
        .btn-terrain-challenge-cn{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/map/按钮-全域探索.png") top center no-repeat;
          background-size: 100% 100%;
          width: 275rpx;
          height: 40rpx;
        }
        .btn-terrain-challenge-exp{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-terrain-challenge-exp.png") top center no-repeat;
          background-size: 100% 100%;
          width: 372rpx;
          height: 40rpx;
        }
      }
      .tennis-challenge-container {
        position: absolute;
        bottom: -20rpx;
        right: 300rpx;
        background-color: pink;
        .line-tennis-challenge{
          position: absolute;
          top: -120rpx;
          right: 100rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/line-tennis-challenge.png") top center no-repeat;
          background-size: 100% 100%;
          width: 6rpx;
          height: 97rpx;
        }
        .btn-tennis-challenge{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-tennis-challenge.png") top center no-repeat;
          background-size: 100% 100%;
          width: 414rpx;
          height: 40rpx;
        }
        .btn-tennis-challenge-cn{
          position: absolute;
          bottom: 0rpx;
          right: 15rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/map/按钮-网球挑战.png") top center no-repeat;
          background-size: 100% 100%;
          width: 236rpx;
          height: 40rpx;
        }
        .btn-tennis-challenge-exp{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-tennis-challenge-exp.png") top center no-repeat;
          background-size: 100% 100%;
          width: 414rpx;
          height: 40rpx;
        }
      }
      .music-remix-container {
        position: absolute;
        bottom: -80rpx;
        right: 50rpx;
        background-color: pink;
        .line-music-remix{
          position: absolute;
          top: -140rpx;
          right: 120rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/line-music-remix.png") top center no-repeat;
          background-size: 100% 100%;
          width: 6rpx;
          height: 123rpx;
        }
        .btn-music-remix{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-music-remix.png") top center no-repeat;
          background-size: 100% 100%;
          width: 282rpx;
          height: 40rpx;
        }
        .btn-music-remix-cn{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/map/按钮-音乐.png") top center no-repeat;
          background-size: 100% 100%;
          width: 309rpx;
          height: 40rpx;
        }
        .btn-music-remix-exp{
          position: absolute;
          bottom: 0rpx;
          right: 0rpx;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-music-remix-exp.png") top center no-repeat;
          background-size: 100% 100%;
          width: 282rpx;
          height: 40rpx;
        }
      }
    }

    .btn-container {
      position: absolute;
      bottom: 100rpx;
      margin-left: 50%;
      transform: translateX(-50%);
      // background-color: pink;
      width: 40%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .qrcode-icon {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-qrcode.png") top center no-repeat;
        background-size: 100% 100%;
        width: 60rpx;
        height: 60rpx;
      }
      .my-account {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-profile.png") top center no-repeat;
        background-size: 100% 100%;
        width: 60rpx;
        height: 60rpx;
      }
    }

  }

  // 二维码生成画布
  .qrcode-canvas {
    position: fixed;
    left: -9999px;
    top: -9999px;
    width: 240px;
    height: 240px;
  }

  // 二维码弹窗
  .pop-window {
    position: fixed;
    top: 0rpx;
    left: 0rpx;
    width: 100vw;
    height: 100vh;

    // overflow: hidden;
    z-index: 9999;

    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: black;
    // opacity: .5;
    background-color: rgba(0, 0, 0, .3);

    // 模糊后面的地图
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);

      // 二维码容器
      .qrcode-container {
        transform: translateY(-8vh);
        width: 500rpx;
        height: 550rpx;
        border-radius: 30rpx;
        border: solid 1rpx rgba(255, 255, 255, .8);
        z-index: 1;
        background-color: rgba(255, 255, 255, .3);
        padding-top: 50rpx;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        align-items: center;
        box-sizing: border-box;

        .qr-bg {
          margin-top: 50rpx;
          width: 260rpx;
          height: 260rpx;
          padding: 15rpx;
          border-radius: 15rpx;
          background: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
           .qrcode-style {
            // margin: 10rpx;
            width: 250px;
            height: 250px;
          }
        }

        .text-container {
          margin-top: 20rpx;
          width: 360rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .proflie_text {
            margin-top: 10rpx;
            width: 100%;
            height: 30rpx;
            line-height: 30rpx;
            text-align: center;
            font-size: 28rpx;
            color: white;
          }
        }
       
        
      }
    }
}

</style>
