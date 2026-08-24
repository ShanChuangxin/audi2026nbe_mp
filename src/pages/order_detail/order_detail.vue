<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { onLoad, onShareAppMessage, onShow } from '@dcloudio/uni-app'
import { getOrderDetailAPI, applyWechatPayAPI, applyBalancePayAPI, addInvolveListAPI } from '@/services/order'
import type { OrderInfoType, WechatPayPreOrderInfoType } from '@/types/order'
import { useMyStore } from '@/stores/modules/my'

import { getAccessTicketAPI } from '@/services/access_ticket'
import type { AccessTicketType } from '@/types/access_ticket'
// @ts-ignore
import UQRCode from 'uqrcodejs';  // ts忽略了类型校验


// 配置页面分享信息
type ShareAppMessageOption = {
  from: 'button' | 'menu';
  target?: any;
  webViewUrl?: string;
};
onShareAppMessage((options: ShareAppMessageOption)=>{
  console.log("页面分享配置")
  // 根据订单的状态来看是否可以进行分享
  if (orderInfo.value.order_status >= 2) {
    return {
      title: '我预订了办飞中心的会议室，邀请您一起参加会议。',
      path: `/pages/order_detail/order_detail?order_id=${query.order_id}`,
      imageUrl: orderInfo.value.office_info?.office_cover,
    }
  }   
  // 如果条件不满足，可以返回空配置或者默认配置
  return {};
})

// 获取页面参数
// 页面参数通过defineProps来定义
// 注意是把多个不同情况下传的不同参数取并集，且是可选的
const query = defineProps<{
  order_id: string
}>()

const myStore = useMyStore()

const order_status = ref(1)  // 根据订单状态控制页面不同的显示。1为待支付，2为支付完成待使用，3为已过期
const meeting_duration = ref(0.0) // 使用时长
const meeting_time = ref("")  // 会议室的时间
const discount_price = ref(0) // 折扣单价
const origin_sum_price = ref(0) // 原总价
const discount_sum_price = ref(0) // 折扣总价


// 获取订单详情
const orderInfo = ref<OrderInfoType>({} as OrderInfoType)
const getOrderInfoData = async () => {
  console.log(query.order_id)
  if (query.order_id) {
    if (myStore.profile){
      // const res = await getOrderDetailAPI({ user_id: "1234", order_id: query.order_id })
      const res = await getOrderDetailAPI({ user_id: myStore.profile!.user_id, order_id: query.order_id })
      console.log("获取到的订单信息为：", res)
      // 赋值订单响应式数据 
      orderInfo.value = res.data.order
      console.log("更新订单状态来更新页面：", orderInfo.value.order_status)
      order_status.value = orderInfo.value.order_status // 更新订单状态，切换不同内容
      // 加载二维码
      loadQrCode(orderInfo.value.ticket_id)
      // order_status.value = 1
      if (orderInfo.value.order_status >= 2){ // 状态为2时，且为本人订单时，要开启菜单分享
        // 判断该订单是否本人订单
        if (orderInfo.value.buyer_info.user_id != myStore.profile.user_id){ // 非本人的订单，有可能是点击分享进来，也有可能是从我参与的点击进来
          // 判断是否在我参与的列表中，如果不是的话，需要加入到我参与的列表中
          if (!myStore.profile.involve_list?.includes(query.order_id)){
            // 1. 申请加入我参与的列表里
            const resAddInvolve = await addInvolveListAPI({user_id: myStore.profile.user_id, order_id: query.order_id})
            console.log("加入我参与列表的结果：", resAddInvolve)
            if (0 == res.errcode) {
              // 保存进本地存储
              myStore.setProfile(resAddInvolve.data.user_info)
            } else {
                uni.showToast({
                icon: 'none',
                title: "网络不佳，请稍后重试~"
                })
            }
          }
          // 2. 禁用分享菜单
          uni.hideShareMenu(uni.hideShareMenu as any); // 禁用分享菜单
        } else {
          // 动态注册分享功能
          uni.showShareMenu(); // 启用分享菜单
        }

      } else {
        uni.hideShareMenu(uni.hideShareMenu as any); // 禁用分享菜单
      }
      // 计算会议时长
      meeting_duration.value = (res.data.order.end_time + 1 - res.data.order.start_time) / 3600
      const start_date = new Date(res.data.order.start_time * 1000)
      console.log(start_date)
      const end_date = new Date((res.data.order.end_time + 1) * 1000)
      const year = start_date.getFullYear();
      const month = String(start_date.getMonth() + 1).padStart(2, '0');
      const day = String(start_date.getDate()).padStart(2, '0');
      const start_hours = String(start_date.getHours()).padStart(2, '0');
      const start_minutes = String(start_date.getMinutes()).padStart(2, '0');
      const end_hours = String(end_date.getHours()).padStart(2, '0');
      const end_minutes = String(end_date.getMinutes()).padStart(2, '0');
      // 计算会议时间
      meeting_time.value = `${year}-${month}-${day} ${start_hours}:${start_minutes}-${end_hours}:${end_minutes}`
      console.log("使用时长：", meeting_duration.value)
      console.log("日期：", meeting_time.value)
      console.log("会员等级：", myStore.profile.member_level)
      console.log("原始价格：", orderInfo.value.origin_price)
      console.log("折扣价格：", discount_price.value)
      // 根据会员等级计算折扣价格。会员等级，0为非会员，1为办飞会员，2为飞速会员，3为飞音速会员，4为飞光速会员
      if (0 == myStore.profile.member_level){
        discount_price.value = 0
      } else if (1 == myStore.profile.member_level) { // 办飞会员，7折
        discount_price.value = orderInfo.value.origin_price! * 0.7
      } else if (2 == myStore.profile.member_level) { // 飞速会员，6折
        discount_price.value = orderInfo.value.origin_price! * 0.6
      } else if (3 == myStore.profile.member_level) { // 飞音速会员，5折
        discount_price.value = orderInfo.value.origin_price! * 0.5
      } else if (4 == myStore.profile.member_level) { // 飞光速会员，4折
        discount_price.value = orderInfo.value.origin_price! * 0.4
      } else {
        // 没有其它情况
      }
      // 对折扣价进行精确到小数点后两位处理
      discount_price.value = Math.round(discount_price.value * 100) / 100;
      // 计算总价
      origin_sum_price.value = orderInfo.value.origin_price! * (meeting_duration.value / 0.5) // 原价的总价
      origin_sum_price.value = Math.round(origin_sum_price.value * 100) / 100; // 精确到小数点后两位
      discount_sum_price.value = discount_price.value * (meeting_duration.value / 0.5)  // 折扣后的总价
      discount_sum_price.value = Math.round(discount_sum_price.value * 100) / 100; // 精确到小数点后两位

    } else {
      uni.navigateTo({ url: "/pages/login/login" })
      return
    }
    
  }
}

