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
function loadQrCode(codeValue: string) {
  if (!codeValue) {
    console.log("没有获取到用户的id，返回到登录页面");
    uni.navigateTo({url: "/pages/index/index"});
  }
  console.log("生成二维码")
  // 获取uQRCode实例
  var qr = new UQRCode();
  // 设置二维码内容
  qr.data = codeValue;
  // 设置二维码大小，必须与canvas设置的宽高一致
  qr.size = 240;
  // 调用制作二维码方法
  qr.make();
  // 获取canvas上下文
  var canvasContext = uni.createCanvasContext('qrcode'); // 如果是组件，this必须传入
  // 设置uQRCode实例的canvas上下文
  qr.canvasContext = canvasContext;
  // 调用绘制方法将二维码图案绘制到canvas上
  qr.drawCanvas();
  // 等待Canvas绘制完成，然后转成图片
  setTimeout(() => {
    uni.canvasToTempFilePath({
      canvasId: "qrcode",
      success: (res) => {
        console.log("二维码图片生成成功")
        console.log(res.tempFilePath)
        qrCodeImage.value = res.tempFilePath
      },
      fail: (err) => {
        console.log("二维码图片生成失败")
        console.log(err)
      }
    })
  }, 100)
}

// 页面加载
onLoad(() => {
  const openId = myStore.profile?.open_id || ""
  if (!openId) {
    console.log("没有获取到 open_id")
    return
  }
  loadQrCode(openId)

  // 获取参数
  console.log(parseScene(query))
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

function navigateToAudiArchiveStudio() {
  console.log("跳转到拍照互动页面")
  uni.navigateTo({url: "/pages/audi_vision_index/audi_vision_index"});
}

function navigateToAudiMusicCapsule() {
  console.log("跳转到音乐互动页面")
  uni.navigateTo({url: "/pages/music_lab_index/music_lab_index"});
}

function navigateToAudiMiniatureCity() {
  console.log("跳转到赛车互动页面")
  uni.navigateTo({url: "/pages/audi_vision_index/audi_vision_index"});
}

function navigateToAudiTennisChallenge() {
  console.log("跳转到网球互动页面")
  uni.navigateTo({url: "/pages/audi_vision_index/audi_vision_index"});
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
         <view class="map-text"></view>
         <view class="language"></view>
      </view>

      <!-- 地图容器 -->
      <view class="map-container">
        <!-- Audi Archive Studio -->
         <view class="audi-archive-studio" @tap="navigateToAudiArchiveStudio"></view>
        <!-- Audi 4D Cinema -->
         <view class="audi-4d-cinema" @tap="()=>{console.log('跳转到Audi 4D Cinema')}"></view>
        <!-- Audi Music Capsule -->
         <view class="audi-music-capsule" @tap="navigateToAudiMusicCapsule"></view>
        <!-- Audi Miniature City -->
         <view class="audi-miniature-city" @tap="navigateToAudiMiniatureCity"></view>
        <!-- Audi Tennis Challenge -->
         <view class="audi-tennis-challenge" @tap="navigateToAudiTennisChallenge"></view>

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
            <view class="proflie_text">ID: {{ myStore.profile?.user_id }}</view>
            <view class="proflie_text">昵称：{{ myStore.profile?.nick_name }}</view>
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
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/bg.png") top center no-repeat;
    background-size: 100% 100%;
    width: 100vw;
    height: 100vh;
    // 顶部Bar
    .top-container {
      position: absolute;
      top: 50rpx;
      margin-left: 50%;
      transform: translateX(-50%);
      // background-color: pink;
      width: 90%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .map-text {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/text-map.png") top center no-repeat;
        background-size: 100% 100%;
        width: 71rpx;
        height: 21rpx;
      }
      .language {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/language.png") top center no-repeat;
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
      width: 750rpx;
      height: 1035rpx;
      .audi-archive-studio {
        position: absolute;
        top: -12rpx;
        right: 55rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/audi-archive-studio.png") top center no-repeat;
        background-size: 100% 100%;
        width: 291rpx;
        height: 258rpx;
      }
      .audi-4d-cinema {
        position: absolute;
        top: 275rpx;
        right: 195rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/audi-4d-cinema.png") top center no-repeat;
        background-size: 100% 100%;
        width: 230rpx;
        height: 123rpx;
      }
      .audi-music-capsule {
        position: absolute;
        top: 470rpx;
        left: 80rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/audi-music-capsule.png") top center no-repeat;
        background-size: 100% 100%;
        width: 262rpx;
        height: 68rpx;
      }
      .audi-miniature-city {
        position: absolute;
        top: 700rpx;
        right: 155rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/audi-miniature-city.png") top center no-repeat;
        background-size: 100% 100%;
        width: 332rpx;
        height: 40rpx;
      }
      .audi-tennis-challenge {
        position: absolute;
        top: 880rpx;
        left: 175rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/audi-tennis-challenge.png") top center no-repeat;
        background-size: 100% 100%;
        width: 283rpx;
        height: 117rpx;
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
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/qrcode.png") top center no-repeat;
        background-size: 100% 100%;
        width: 60rpx;
        height: 60rpx;
      }
      .my-account {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/profile.png") top center no-repeat;
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

  // 推广弹窗
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
    background-color: rgba(0, 0, 0, .5);

      // 二维码容器
      .qrcode-container {
        width: 500rpx;
        height: 550rpx;
        border-radius: 30rpx;
        border: solid 1rpx white;
        z-index: 1;
        background-color: rgba(255, 255, 255, .4);
        padding-top: 50rpx;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        align-items: center;

        .qr-bg {
          margin-top: 50rpx;
          width: 260rpx;
          height: 260rpx;
          padding: 15rpx;
          border-radius: 15rpx;
          background: white;
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
            font-size: 25rpx;
            color: white;
          }
        }
       
        
      }
    }
}

</style>
