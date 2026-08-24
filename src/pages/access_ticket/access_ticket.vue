<!-- 与订单详情合并了 -->
<!-- 门禁（参与的）详情 -->

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { getAccessTicketAPI } from '@/services/access_ticket'
import type { AccessTicketType } from '@/types/access_ticket'
import { useMyStore } from '@/stores/modules/my'
// @ts-ignore
import UQRCode from 'uqrcodejs';  // ts忽略了类型校验

// 获取页面参数
// 页面参数通过defineProps来定义
// 注意是把多个不同情况下传的不同参数取并集，且是可选的
const query = defineProps<{
  access_ticket_id: string
}>()

// 获取用户信息
const myInfo = useMyStore()
// const user_id = myInfo.profile!.user_id!

// 加载二维码
function loadQrCode(codeValue: string) {
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
}

// 获取门禁详情
const ticketInfo = ref<AccessTicketType>({} as AccessTicketType)
const getAccessTicketData = async () => {
  const res = await getAccessTicketAPI({ user_id: "1234abcd", ticket_id: "456efg" })
  console.log(res)
  ticketInfo.value = res.data
  loadQrCode(ticketInfo.value.qrcode)
  if (query.access_ticket_id) {
    // const res = await getAccessTicketAPI({ user_id: myInfo.profile!.user_id, ticket_id: query!.access_ticket_id })
    // console.log(ticketInfo.value)
    // 判断是否为本人的门禁，基于身份做不同的内容渲染
    // undo
  }
}

onLoad(() => {
  getAccessTicketData()
})

</script>

<template>
  <view class="ticket-body">
    <!-- 信息容器 -->
    <view class="info-container">
      <view class="address-info">
        <view class="title">场地信息</view>
        <view class="content">{{ ticketInfo.address }}</view>
      </view>
      <view class="ticket-info">
        <view class="name">
          <view class="title">姓名</view>
          <view class="content">{{ ticketInfo.user_name }}</view>
        </view>
        <view class="tel">
          <view class="title">手机号码</view>
          <view class="content">{{ ticketInfo.tel }}</view>
        </view>
        <view class="duration">
          <view class="title">使用时长</view>
          <view class="content"> {{ ticketInfo.duration }}</view>
        </view>
        <view class="time">
          <view class="title">时间</view>
          <view class="content">{{ ticketInfo.time }}</view>
        </view>
      </view>
    </view>
    <!-- 二维码容器 -->
    <view class="qrcode-container">
      <view class="tips">分享此页面给参会人员</view>
      <canvas id="qrcode" canvas-id="qrcode" class="qrcode-style"></canvas>
    </view>
  </view>

</template>

<style lang="scss">
page {
  width: 100vw;
  height: 100vh;
  background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/access_ticket/body-bg.png") top center no-repeat;
  background-size: 100% 100%;
  padding-top: 100rpx;
}

.ticket-body {
  position: relative;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 605rpx;
  height: 1010rpx;
  background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/access_ticket/ticket-bg.png") top center no-repeat;
  background-size: 100% 100%;

  // 信息容器
  .info-container {
    position: absolute;
    top: 40rpx;
    left: 20rpx;
    width: 560rpx;
    height: 360rpx;
    // background-color: skyblue;

    .address-info {
      // background-color: pink;
      width: 100%;
      height: 120rpx;

      .title {
        width: 100%;
        height: 50rpx;
        line-height: 50rpx;
        font-size: 28rpx;
        font-weight: 600;
        color: black;
      }

      .content {
        width: 100%;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 25rpx;
        font-weight: 400;
        color: black;
      }
    }

    .ticket-info {

      // 姓名
      .name {
        width: 100%;
        height: 55rpx;
        // background-color: pink;

        .title {
          float: left;
          font-size: 28rpx;
          font-weight: 500;
          line-height: 55rpx;
          text-align: left;
          display: flex;
          flex-wrap: nowrap;
          justify-content: left;
          align-items: center;

          &::before {
            margin-right: 20rpx;
            width: 35rpx;
            height: 30rpx;
            content: '';
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/access_ticket/icon-name.png") top center no-repeat;
            background-size: 100% 100%;
          }
        }

        .content {
          float: right;
          font-size: 25rpx;
          font-weight: 400;
          line-height: 50rpx;
          text-align: right;
        }
      }

      // 手机号码
      .tel {
        width: 100%;
        height: 55rpx;
        // background-color: pink;

        .title {
          float: left;
          font-size: 28rpx;
          font-weight: 500;
          line-height: 55rpx;
          text-align: left;
          display: flex;
          flex-wrap: nowrap;
          justify-content: left;
          align-items: center;

          &::before {
            margin-right: 20rpx;
            width: 35rpx;
            height: 30rpx;
            content: '';
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/access_ticket/icon-tel.png") top center no-repeat;
            background-size: 100% 100%;
          }
        }

        .content {
          float: right;
          font-size: 25rpx;
          font-weight: 400;
          line-height: 50rpx;
          text-align: right;
        }
      }

      // 使用时长
      .duration {
        width: 100%;
        height: 55rpx;
        // background-color: pink;

        .title {
          float: left;
          font-size: 28rpx;
          font-weight: 500;
          line-height: 55rpx;
          text-align: left;
          display: flex;
          flex-wrap: nowrap;
          justify-content: left;
          align-items: center;

          &::before {
            margin-right: 20rpx;
            width: 35rpx;
            height: 30rpx;
            content: '';
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/access_ticket/icon-duration.png") top center no-repeat;
            background-size: 100% 100%;
          }
        }

        .content {
          float: right;
          font-size: 25rpx;
          font-weight: 400;
          line-height: 50rpx;
          text-align: right;
        }
      }

      // 时间
      .time {
        width: 100%;
        height: 55rpx;
        // background-color: pink;

        .title {
          float: left;
          font-size: 28rpx;
          font-weight: 500;
          line-height: 55rpx;
          text-align: left;
          display: flex;
          flex-wrap: nowrap;
          justify-content: left;
          align-items: center;

          &::before {
            margin-right: 20rpx;
            width: 35rpx;
            height: 30rpx;
            content: '';
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/access_ticket/icon-time.png") top center no-repeat;
            background-size: 100% 100%;
          }
        }

        .content {
          float: right;
          font-size: 25rpx;
          font-weight: 400;
          line-height: 50rpx;
          text-align: right;
        }
      }
    }
  }

  // 二维码容器
  .qrcode-container {
    position: absolute;
    bottom: 110rpx;
    left: 20rpx;
    width: 560rpx;
    height: 420rpx;
    // background-color: pink;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .tips {
      width: 100%;
      height: 30rpx;
      line-height: 30rpx;
      text-align: center;
      font-size: 25rpx;
      color: #adadad;
    }

    .qrcode-style {
      width: 180px;
      height: 180px;
    }
  }
}
</style>