// 使用统计
// const onTapCheckInBtn = () => {
//   uni.navigateTo({ url: `/pages/checkin_data/checkin_data?access_ticket_id=${orderInfo.value.ticket_id}` })
// }

// 门禁使用
// const onTapAccessTicketBtn = () => {
//   uni.navigateTo({ url: `/pages/access_ticket/access_ticket?access_ticket_id=${orderInfo.value.ticket_id}` })
// }

// 进入页面加载订单详情
onShow(() => {
  console.log("query中的order_id为：", query.order_id)
  getOrderInfoData()  // 获取订单详情
  // 获取优惠详情
  // undo
  // uni.hideShareMenu(); // 强制隐藏分享功能
})

// onLoad(() => {
//   uni.hideShareMenu(); // 强制隐藏分享功能
// });

////////////////////////////////////////////////
//               未支付的订单相关
////////////////////////////////////////////////

// 会员充值优惠跳转到会员页面
function navigateToMemberPage(){
  console.log("切换到会员页面")
  uni.switchTab({ url: '/pages/member/member' })
}

// 支付弹窗类型
const popup = ref<UniHelper.UniPopup>()
function openPayPopup() {
  console.log("打开支付弹窗弹窗")
  popup.value?.open('bottom')
}
// 结算按钮触发
function tapPayBtn(){
  // 判断当前订单距离会议室开始时间是否大于一小时
  const currentTime = Math.floor(Date.now() / 1000) 
  if (orderInfo.value.start_time - currentTime < 3600){
    uni.showToast({
      icon: 'none',
      title: "订单已过期，请删除订单后，重新预订~"
    })
    return
  }


  // 信息要做验证：1. 办公室是否被其它人抢先预定  2. 会议室单价、时长、总价、会员等级、折扣是否匹配
  const pay_order_info = {
    user_info: toRaw(myStore.profile),
    order_info: toRaw(orderInfo.value),
    pay_info: {
      origin_price: orderInfo.value.origin_price,
      discount_price: discount_price.value,
      meeting_duration: meeting_duration.value,
      origin_price_sum: origin_sum_price.value,
      discount_price_sum: discount_sum_price.value
    }
  }
  console.log("点击了支付按钮, 支付信息：", pay_order_info)
  openPayPopup()
}
const isAgreement = ref(false)  // 默认同意协议
// 打开协议
function onTapAgreement(){
  // #ifdef MP-WEIXIN
  // 跳转至隐私协议页面
  // wx.openPrivacyContract({})
  // #endif
  console.log("打开协议")
  isAgreement.value=true
  uni.navigateTo({"url": "/pages/agreement/order_agreement"})
}
// 微信支付函数
async function tapWechatPay(){
  if (!isAgreement.value){
    uni.showToast({
      icon: 'none',
      title: '请先阅读并勾选协议',
    })
    return
  }
  // 微信支付相关功能
  console.log("调起微信支付功能")
  // 构建微信支付的预订单信息
  const pay_num = discount_price.value ? discount_sum_price.value : origin_sum_price.value  // 实际支付的金额
  const pre_order_info = {
    payer_id: myStore.profile?.open_id!,
    order_id: orderInfo.value.order_id!,
    amount: Math.floor(pay_num * 100), // 注意：单位是分。并做了向下取整
    // amount: 1,
    description: `微信支付方式预订会议室：${orderInfo.value.office_info?.building_name}-${orderInfo.value.office_info?.office_name} ${meeting_time.value}`,
    attach: "order", // 用于标订单类型
    // 添加了订单信息，用于校验金额
    order_info: {
      buyer_id: myStore.profile?.user_id,
      office_id: orderInfo.value.office_info?.office_id,
      start_time: orderInfo.value.start_time,
      end_time: orderInfo.value.end_time,
      submit_price: pay_num,
    }
  }
  console.log(discount_sum_price.value)
  console.log("pre_order_info: ", pre_order_info)

  const res = await applyWechatPayAPI({wechat_pre_order: pre_order_info})
  console.log("获取的微信支付签名信息为：", res)
  if (0 == res.errcode){
    console.log("签名为：", res.data.payment_info)
    // 打包签名对象
    const payment_info = {
      timeStamp: res.data.payment_info.timestamp,
      nonceStr: res.data.payment_info.random_str,
      package: res.data.payment_info.prepay_id,  // 前边需要拼接prepay_id
      signType: "RSA",
      paySign: res.data.payment_info.signature,
      "success": async function(res: any){
        console.log("请求支付成功: ", res)
        uni.redirectTo({ url: `/pages/order_detail/order_detail?order_id=${query.order_id}` })
        // console.log("重新获取订单详情: ")
        // await getOrderInfoData()
        // if (2 == orderInfo.value.order_status){ // 说明支付成功，则跳转刷新页面
        //   // uni.showToast({
        //   //   icon: 'none',
        //   //   title: "微信支付成功，刷新页面"
        //   // })
        //   // 注意这里是关掉并跳转
        //   uni.redirectTo({ url: `/pages/order_detail/order_detail?order_id=${query.order_id}` })
        // } else {
        //   uni.showToast({
        //     icon: 'none',
        //     title: "支付结果处理中，请稍后刷新重试~"
        //   })
        // }
      },
      "fail": function(res: any){
        console.log("请求支付失败: ", res)
        uni.showToast({
          icon: 'none',
          title: "微信支付失败，请稍后重试~"
        })
      },
      "complete": function(res: any){console.log("请求支付完成: ", res)},
    }
    console.log("payment_info: ", payment_info)
    wx.requestPayment(payment_info as any)


  } else {
      uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~"
    })
  }
}
// 余额支付函数
async function tapBalancePay() {
  if (!isAgreement.value){
    uni.showToast({
      icon: 'none',
      title: '请先阅读并勾选协议',
    })
    return
  }
  // 余额支付相关功能
  console.log("调起余额支付功能")
  const pay_num = discount_price.value ? discount_sum_price.value : origin_sum_price.value  // 实际支付的金额
  const pay_order_info = {
    user_id: myStore.profile?.user_id!,
    order_id: query.order_id!,
    pay_price: pay_num!,
    order_info: {
      buyer_id: myStore.profile?.user_id,
      office_id: orderInfo.value.office_info?.office_id,
      start_time: orderInfo.value.start_time,
      end_time: orderInfo.value.end_time,
      submit_price: pay_num,
    }
  }
  const res = await applyBalancePayAPI(pay_order_info)
  console.log("余额支付的结果：", res)
  if (0 == res.errcode){
    console.log("余额支付成功，获取到最新的用户信息为：", res.data.user_info)
    myStore.setProfile(res.data.user_info)
    // 成功提示
    uni.showToast({ icon: 'success', title: '支付成功' })
    // 页面跳转；加个定时器，这样可以显示完提示再跳转
    setTimeout(() => {
      // uni.navigateBack()  // 跳转到之前的页面
      uni.redirectTo({ url: `/pages/order_detail/order_detail?order_id=${query.order_id}` })
    }, 1000)

  } else {
    console.log("请求支付失败: ", res)
    uni.showToast({
      icon: 'none',
      title: res.errmsg
    })
  }
}
// 联系客服支付
function tapContactPay() {
  if (!isAgreement.value){
    uni.showToast({
      icon: 'none',
      title: '请先阅读并勾选协议',
    })
    return
  }
  // 联系客服支付相关功能
  console.log("调起联系客服支付功能")
}

