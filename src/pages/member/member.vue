<!-- TabBar会员 -->

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app'
import { getMemberInfoAPI, applyRechargeBalanceAPI, applyMemberAPI } from '@/services/member'
import type { RechargeScore, ResultRechargeScore } from '@/types/member'
import { useMyStore } from '@/stores/modules/my'
import type { MemberCard } from '@/types/member'

import { getMyProfileAPI } from '@/services/profile'  // 用于获取最新的用户信息

let index = 0
// 切换会员图片; DEBUG用
function changeHeadImg(){
  return 
  if (4 == index){
    index = 0
  } else {
    ++index;
  }
  current_head_img.value = head_img_url[index]
}
// 顶部会员身份展示的图片路径
const head_img_url = [
  "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/head-bg-not-member.png",
  "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/head-bg-banfei-member.png",
  "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/head-bg-feisu-member.png",
  "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/head-bg-feiyinsu-member.png",
  "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/head-bg-feiguangsu-member.png",
]
const current_head_img = ref(head_img_url[0])  // 当前显示哪个头部图片


// 获取用户当前信息
const myStore = useMyStore()
const balance = ref(0)  // 用户账户余额，未登录时显示0
const lastday = ref("") // 会员到期时间，未登录时不显示
const member_level = ref(0) // 会员等级
const updateMemberStatus = () => {
  if (!myStore.profile){  // 用户未登录，则不显示和用户有关的信息
    console.log("用户未登录")
    // 重置页面渲染有关的东西
    balance.value = 0
    lastday.value = ""
    member_level.value = 0
    current_head_img.value = head_img_url[0]
    return
  }
  console.log("用户已登录，用户信息为：", myStore.profile)
  member_level.value = myStore.profile.member_level!
  // 更新信息状态
  // 更新顶部会员图片
  current_head_img.value = head_img_url[member_level.value]
  // 会员更新截止日期
  if(myStore.profile?.member_level != 0){ // 会员
    const current_timestamp = Math.floor(Date.now() / 1000)
    // 过期了
    if (current_timestamp >= parseInt(myStore.profile?.member_end_time!, 10)){  // 过期了，向服务器通知
      // 1. 向服务器通知
      // undo

      // 2. 不展示有效期
      lastday.value = ""
    } else {
      if (myStore.profile?.member_end_time){
        const timestamp = parseInt(myStore.profile?.member_end_time!, 10); // 以秒为单位的时间戳
        const date = new Date(timestamp * 1000); // 转换为毫秒

        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 月份不需要补零
        const day = date.getDate(); // 日期不需要补零

        const formattedDate = `${year}/${month}/${day}`;
        console.log("格式化后的时间为：", formattedDate); // 输出类似 "2026/1/11"
        lastday.value = formattedDate
      }
      
    }
  }
  // 更新余额
  balance.value = myStore.profile?.account_balance ? Math.floor(myStore.profile.account_balance) : 0  // 有余额显示余额，没有余额显示0

}

onShow(()=>{
  updateMemberStatus()
})


// 
const memberInfo = ref<MemberCard>()
// 获取当前会员积分信息
const getMemberInfoData = async () => {
  // const user_id = myInfo.profile!.user_id!
  let user_id = "1234"
  const res = await getMemberInfoAPI({ user_id })
  console.log(res)
  memberInfo.value = res.data
  // 把返回的结果更新进本地存储
  // undo
}
// 定义充值积分的函数
// const selectScore = ref<RechargeScore>()
// const rechargeScoreData = async () => {
//   const res = await rechargeScoreAPI(selectScore.value!)
//   // 根据返回结果，需要把积分存入个人账户显示
//   // undo
// }

// 页面只要重新显示就加载
// onShow(() => {
//   // getMemberInfoData();
// })

