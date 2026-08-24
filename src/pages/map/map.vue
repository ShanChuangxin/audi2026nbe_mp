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
  qr.size = 180;
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

// 返回主页
function navigateToIndexPage() {
  // 把填写的信息以参数形式传到列表页面
  console.log("跳转到主页面")
  // uni.navigateTo({ url: `/pages/office_list/office_list?num_type=${peopleNum.value}&table_type=${selectedTableType.value}&city_type=${selectedCityType.value}&purpose_type=${selectedPurposeType.value}` })
  uni.navigateTo({url: "/pages/index/index"});

}

// 跳转到我的账户
function navigateToMyPage() {
  // 把填写的信息以参数形式传到列表页面
  console.log("跳转到账户页面")
  // uni.navigateTo({ url: `/pages/office_list/office_list?num_type=${peopleNum.value}&table_type=${selectedTableType.value}&city_type=${selectedCityType.value}&purpose_type=${selectedPurposeType.value}` })
  uni.navigateTo({url: "/pages/my/my"});

}

</script>

<template>
  <view class="page-container">
    <view class="body-view">
      <view class="btn-container">
        <view class="back-index" @tap="navigateToIndexPage">主页</view>
        <view class="qrcode-icon" @tap="openQrCode">二维码</view>
        <view class="my-account" @tap="navigateToMyPage">账户</view>
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
          <image
            v-if="qrCodeImage"
            :src="qrCodeImage"
            class="qrcode-style"
            mode="aspectFit"
          />
          <view class="proflie_text">ID: {{ myStore.profile?.user_id }}</view>
          <view class="proflie_text">昵称：{{ myStore.profile?.nick_name }}</view>
          <view class="proflie_text">分数：{{ myStore.profile?.score }}</view>
        </view>
    </view>
  </view>

</template>

<style lang="scss">

.page-container {
  .body-view {
    // background-color: #f6f6f6; 
    background-color: skyblue;
    width: 100vw;
    height: 100vh;

    .btn-container {
      position: absolute;
      bottom: 100rpx;
      margin-left: 50%;
      transform: translateX(-50%);
      // background-color: pink;
      width: 90%;
      height: 80rpx;
      .back-index {
        position: absolute;
        left: 10rpx;
        bottom: 10rpx
      }
      .qrcode-icon {
        position: absolute;
        bottom: 10rpx;
        margin-left: 50%;
        transform: translateX(-50%);
      }
      .my-account {
        position: absolute;
        right: 10rpx;
        bottom: 10rpx;
      }
    }

  }

  // 二维码生成画布
  .qrcode-canvas {
    position: fixed;
    left: -9999px;
    top: -9999px;
    width: 180px;
    height: 180px;
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
        height: 500rpx;
        z-index: 1;
        background-color: white;
        padding-top: 50rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .qrcode-style {
          margin: 10rpx;
          width: 180px;
          height: 180px;
        }
        .proflie_text {
          width: 100%;
          height: 30rpx;
          line-height: 30rpx;
          text-align: center;
          font-size: 25rpx;
          color: #adadad;
        }
      }
    }
}

</style>