////////////////////////////////////////////////
//               已支付的订单相关
////////////////////////////////////////////////
// 加载二维码
function loadQrCode(codeValue: string) {
  if (!codeValue) return
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
}

// 获取门禁详情
// const ticketInfo = ref<AccessTicketType>({} as AccessTicketType)
// const getAccessTicketData = async () => {
//   const res = await getAccessTicketAPI({ user_id: "1234abcd", ticket_id: "456efg" })
//   console.log(res)
//   ticketInfo.value = res.data
//   loadQrCode(ticketInfo.value.qrcode)
//   if (query.access_ticket_id) {
//     // const res = await getAccessTicketAPI({ user_id: myInfo.profile!.user_id, ticket_id: query!.access_ticket_id })
//     // console.log(ticketInfo.value)
//     // 判断是否为本人的门禁，基于身份做不同的内容渲染
//     // undo
//   }
// }

</script>

<template>
  <!-- 订单未支付 -->
  <view v-if="1 == order_status">
    <!-- 头部 -->
    <view class="reserve-head">
      <!-- <image class="favorite-default"
        src="https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/office/favorite-default.png" mode="scaleToFill" /> -->
      <!-- 概述 -->
      <view class="page-title">
        预定
      </view>
      <!-- 预订封面 -->
      <view class="reserve-preview">
        <view class="preview-title">你的预定</view>
        <view class="preview-info">
          <image class="reserve-thumbnail" :src="orderInfo.office_info?.office_cover" mode="scaleToFill" />
          <view class="office-base-info">
            <view class="office-title">{{ orderInfo.office_info?.building_name }}</view>
            <view class="room-num">房号：{{ orderInfo.office_info?.office_name }}</view>
            <view class="office-address">{{ orderInfo.office_info?.address }}</view>
            <view class="fee-container">
              <text class="origin-price" :class="{'line-through' : 0 != discount_price}">￥{{ orderInfo.origin_price }} / 半小时</text>
              <text v-show="discount_price" class="discount-price">￥{{ discount_price }} / 半小时</text>
            </view>
          </view>
        </view>
      </view>
      
    </view>

    <!-- 预订信息 -->
    <view class="reserve-info-container">
      <view class="title">你的预定</view>
      <view class="info">
        <view class="pic_name">
          <view class="field">姓名</view>
          <view class="text">{{ orderInfo.pic_name }}</view>
        </view>
        <view class="tel">
          <view class="field">手机号码</view>
          <view class="text">{{ orderInfo.pic_tel }}</view>
        </view>
        <view class="room-num">
          <view class="field">房号</view>
          <view class="text">{{ orderInfo.office_info?.office_name }}</view>
        </view>
        <view class="duration">
          <view class="field">使用时长</view>
          <view class="text">{{ meeting_duration }} 小时</view>         
        </view> 
        <view class="time">
          <view class="field">日期</view>
          <view class="text">{{ meeting_time }}</view>
        </view>
        <view class="order-id">
          <view class="field">订单编号</view>
          <view class="text">{{ orderInfo.order_id }}</view>
        </view>
      </view>
      <view class="price">
        <view class="price-title">总价</view>
        <view class="price-num">
          <view class="origin-sum" :class="{'line-through' : 0 != discount_price}">￥{{ origin_sum_price }}</view>
          <view v-show="discount_price" class="discount-sum">￥{{ discount_sum_price }}</view>
        </view>
      </view>
    </view>

    <!-- 折扣区域 -->
    <view class="discount-container">
      <view class="title">会员充值优惠</view>
      <view class="icon-container">
        <view class="discount-7" @tap="navigateToMemberPage"></view>
        <view class="discount-6" @tap="navigateToMemberPage"></view>
        <view class="discount-5" @tap="navigateToMemberPage"></view>
        <view class="discount-4" @tap="navigateToMemberPage"></view>
      </view>
    </view>

    <!-- 结算区域 -->
    <view class="pay-container">
      <view class="amount">￥{{ discount_price ? discount_sum_price : origin_sum_price }}</view>
      <view class="pay-btn" @tap="tapPayBtn">支付</view>
    </view>

    <!-- 支付弹窗 -->
    <uni-popup ref="popup" type="bottom">

      <view class="pay-popup-container">
        <!-- 顶部横条 -->
        <view class="indicator"></view>
        <!-- 支付方式内容容器 -->
        <view class="pay-method-container">
          <view class="title">支付方式</view>
          <view class="pay-method">
            <view class="wechat-pay" @tap="tapWechatPay">微信支付</view>
            <view class="balance-pay" @tap="tapBalancePay">余额支付</view>
            <view class="contact-pay" @tap="tapContactPay">
              线下支付 联系客服
              <button
                open-type="contact"
                session-from="微信客服123"
                send-message-title="当前标题"
                send-message-path="当前分享路径"
                send-message-img="截图"
                show-message-card="false"
                @contact=""
                @click=""
              >      
              </button>
            </view>
          </view>
          <!-- 同意协议 -->
          <view class="agreement-container">
            <view class="agreement">
            <label @tap="isAgreement = !isAgreement">
              <radio class="radio" color="#28bb9c"
                :value="1"
                :checked="isAgreement"
              />
              <text>我同意并阅读完</text>
            </label>
            <text class="link" @tap="onTapAgreement">《场地使用须知》</text>
            <!-- <navigator class="link" hover-class="none" url="/pages/agreement/order_agreement" @tap="isAgreement=true">《场地使用须知》</navigator> -->
            </view>
          </view>
          
        </view>
      
        
      </view>

    </uni-popup>
  </view>  
  
  <!-- 订单已支付（把门禁详情页面合并在这里） -->
  <view v-else class="page-bg">
    <view class="ticket-body">
      <!-- 信息容器 -->
      <view class="info-container">
        <view class="address-info">
          <view class="title">场地信息</view>
          <view class="content">{{ orderInfo.office_info?.office_address }}</view>
        </view>
        <view class="ticket-info">
          <view class="name">
            <view class="title">姓名</view>
            <view class="content">{{ orderInfo.pic_name }}</view>
          </view>
          <view class="tel">
            <view class="title">手机号码</view>
            <view class="content">{{ orderInfo.pic_tel }}</view>
          </view>
          <view class="room-num">
            <view class="title">房号</view>
            <view class="content">{{ orderInfo.office_info?.office_name }}</view>
          </view>
          <view class="duration">
            <view class="title">使用时长</view>
            <view class="content"> {{ meeting_duration }} 小时</view>
          </view>
          <view class="time">
            <view class="title">时间</view>
            <view class="content">{{ meeting_time }}</view>
          </view>
          <view class="order-id">
            <view class="title">订单编号</view>
            <view class="content">{{ orderInfo.order_id }}</view>
          </view>
        </view>
      </view>
      <!-- 二维码容器 -->
      <view class="qrcode-container">
        <view class="tips-container">
          <view class="tips">分享此页面给参会人员</view>
          <view class="tips">会议中心入门码</view>
        </view>
        <canvas id="qrcode" canvas-id="qrcode" class="qrcode-style"></canvas>
      </view>
    </view>
  </view>