// 充值金额
const rechageNumList = ref([
  { id: 1, num: 1000, text: "1000元" },
  { id: 2, num: 2000, text: "2000元" },
  { id: 3, num: 3000, text: "3000元" },
  { id: 4, num: 4000, text: "4000元" },
  { id: 5, num: 5000, text: "5000元" },
  { id: 6, num: 6000, text: "6000元" },
  { id: 7, num: 7000, text: "7000元" },
  { id: 8, num: 8000, text: "其他金额" }, // 注意这个金额未定，暂时放8000
])

// 向服务器获取最新的用户数据
async function updateUserInfo(){
  const res = await getMyProfileAPI({user_id: myStore.profile!.user_id})
        console.log("获取的用户信息：", res)
        if (0 == res.errcode){
          console.log("获取到最新的用户信息为：", res.data.user_info)
          myStore.setProfile(res.data.user_info)
          // 更新页面
          updateMemberStatus()
        } else {
          uni.showToast({icon: 'none', title: '网络错误~', duration: 2000})
        }
}

// 选择金额充值
async function choiceMoney(num: number) {
  console.log("选择充值金额：", num)
 
   if (!myStore.profile) {  // 未登录，跳转到登录页面
    uni.navigateTo({ url: "/pages/login/login" })
    return
  }
  // 构建余额充值微信支付的预订单信息
  const pre_order_info = {
    payer_id: myStore.profile?.open_id!,
    // order_id: order_id; order_id为服务器自动生成 
    // amount: Math.floor(pay_num * 100 / 10000), // 注意：单位是分。这里为了测试把钱除以1万后变成了分，并做了向下取整
    amount: num * 100,
    // amount: 1,
    description: `用户充值金额：${num}元`,
    attach: "balance_order" // 订单类型
  }
  console.log("pre_order_info: ", pre_order_info)

  const res = await applyRechargeBalanceAPI({wechat_pre_order: pre_order_info})
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
      "success": function(res: any){
        console.log("请求支付成功: ", res)
        
        // 充值成功的结果处理
        updateUserInfo()  // 直接更新用户信息，即可同步结果
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

const memberLevelList = [
  {name: "办飞会员", amount: 3500 * 100},
  {name: "飞速会员", amount: 5000 * 100},
  {name: "飞音速会员", amount: 7500 * 100},
  {name: "飞光速会员", amount: 10000 * 100},
]
let member_id:number;
// 选择充值会员
async function choiceMember(id: number){
  console.log("选择充值的会员为：", memberLevelList[id].name)
  // 未登录
  if (!myStore.profile) {  // 未登录，跳转到登录页面
    uni.navigateTo({ url: "/pages/login/login" })
    return
  }
  member_id = id

  // 根据等级禁用会员充值按钮
  if (member_level.value >= member_id + 1){
    console.log("当前会员级别大于等于选择级别，该选择级别被禁用")
    return
  }

  // 打开充值弹窗
  openPayPopup();
  return
}

// 协议隐私条款
const isAgreement = ref(false)  // 默认同意协议
// 打开协议
function onTapAgreement(){
  // #ifdef MP-WEIXIN
  // 跳转至隐私协议页面
  // wx.openPrivacyContract({})
  // #endif
  console.log("打开协议")
  isAgreement.value=true
  uni.navigateTo({"url": "/pages/agreement/member_agreement"})
}

// 微信支付相关功能
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

  // 构建申请会员微信支付的预订单信息
  const pre_order_info = {
    payer_id: myStore.profile?.open_id!,
    // order_id: order_id; order_id为服务器自动生成 
    // amount: Math.floor(pay_num * 100 / 10000), // 注意：单位是分。这里为了测试把钱除以1万后变成了分，并做了向下取整
    amount: memberLevelList[member_id].amount,
    // amount: 1,
    description: `用户申请：${memberLevelList[member_id].name}`,
    member_type: member_id + 1,
    attach: "member_order" // 订单类型
  }
  console.log("pre_order_info: ", pre_order_info)

  const res = await applyMemberAPI({wechat_pre_order: pre_order_info})
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
      "success": function(res: any){
        console.log("请求支付成功: ", res)
        
        // 充值成功的结果处理
        updateUserInfo()  // 直接更新用户信息，即可同步结果

        uni.showToast({
          icon: 'none',
          title: "支付成功~"
        })

      },
      "fail": function(res: any){
        console.log("请求支付失败: ", res)
        uni.showToast({
          icon: 'none',
          title: "微信支付失败，请稍后重试~"
        })
      },
      "complete": function(res: any){
        console.log("请求支付完成: ", res)
        popup.value?.close()
      },
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

// 支付弹窗类型
const popup = ref<UniHelper.UniPopup>()
function openPayPopup() {
  console.log("打开支付弹窗弹窗")
  popup.value?.open('center')
}


</script>

<template>
    <!-- 顶部的图片 -->
  <view class="page-head-bg" :style="{backgroundImage: `url(${current_head_img})`}" @tap="changeHeadImg">
    <view class="personal-info">
      <view class="balance">余额：{{balance}}元</view>
      <view v-show="lastday" class="member-lastday">折扣权益有效期至：{{ lastday }}</view>
    </view>
    <view class="member_num" v-show="myStore.profile?.member_id">NO.{{ myStore.profile?.member_id }}</view>
  </view>
    <!-- 金额充值区域 -->
  <view class="recharge-container">
    <view class="title">充值金额</view>
    <view class="sum-container">
      <view class="sum499" @tap=choiceMoney(499)></view>
      <view class="sum999" @tap=choiceMoney(999)></view>
      <view class="sum1999" @tap=choiceMoney(1999)></view>
      <view class="sum2999" @tap=choiceMoney(2999)></view>
      <view class="sum3999" @tap=choiceMoney(3999)></view>
      <view class="sum4999" @tap=choiceMoney(4999)></view>
      <view class="sum9999" @tap=choiceMoney(9999)></view>
      <view class="sum19999" @tap=choiceMoney(19999)></view>
    </view>

  </view>
  <!-- 充值入口封面 -->
   <view class="buy-cover-container">
    <view class="banfei">
      <view class="buy-now" :class="member_level >= 1 ? 'ban' : ''" @tap="choiceMember(0)">立即购买</view>
    </view>
    <view class="feisu">
      <view class="buy-now" :class="member_level >= 2 ? 'ban' : ''" @tap="choiceMember(1)">立即购买</view>
    </view>
    <view class="feiyinsu">
      <view class="buy-now" :class="member_level >= 3 ? 'ban' : ''" @tap="choiceMember(2)">立即购买</view>
    </view>
    <view class="feiguangsu">
      <view class="buy-now" :class="member_level >= 4 ? 'ban' : ''" @tap="choiceMember(3)">立即购买</view>
    </view>
   </view>

  <!-- 充值提示弹窗 -->
  <uni-popup ref="popup" type="center">
    <view class="pop-window-container">
      <!-- 支付方式内容容器 -->
        <view class="pay-method-container">
          <!-- <view class="title">支付方式</view> -->
          <view class="pay-method">
            <view class="wechat-pay" @tap="tapWechatPay">微信支付</view>
            <!-- <view class="contact-pay" @tap="tapContactPay">
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
            </view> -->
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
            <text class="link" @tap="onTapAgreement">《折扣权益协议》</text>
            <!-- <navigator class="link" hover-class="none" url="/pages/agreement/order_agreement" @tap="isAgreement=true">《场地使用须知》</navigator> -->
            </view>
          </view>
          
        </view>
    </view>
  </uni-popup>


</template>

<style lang="scss">

page {
  background-color: #f5f5f5;
}

.page-head-bg {
  width: 750rpx;
  height: 410rpx;
  background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/head-bg-not-member.png") bottom center no-repeat;
  background-size: 100% 100%;
  position: relative;
  .personal-info {
    position:absolute;
    left: 30rpx;
    bottom: 85rpx;
    display: flex;
    flex-direction: column;
    justify-content: left;
    color:white;
    font-size: 25rpx;
  }
  .member_num {
    position: absolute;
    right: 20rpx;
    bottom: 108rpx;
    color: white;
    text-align: left;
    font-size: 20rpx;
  }
}

// 金额充值区域
.recharge-container {
  margin-top: -80rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 660rpx;
  height: 380rpx;
  border-radius: 60rpx;
  padding-top: 20rpx;
  box-sizing: border-box;
  background-color: white;

  .title {
    margin-left: 50%;
    transform: translateX(-50%);
    width: 300rpx;
    height: 50rpx;
    text-align: center;
    font-size: 30rpx;
    color:black;
  }
  .sum-container {
    // background-color: skyblue;
    height: 280rpx;
    padding: 0 30rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .sum499{
      width: 133rpx;
      height: 119rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/499.png") bottom center no-repeat;
      background-size: 100% 100%;
    }
    .sum999{
      width: 133rpx;
      height: 119rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/999.png") bottom center no-repeat;
      background-size: 100% 100%;
    }
    .sum1999{
      width: 133rpx;
      height: 119rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/1999.png") bottom center no-repeat;
      background-size: 100% 100%;
    }
    .sum2999{
      width: 133rpx;
      height: 119rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/2999.png") bottom center no-repeat;
      background-size: 100% 100%;
    }
    .sum3999{
      width: 133rpx;
      height: 119rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/3999.png") bottom center no-repeat;
      background-size: 100% 100%;
    }
    .sum4999{
      width: 133rpx;
      height: 119rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/4999.png") bottom center no-repeat;
      background-size: 100% 100%;
    }
    .sum9999{
      width: 133rpx;
      height: 119rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/9999.png") bottom center no-repeat;
      background-size: 100% 100%;
    }
    .sum19999{
      width: 133rpx;
      height: 119rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/19999.png") bottom center no-repeat;
      background-size: 100% 100%;
    }
  }
}

// 充值入口容器
.buy-cover-container  {
  margin-top: 20rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 660rpx;
  height: 1000rpx;
  border-radius: 60rpx;
  // background-color: skyblue;
  padding-bottom: 30rpx;


  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .buy-now {
    position: absolute;
    right: 30rpx;
    bottom: 20rpx;
    width: 200rpx;
    height: 50rpx;
    border-radius: 25rpx;
    background-color: white;
    color: red;
    text-align: center;
    line-height: 50rpx;
    font-size: 20rpx;
  }

  // 禁用样式
  .ban {
    color: #c4c4c4;
  }

  .banfei {
    position: relative;
    width: 660rpx;
    height: 235rpx;
    background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/buy-cover-banfei-member.png") bottom center no-repeat;
    background-size: 100% 100%;
  }
  .feisu {
    position: relative;
    width: 660rpx;
    height: 235rpx;
    background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/buy-cover-feisu-member.png") bottom center no-repeat;
    background-size: 100% 100%;
  }
  .feiyinsu {
    position: relative;
    width: 660rpx;
    height: 235rpx;
    background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/buy-cover-feiyinsu-member.png") bottom center no-repeat;
    background-size: 100% 100%;
  }
  .feiguangsu {
    position: relative;
    width: 660rpx;
    height: 235rpx;
    background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/member/buy-cover-feiguangsu-member.png") bottom center no-repeat;
    background-size: 100% 100%;
  }

}

// 充值提示弹窗
.pop-window-container {
  // position: absolute;
  // top: 20rpx;
  // margin-left: 50%;
  // transform: translateX(-50%);
  width: 700rpx;
  // height: 500rpx;
  height: 350rpx;
  border-radius: 30rpx;
  background-color: white;

  // 支付方式内容容器
  .pay-method-container {
    position: absolute;
    top: 50rpx;

    margin-left: 50%;
    transform: translateX(-50%);
    width: 600rpx;
    height: 300rpx;
    // background-color: pink;
    .title {
      font-size: 40rpx;
      color: black;
    }
    .pay-method{
      margin-top: 20rpx;
      width: 100%;
      // height: 280rpx;
      height: 140rpx;
      // background-color: skyblue;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .wechat-pay {
        width: 100%;
        height: 120rpx;
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

</style>