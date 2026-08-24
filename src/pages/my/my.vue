<!-- TabBar我的 -->
<script setup lang="ts">

import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app'
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

// 存储好像本身就是响应式数据，不需要重复刷新
// onShow(()=>{
//   console.log("进入my页面")
//   console.log(myStore.profile)
// })

// 我的订单跳转
function onTapOrder() {
  console.log("点击了我的订单")
  if (!myStore.profile) {  // 未登录，跳转到登录页面
    uni.navigateTo({ url: "/pages/login/login" })
    return
  }
  // 带参跳转到订单页面（TabBar）
  uni.switchTab({ url: '/pages/order_list/order_list' })
}

// 我的收藏跳转
function onTapCollect() {
  console.log("点击了我的收藏")
  if (!myStore.profile) {  // 未登录，跳转到登录页面
    uni.navigateTo({ url: "/pages/login/login" })
    return
  }
  // 带参跳转到订单页面（TabBar）
  uni.navigateTo({ url: '/pages/collect_list/collect_list' })
}

// 我参与的跳转
function onTapInvolve() {
  console.log("点击了我参与的")
  if (!myStore.profile) {  // 未登录，跳转到登录页面
    uni.navigateTo({ url: "/pages/login/login" })
    return
  }
  uni.navigateTo({ url: '/pages/involve_list/involve_list' })
}

// 联系客服
function onTapContactStaff() {
  console.log("点击了联系客服")
  return
  if (!myStore.profile) {  // 未登录，跳转到登录页面
    uni.navigateTo({ url: "/pages/login/login" })
    return
  }
  // 带参跳转到订单页面（TabBar）
  uni.switchTab({ url: '/pages/order_list/order_list' })
}

// 个人设置
function onTapSetting() {
  console.log("点击了个人设置")
  // return
  if (!myStore.profile) {  // 未登录，跳转到登录页面
    uni.navigateTo({ url: "/pages/login/login" })
    return
  }
  // 跟转到个人设置页面
  uni.navigateTo({ url: '/pages/profile/profile' })
}

// 用于debug测试退出
function onTapLogo() {
  console.log("点击了logo")
  myStore.clearProfile()
}

</script>

<template>
  <!-- 个人资料 -->
  <view class="page-head-bg">
    <view class="profile-container">
      <!-- 用户信息 -->
      <view class="profile-info" @tap="onTapSetting">
        <view class="head-container">
          <image :src="myStore.profile ? myStore.profile.avatar : 'https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/common/logout-avatar.png'" mode="scaleToFill" />
        </view>
        <view class="info-container">
          <view class="nick-name">{{ myStore.profile ? myStore.profile.nick_name : "未登录" }}</view>
          <view class="position">{{ myStore.profile?.company }}</view>
        </view>
      </view>
      <!-- 办飞中心的logo -->
      <view class="mbc-center" @tap="onTapLogo"></view>
    </view>

  </view>
  <!-- 账户信息 -->
  <view class="account-container">
    <view class="balance-container">
      <view class="balance">{{ myStore.profile ? Math.floor(myStore.profile.account_balance!) : 0 }}</view>
      <view class="title">账户余额</view>
    </view>
    <view class="ticket-container">
      <view class="ticket">{{ myStore.profile ? myStore.profile.discount_tickt : 0 }}</view>
      <view class="title">优惠券</view>
    </view>
    <view class="score-container">
      <view class="score">{{ myStore.profile ? myStore.profile.score : 0 }}</view>
      <view class="title">积分</view>
    </view>
  </view>
  <!-- 功能菜单 -->
  <view class="panel-container">
    <!-- 我的订单 -->
    <view @tap="onTapOrder" class="my-order-container">
      <view class="icon"></view>
      <view class="text">我的订单</view>
      <view class="arrow"></view>
    </view>
    <!-- 我的收藏 -->
    <view @tap="onTapCollect" class="my-favorite-container">
      <view class="icon"></view>
      <view class="text">我的收藏</view>
      <view class="arrow"></view>
    </view>
    <!-- 我参与的 -->
    <view @tap="onTapInvolve" class="my-involve-container">
      <view class="icon"></view>
      <view class="text">我参与的</view>
      <view class="arrow"></view>
    </view>
    <!-- 联系客服 -->
    <view @tap="onTapContactStaff" class="contact-staff-container">
      <view class="icon"></view>
      <view class="text">联系客服</view>
      <view class="arrow"></view>
      <button
            open-type="contact"
            session-from="微信客服123"
            send-message-title="当前标题"
            send-message-path="当前分享路径"
            send-message-img="截图"
            show-message-card="false"
            @contact=""
            @click="onTapContactStaff"
          >      
          </button>
    </view>
    
    <!-- 设置 -->
    <view @tap="onTapSetting" class="setting-container">
      <view class="icon"></view>
      <view class="text">个人设置</view>
      <view class="arrow"></view>
    </view>

    <!-- 关注公众号 -->
    <view class="official-account">
      <!-- <view class="icon"></view>
      <view class="text">关注公众号</view>
      <view class="arrow"></view> -->
      <official-account></official-account>
    </view>

    
  </view>