</template>


<style lang="scss">
////////////////////////////////////////////////
//               未支付的订单相关
////////////////////////////////////////////////
// 头部
.reserve-head {
  width: 750rpx;
  height: 410rpx;
  background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/head-bg-green.png") top center no-repeat;
  background-size: 100% 100%;
  position: relative;

  .favorite-default {
    position: absolute;
    top: 60rpx;
    right: 50rpx;
    width: 40rpx;
    height: 40rpx;
  }

  // 页面标题
  .page-title {
    // margin-top: 50rpx;
    padding-top: 40rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 300rpx;
    height: 100rpx;

    font-size: 40rpx;
    font-weight: 600;
    color: black;
    text-align: center;
  }

  // 预订封面
  .reserve-preview {
    // margin-top: 30rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 650rpx;
    height: 200rpx;

    .preview-title {
      margin-left: 10rpx;
      font-size: 35rpx;
      font-weight: 400;
    }

    // 会议室的基本信息
    .preview-info {
      width: 100%;
      height: 200rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      // 会议室缩略图
      .reserve-thumbnail {
        width: 242rpx;
        height: 136rpx;
      }

      // 会议室基本信息
      .office-base-info {
        margin-left: 20rpx;
        position: relative;
        width: 450rpx;
        height: 220rpx;
        display: flex;
        flex-direction: column;

        .office-title {
          font-size: 35rpx;
          font-weight: 600;
          color: black;
        }

        .room-num {
          display: flex;
          align-items: center;

          font-size: 28rpx;
          font-weight: 200;
          // color: #a7adc0;
          color: black;
          text-align: left;

          &:before {
            display: inline-block;
            margin-right: 15rpx;
            content: '';
            width: 20rpx;
            height: 30rpx;
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-room.png") top center no-repeat;
            background-size: 100% 100%;
          }
        }

        .office-address {
          display: flex;
          align-items: center;

          font-size: 28rpx;
          font-weight: 200;
          // color: #a7adc0;
          color: black;
          text-align: left;

          &:before {
            display: inline-block;
            margin-right: 15rpx;
            content: '';
            width: 21rpx;
            height: 24rpx;
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/office/icon-location.png") top center no-repeat;
            background-size: 100% 100%;
          }
        }

        .fee-container {
          // position: absolute;
          bottom: 0rpx;
          display: flex;
          flex-direction: column;
          justify-content: left;

          .origin-price {
            font-size: 30rpx;
            font-weight: 400;
            // color: #8d8f98;
            color: black;

          }
          .line-through {
            text-decoration: line-through;
          }

          .discount-price {
            font-size: 40rpx;
            font-weight: 400;
            color: #cc5872;
          }
        }


      }
    }
  }
}
// 预定信息
.reserve-info-container {
  margin-top: 30rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 560rpx;
  border: solid 2rpx #eaeaf0;
  border-radius: 20rpx;
  box-sizing: border-box;
  .title {
    margin-top: 30rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 40rpx;
    line-height: 40rpx;
    // background-color: pink;
    font-size: 30rpx;
    color: #abadb3;
  }
  .info {
    margin-left: 50%;
    transform: translateX(-50%);
    width: 90%;
    // height: 300rpx;
    // background-color: skyblue;
    font-size: 28rpx;
    // 姓名
    .pic_name {
      margin-top: 25rpx;
      width: 100%;
      height: 40rpx;
      .field {
        float: left;
        display: flex;
        align-items: center;
        &:before {
          display: inline-block;
            margin-right: 15rpx;
            content: '';
            width: 30rpx;
            height: 30rpx;
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-people.png") top center no-repeat;
            background-size: 100% 100%;
        }
      }
      .text {
        float: right;
      }
    }
    // 手机号码
    .tel {
      margin-top: 20rpx;
      width: 100%;
      height: 40rpx;
      .field {
        float: left;
        display: flex;
        align-items: center;
        &:before {
          display: inline-block;
            margin-right: 15rpx;
            content: '';
            width: 30rpx;
            height: 30rpx;
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-tel.png") top center no-repeat;
            background-size: 100% 100%;
        }
      }
      .text {
        float: right;
      }
    }
    // 房号
    .room-num {
      margin-top: 20rpx;
      width: 100%;
      height: 40rpx;
      .field {
        float: left;
        display: flex;
        align-items: center;
        &:before {
          display: inline-block;
            margin-right: 18rpx;
            content: '';
            width: 24rpx;
            height: 36rpx;
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-room.png") top center no-repeat;
            background-size: 100% 100%;
        }
      }
      .text {
        float: right;
      }
    }
    // 使用时长
    .duration {
      margin-top: 20rpx;
      width: 100%;
      height: 40rpx;
      .field {
        float: left;
        display: flex;
        align-items: center;
        &:before {
          display: inline-block;
            margin-right: 15rpx;
            content: '';
            width: 30rpx;
            height: 30rpx;
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-duration.png") top center no-repeat;
            background-size: 100% 100%;
        }
      }
      .text {
        float: right;
      }
    }
    // 日期
    .time {
      margin-top: 20rpx;
      width: 100%;
      height: 40rpx;
      .field {
        float: left;
        display: flex;
        align-items: center;
        &:before {
          display: inline-block;
            margin-right: 15rpx;
            content: '';
            width: 30rpx;
            height: 30rpx;
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-date.png") top center no-repeat;
            background-size: 100% 100%;
        }
      }
      .text {
        float: right;
      }
    }
    // 订单号
    .order-id {
      margin-top: 20rpx;
      width: 100%;
      height: 40rpx;
      .field {
        float: left;
        display: flex;
        align-items: center;
        &:before {
          display: inline-block;
            margin-right: 15rpx;
            content: '';
            width: 30rpx;
            height: 30rpx;
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-order-id.png") top center no-repeat;
            background-size: 100% 100%;
        }
      }
      .text {
        float: right;
      }
    }

  }
  .price {
    margin-top: 20rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 100rpx;
    // background-color: skyblue;
    border-top:  2rpx dashed #abadb3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .price-title {
      font-size: 28rpx;

    }
    .price-num {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      .origin-sum {
        font-size: 26rpx;
      }
      .line-through {
        text-decoration: line-through;
      }
      .discount-sum {
        font-size: 40rpx;
        color: #cc5872;
      }
    }
    
  }
}
// 折扣区域
.discount-container {
  margin-left: 50%;
  transform: translateX(-50%);
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .title {
    width: 100%;
    height: 40rpx;
    font-size: 30rpx;
    text-align: center;
    color: #abadb3;
  }
  .icon-container {
    width: 100%;
    height: 150rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background-color: pink;
    box-sizing: border-box;
    .discount-7 {
      width: 144rpx;
      height: 144rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-discount-7.png") top center no-repeat;
      background-size: 100% 100%;
    }
    .discount-6 {
      width: 144rpx;
      height: 144rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-discount-6.png") top center no-repeat;
      background-size: 100% 100%;
    }
    .discount-5 {
      width: 144rpx;
      height: 144rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-discount-5.png") top center no-repeat;
      background-size: 100% 100%;
    }
    .discount-4 {
      width: 144rpx;
      height: 144rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-discount-4.png") top center no-repeat;
      background-size: 100% 100%;
    }
  }
}
// 结算区域
.pay-container {
  margin-top: 40rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 90rpx;
  // background-color: skyblue;
  padding-bottom: 50rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .amount {
    font-size: 40rpx;
    color: #cc5872;
  }
  .pay-btn {
    width: 300rpx;
    height: 90rpx;
    border-radius: 80rpx;
    background-color: #cc5872;
    line-height: 90rpx;
    text-align: center;
    color: white;
    font-size: 40rpx;
  }
}

