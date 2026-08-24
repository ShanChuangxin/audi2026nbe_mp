<!-- TabBar我的 -->

<script setup lang="ts">
import { useMyStore } from '@/stores'


// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 订单选项
// 定义这个结构，既可以用于显示文字和图标，还可以跳转页面时进行传参
const orderTypes = [
  { type: '1', text: '待支付', icon: 'icon-currency' },
  { type: '2', text: '待使用', icon: 'icon-gift' },
  { type: '3', text: '已完成', icon: 'icon-check' },
  { type: '4', text: '待取消', icon: 'icon-comment' },
]
// 获取会员信息
const myStore = useMyStore()

// 订单跳转
function onTapOrder(num: string) {
  console.log(num)
  if (!myStore.profile) {  // 未登录，跳转到登录页面
    uni.navigateTo({ url: "/pages/login/login" })
  }
  // 带参跳转到订单页面（TabBar）
  uni.switchTab({ url: `/pages/order_list/order_list?id=${num}` })

}


</script>

<template>
  <!-- 个人资料 -->
  <view class="profile" :style="{ paddingTop: safeAreaInsets!.top + 'px' }">
    <!-- 情况1：已登录 -->
    <!-- 通过判断本地存储里的profile是否为空来判断是否已经登录了 -->
    <view class="overview" v-if="myStore.profile">
      <!-- 这是的导航是跳转到个人信息设置页面 -->
      <navigator url="/pages/profile/profile" hover-class="none">
        <image class="avatar" :src="myStore.profile.avatar!" mode="aspectFill"></image>
      </navigator>
      <view class="meta">
        <view class="nickname">
          <!-- 通过短路运算实现：如果有用户昵称则显示用户昵称，如果没有(比如新用户未来得及设置)，则显示账号 -->
          {{ myStore.profile.nickname || myStore.profile.account }}
        </view>
        <!-- 点击昵称也是跳转到个人信息页面 -->
        <navigator class="extra" url="/pages/profile/profile" hover-class="none">
          <text class="update">更新头像昵称</text>
        </navigator>
      </view>
    </view>
    <!-- 情况2：未登录 -->
    <view class="overview" v-else>
      <!-- 未登录时如果被点击则跳转到登录界面 -->
      <navigator url="/pages/login/login" hover-class="none">
        <image class="avatar gray" mode="aspectFill"
          src="https://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/picture/2021-04-06/db628d42-88a7-46e7-abb8-659448c33081.png">
        </image>
      </navigator>
      <view class="meta">
        <navigator url="/pages/login/login" hover-class="none" class="nickname">
          未登录
        </navigator>
        <view class="extra">
          <text class="tips">点击登录账号</text>
        </view>
      </view>
    </view>
  </view>

  <!-- 我的订单 -->
  <view class="orders">
    <view class="title">
      我的订单
      <view class="navigator" @tap="onTapOrder('0')" hover-class="none">
        查看全部订单<text class="icon-right"></text>
      </view>
    </view>
    <view class="section">
      <!-- 订单 -->
      <view v-for="item in orderTypes" :key="item.type" :class="item.icon" @tap="onTapOrder(item.type)"
        class="navigator" hover-class="none">
        {{ item.text }}
      </view>
      <!-- 客服 -->
      <!-- #ifdef MP-WEIXIN -->
      <!-- <button class="contact icon-handset" open-type="contact">售后</button> -->
      <!-- #endif -->
    </view>
  </view>

  <!-- 个人中心面板页面 -->
  <view class="func-container">
    <!-- 我的收藏 -->
    <navigator url="/pages/collect/collect" open-type="navigate" hover-class="none">
      我的收藏
    </navigator>

    <!-- 我参与的 -->
    <navigator url="/pages/involve_list/involve_list" open-type="navigate" hover-class="none">
      我参与的
    </navigator>

    <!-- 联系客服 -->
    <navigator url="/pages/contact_staff/contact_staff" open-type="navigate" hover-class="none">
      联系客服
    </navigator>

    <!-- 我的推广 -->
    <navigator url="/pages/promotion/promotion" open-type="navigate" hover-class="none">
      我的推广
    </navigator>

  </view>

</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #f7f7f8;
}

/* 用户信息 */
.profile {
  margin-top: 30rpx;
  position: relative;

  .overview {
    display: flex;
    height: 120rpx;
    padding: 0 36rpx;
    color: #fff;
  }

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .gray {
    filter: grayscale(100%);
  }

  .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    line-height: 30rpx;
    padding: 16rpx 0;
    margin-left: 20rpx;
  }

  .nickname {
    max-width: 180rpx;
    margin-bottom: 16rpx;
    font-size: 30rpx;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .extra {
    display: flex;
    font-size: 20rpx;
  }

  .tips {
    font-size: 22rpx;
  }

  .update {
    padding: 3rpx 10rpx 1rpx;
    color: rgba(255, 255, 255, 0.8);
    border: 1rpx solid rgba(255, 255, 255, 0.8);
    margin-right: 10rpx;
    border-radius: 30rpx;
  }

  .settings {
    position: absolute;
    bottom: 0;
    right: 40rpx;
    font-size: 30rpx;
    color: #fff;
  }
}

/* 我的订单 */
.orders {
  position: relative;
  z-index: 99;
  padding: 30rpx;
  margin: 50rpx 20rpx 0;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);

  .title {
    height: 40rpx;
    line-height: 40rpx;
    font-size: 28rpx;
    color: #1e1e1e;

    .navigator {
      font-size: 24rpx;
      color: #939393;
      float: right;
    }
  }
}

// 个人中心面板</style>