</template>

<style lang="scss">

page {
  background-color: #f5f5f5;
}

/* 用户信息 */
.page-head-bg {
  width: 750rpx;
  height: 410rpx;
  background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/profile-bg.png") bottom center no-repeat;
  background-size: 100% 100%;
  position: relative;

  .profile-container {
    position: relative;
    padding-top: 80rpx;
    width: 650rpx;
    height: 180rpx;
    margin-left: 50%;
    transform: translateX(-50%);

    // 用户信息
    .profile-info {
      width: 500rpx;
      height: 200rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .head-container {
        width: 150rpx;
        height: 150rpx;
        border: solid 2px white;
        border-radius: 100rpx;
        overflow: hidden;
        background-color: white;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .info-container {
        margin-left: 20rpx;
        width: 300rpx;
        height: 120rpx;
        display: flex;
        flex-direction: column;

        .nick-name {
          font-size: 40rpx;
        }

        .position {
          font-size: 30rpx;
        }

      }
    }

    // 办飞中心的logo
    .mbc-center {
      position: absolute;
      right: 0rpx;
      bottom: 0rpx;
      width: 180rpx;
      height: 75rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/mbc-center-logo.png") bottom center no-repeat;
      background-size: 100% 100%;
    }
  }
}

// 账户信息
.account-container {
  margin-top: -100rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 660rpx;
  height: 200rpx;
  border-radius: 60rpx;
  background-color: white;

  display: flex;
  justify-content: space-between;
  align-items: center;

  // 余额容器
  .balance-container {
    width: 220rpx;
    height: 150rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .balance {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 30rpx;
      color: red;
    }

    .title {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 25rpx;
      color: black;
    }
  }

  // 优惠券容器
  .ticket-container {
    width: 220rpx;
    height: 150rpx;
    border: solid 1rpx #f5f5f5;
    border-top: none;
    border-bottom: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .ticket {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 30rpx;
      color: red;
    }

    .title {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 25rpx;
      color: black;
    }
  }

  // 积分容器
  .score-container {
    width: 220rpx;
    height: 150rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .score {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 30rpx;
      color: red;
    }

    .title {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 25rpx;
      color: black;
    }
  }
}

// 功能菜单
.panel-container {
  margin-top: 20rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 660rpx;
  height: 580rpx;

  // 我的订单
  .my-order-container {
    margin-bottom: 15rpx;
    width: 100%;
    height: 100rpx;
    border-radius: 40rpx;
    background-color: white;

    .icon {
      margin: 15rpx 15rpx 15rpx 40rpx;
      display: inline-block;
      width: 70rpx;
      height: 70rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/icon-order.png") top center no-repeat;
      background-size: 100% 100%;
      vertical-align: middle; // 该父物体下所有的子元素都需要加上这个
    }

    .text {
      display: inline-block;
      width: 210rpx;
      height: 100rpx;
      line-height: 100rpx;
      vertical-align: middle; // 该父物体下所有的子元素都需要加上这个
    }

    .arrow {
      float: right;
      margin: 42.5rpx 40rpx;
      width: 15rpx;
      height: 15rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/arrow.png") top center no-repeat;
      background-size: 100% 100%;
    }
  }

  // 我的收藏
  .my-favorite-container {
    margin-bottom: 15rpx;
    width: 100%;
    height: 100rpx;
    border-radius: 40rpx;
    background-color: white;

    .icon {
      margin: 15rpx 15rpx 15rpx 40rpx;
      display: inline-block;
      width: 70rpx;
      height: 70rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/icon-favorite.png") top center no-repeat;
      background-size: 100% 100%;
      vertical-align: middle; // 该父物体下所有的子元素都需要加上这个
    }

    .text {
      display: inline-block;
      width: 210rpx;
      height: 100rpx;
      line-height: 100rpx;
      vertical-align: middle; // 该父物体下所有的子元素都需要加上这个
    }

    .arrow {
      float: right;
      margin: 42.5rpx 40rpx;
      width: 15rpx;
      height: 15rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/arrow.png") top center no-repeat;
      background-size: 100% 100%;
    }
  }

  // 我参与的
  .my-involve-container {
    margin-bottom: 15rpx;
    width: 100%;
    height: 100rpx;
    border-radius: 40rpx;
    background-color: white;

    .icon {
      margin: 15rpx 15rpx 15rpx 40rpx;
      display: inline-block;
      width: 70rpx;
      height: 70rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/icon-involve.png") top center no-repeat;
      background-size: 100% 100%;
      vertical-align: middle; // 该父物体下所有的子元素都需要加上这个
    }

    .text {
      display: inline-block;
      width: 210rpx;
      height: 100rpx;
      line-height: 100rpx;
      vertical-align: middle; // 该父物体下所有的子元素都需要加上这个
    }

    .arrow {
      float: right;
      margin: 42.5rpx 40rpx;
      width: 15rpx;
      height: 15rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/arrow.png") top center no-repeat;
      background-size: 100% 100%;
    }
  }

  // 联系客服
  .contact-staff-container {
    position:relative;
    margin-bottom: 15rpx;
    width: 100%;
    height: 100rpx;
    border-radius: 40rpx;
    background-color: white;

    .icon {
      margin: 15rpx 15rpx 15rpx 40rpx;
      display: inline-block;
      width: 70rpx;
      height: 70rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/icon-contact-staff.png") top center no-repeat;
      background-size: 100% 100%;
      vertical-align: middle; // 该父物体下所有的子元素都需要加上这个
    }

    .text {
      display: inline-block;
      width: 210rpx;
      height: 100rpx;
      line-height: 100rpx;
      vertical-align: middle; // 该父物体下所有的子元素都需要加上这个
    }

    .arrow {
      float: right;
      margin: 42.5rpx 40rpx;
      width: 15rpx;
      height: 15rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/arrow.png") top center no-repeat;
      background-size: 100% 100%;
    }
    // 把按钮以绝对定位的形式盖在了上边，并且设置透明度为0，这样就解决了按钮标签中要放其它标签可能会出现样式难处理的问题
    button {
      position: absolute;
      top: 0rpx;
      left: 0rpx;
      width: 100%;
      height: 100%;
      background-color: pink;
      opacity: 0; // 透明度设置为0
    }
  }

  

  // 设置
  .setting-container {
    margin-bottom: 15rpx;
    width: 100%;
    height: 100rpx;
    border-radius: 40rpx;
    background-color: white;

    .icon {
      margin: 15rpx 15rpx 15rpx 40rpx;
      display: inline-block;
      width: 70rpx;
      height: 70rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/icon-setting.png") top center no-repeat;
      background-size: 100% 100%;
      vertical-align: middle; // 该父物体下所有的子元素都需要加上这个
    }

    .text {
      display: inline-block;
      width: 210rpx;
      height: 100rpx;
      line-height: 100rpx;
      vertical-align: middle; // 该父物体下所有的子元素都需要加上这个
    }

    .arrow {
      float: right;
      margin: 42.5rpx 40rpx;
      width: 15rpx;
      height: 15rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/arrow.png") top center no-repeat;
      background-size: 100% 100%;
    }
  }

  // 关注公众号
  .official-account {
    position: relative;
    margin-bottom: 15rpx;
    width: 100%;
    height: 100rpx;
    border-radius: 40rpx;
    background-color: white;

    .icon {
      margin: 15rpx 15rpx 15rpx 40rpx;
      display: inline-block;
      width: 70rpx;
      height: 70rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/icon-official-account.png") top center no-repeat;
      background-size: 100% 100%;
      vertical-align: middle; // 该父物体下所有的子元素都需要加上这个
    }

    .text {
      display: inline-block;
      width: 210rpx;
      height: 100rpx;
      line-height: 100rpx;
      vertical-align: middle; // 该父物体下所有的子元素都需要加上这个
    }

    .arrow {
      float: right;
      margin: 42.5rpx 40rpx;
      width: 15rpx;
      height: 15rpx;
      background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/arrow.png") top center no-repeat;
      background-size: 100% 100%;
    }
    official-account{
      position: absolute;
      top: 0rpx;
      left: 0rpx;
      width: 100%;
      height: 100%;
    }
  }  

}
</style>