// 支付弹窗筛选容器
.pay-popup-container {
  position: relative;
  margin-bottom: -70rpx; // 清除容器和uni-popup底部的空隙（原因未知）
  width: 750rpx;
  height: 800rpx;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  background-color: white;

  // 顶部横条
  .indicator {
    position: absolute;
    top: 20rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 150rpx;
    height: 10rpx;
    background-color: #dfdfe7;
    border-radius: 5rpx;

  }
  // 支付方式内容容器
  .pay-method-container {
    position: absolute;
    top: 100rpx;

    margin-left: 50%;
    transform: translateX(-50%);
    width: 600rpx;
    height: 800rpx;
    // background-color: pink;
    .title {
      font-size: 40rpx;
      color: black;
    }
    .pay-method{
      margin-top: 20rpx;
      width: 100%;
      height: 430rpx;
      // background-color: skyblue;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .wechat-pay {
        width: 100%;
        height: 140rpx;
        border: solid 2rpx #dfdfe7;
        border-radius: 30rpx;
        font-size: 40rpx;
        // background-color: aqua;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &:before {
          display: inline-block;
          margin: 0rpx 80rpx 0rpx 20rpx;
          content: '';
          width: 100rpx;
          height: 100rpx;
          background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-wechat-pay.png") top center no-repeat;
          background-size: 100% 100%;
        }
      }
      .balance-pay {
        width: 100%;
        height: 140rpx;
        border: solid 2rpx #dfdfe7;
        border-radius: 30rpx;
        font-size: 40rpx;
        // background-color: aqua;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &:before {
          display: inline-block;
          margin: 0rpx 80rpx 0rpx 20rpx;
          content: '';
          width: 100rpx;
          height: 100rpx;
          background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order/icon-balance-pay.png") top center no-repeat;
          background-size: 100% 100%;
        }
      }
      .contact-pay {
        position:relative;
        width: 100%;
        height: 110rpx;
        border: solid 2rpx #dfdfe7;
        border-radius: 30rpx;
        // background-color: aqua;
        text-align: center;
        line-height: 110rpx;
        font-size: 40rpx;

        // 把按钮以绝对定位的形式盖在了上边，并且设置透明度为0，这样就解决了按钮标签中要放其它标签可能会出现样式难处理的问题
        button {
          position: absolute;
          top: 0rpx;
          left: 0rpx;
          width: 100%;
          height: 100%;
          background-color: pink;
          opacity: 0; // 透明度为0
        }
      }
    }
    .agreement-container {
      width: 100%;
      height: 100rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .agreement{
        margin-top: 30rpx;
        width: 480rpx;
        height: 80rpx;
        // background-color: skyblue;
        // display: flex;
        // justify-content: flex-start;
        // checkbox {
        //   appearance: none !important; /* 隐藏默认的 radio 样式 */
        //   -webkit-appearance: none !important; /* Safari 支持 */
        //   -moz-appearance: none !important; /* Firefox 支持 */
        //   width: 10px;
        //   height: 10px;
        //   border: 2px solid #333; /* 外框 */
        //   background-color: white;
        //   border-radius: 0; /* 移除圆角，变成正方形 */
        //   cursor: pointer;
        //   outline: none;
        //   transition: all 0.3s ease;
        // }
        .radio {
          transform: scale(0.6);
          margin-right: -4rpx;
          margin-top: -4rpx;
          vertical-align: middle;
        }
        text{
          font-size:24rpx;
        }
        .link {
          color:blue;
        }
      }
    }
  }
}

////////////////////////////////////////////////
//               已支付的订单相关
////////////////////////////////////////////////
.page-bg {
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
      height: 130rpx;

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
        height: 45rpx;
        // background-color: pink;

        .title {
          float: left;
          font-size: 26rpx;
          font-weight: 500;
          line-height: 45rpx;
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
          font-size: 24rpx;
          font-weight: 400;
          line-height: 45rpx;
          text-align: right;
        }
      }

      // 手机号码
      .tel {
        width: 100%;
        height: 45rpx;
        // background-color: pink;

        .title {
          float: left;
          font-size: 26rpx;
          font-weight: 500;
          line-height: 45rpx;
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
          font-size: 24rpx;
          font-weight: 400;
          line-height: 45rpx;
          text-align: right;
        }
      }

      // 房号
      .room-num {
        width: 100%;
        height: 45rpx;
        // background-color: pink;

        .title {
          float: left;
          font-size: 26rpx;
          font-weight: 500;
          line-height: 45rpx;
          text-align: left;
          display: flex;
          flex-wrap: nowrap;
          justify-content: left;
          align-items: center;

          &::before {
            margin-right: 28rpx;
            width: 26rpx;
            height: 39rpx;
            content: '';
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/access_ticket/icon-room.png") top center no-repeat;
            background-size: 100% 100%;
          }
        }

        .content {
          float: right;
          font-size: 24rpx;
          font-weight: 400;
          line-height: 45rpx;
          text-align: right;
        }
      }

      // 使用时长
      .duration {
        width: 100%;
        height: 45rpx;
        // background-color: pink;

        .title {
          float: left;
          font-size: 26rpx;
          font-weight: 500;
          line-height: 45rpx;
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
          font-size: 24rpx;
          font-weight: 400;
          line-height: 45rpx;
          text-align: right;
        }
      }

      // 时间
      .time {
        width: 100%;
        height: 45rpx;
        // background-color: pink;

        .title {
          float: left;
          font-size: 26rpx;
          font-weight: 500;
          line-height: 45rpx;
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
          font-size: 24rpx;
          font-weight: 400;
          line-height: 45rpx;
          text-align: right;
        }
      }

      // 订单编号
      .order-id {
        width: 100%;
        height: 45rpx;
        // background-color: pink;

        .title {
          float: left;
          font-size: 26rpx;
          font-weight: 500;
          line-height: 45rpx;
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
            background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/access_ticket/icon-order-id.png") top center no-repeat;
            background-size: 100% 100%;
          }
        }

        .content {
          float: right;
          font-size: 24rpx;
          font-weight: 400;
          line-height: 45rpx;
          text-align: right;
        }
      }
    }
  }

  // 二维码容器
  .qrcode-container {
    position: absolute;
    bottom: 90rpx;
    left: 20rpx;
    width: 560rpx;
    height: 450rpx;
    // background-color: pink;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .tips-container {
      .tips{
        width: 100%;
        height: 30rpx;
        line-height: 30rpx;
        text-align: center;
        font-size: 25rpx;
        color: #adadad;
      }
    }

    .qrcode-style {
      width: 180px;
      height: 180px;
    }
  }
}

</style>
