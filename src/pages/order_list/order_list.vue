<!-- TabBar订单列表页面 -->

<script setup lang="ts">
import { ref } from 'vue';
import type { OrderInfoType } from '@/types/order'
import { useMyStore } from '@/stores'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getOrderListAPI } from '@/services/order'

const myStore = useMyStore()

// 加载订单列表
let allOrderList = [] as OrderInfoType[]  // 所有订单列表
let waitPayOrderList = [] as OrderInfoType[]  // 待支付的订单列表
let waitUseOrderList = [] as OrderInfoType[]  // 持使用的订单列表
let finishOrderList = []  as OrderInfoType[]  // 已完成的订单列表
const orderList = ref([] as OrderInfoType[]) // 需要展示的订单列表
function initOrderListData() {
  allOrderList = []
  waitPayOrderList = []
  waitUseOrderList = []
  finishOrderList = []
  orderList.value = []
  selectedMenu.value = 1 // 初始化菜单选择
}
const getOrderListData = async () => {
  if (myStore.profile){
    const res = await getOrderListAPI({user_id: myStore.profile.user_id})
    console.log("获取到的订单列表信息为：", res)
    if (0 == res.errcode){
      // 初始化所有的订单维护
      initOrderListData()
      // waitPayOrderList = []
      // waitUseOrderList = []
      // finishOrderList = []

      allOrderList = res.data.order_list  // 所有订单的列表

      // 为各订单列表赋值
      for(let i = 0; i < allOrderList.length; ++i){
        if (1 == allOrderList[i].order_status){ // 待支付
          waitPayOrderList.push(allOrderList[i])
        } else if(4 == allOrderList[i].order_status){  // 已取消
            // 已取消的订单什么都不需要做
        } else {
          const currentTimestamp = Math.floor(Date.now() / 1000); // 当前时间戳
          if (currentTimestamp >= allOrderList[i].end_time){  // 注意这里是自行判断订单状态了，服务器需要更新订单状态的
            finishOrderList.push(allOrderList[i])
          } else {
            waitUseOrderList.push(allOrderList[i])  // 待使用包括了正在使用的过程
          }
        }
      }

      orderList.value = waitPayOrderList  // 默认是显示待支付订单列表

    } else {
      uni.showToast({icon: 'none', title: '网络错误~', duration: 2000})
    }
  } else {
    // 初始化所有的订单维护
    initOrderListData()
    // allOrderList = []
    // waitPayOrderList = []
    // waitUseOrderList = []
    // finishOrderList = []
    // orderList.value = []
    // selectedMenu.value = 1 // 初始化菜单选择
  }
}

onShow(()=>{
  getOrderListData()
})


const selectedMenu = ref(1) // 用户点击的菜单，0为全部(目前没有)，1为待支付，2为待使用，3为已完成
// 选择订单状态（更换选中的tab）
function onTapMenu(num: number) {
  selectedMenu.value = num
  // 切换订单列表
  if (1 == num) { // 待支付
    orderList.value = waitPayOrderList  
  } else if (2 == num) {  // 待使用
    orderList.value = waitUseOrderList
  } else if (3 == num) {
    orderList.value = finishOrderList
  }
}


// 测试数据
let order = {
  order_id: "1234",
  order_status: '2',
  create_time: '2024年10月10日',
  use_time: '2024年10月15日',
  office_name: "北京环球金融中心",
  office_thumbnail: "https://www.mbcstyle.cn/projects/mbc-mock/office_list/officelist-thumb.png",
  office_address: "北京市朝阳区东三环中路1号"

}

</script>

<template>
  <!-- 头部图片 -->
  <view class="head-bg"></view>

  <!-- 菜单项 -->
  <view class="menu-container">
    <!-- 待支付 -->
    <view class="unpaid-container" :class="1 == selectedMenu ? 'title-selected' : 'title-default'" @tap="onTapMenu(1)">
      <image src="https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order_list/icon-unpaid.png"
        mode="scaleToFill" />
      <view class="title">待支付</view>
    </view>
    <!-- 待使用 -->
    <view class="wait-use-container" :class="2 == selectedMenu ? 'title-selected' : 'title-default'"
      @tap="onTapMenu(2)">
      <image src="https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order_list/icon-wait-use.png"
        mode="scaleToFill" />
      <view class="title">待使用</view>
    </view>
    <!-- 已完成 -->
    <view class="done-container" :class="3 == selectedMenu ? 'title-selected' : 'title-default'" @tap="onTapMenu(3)">
      <image src="https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order_list/icon-done.png"
        mode="scaleToFill" />
      <view class="title">已完成</view>
    </view>

  </view>

  <!-- 订单容器 -->
  <view class="order-container">
    <view class="scroll-container">
      <scroll-view scroll-y>

        <view v-if="!myStore.profile" class="tips"> - 未登录 - </view>
        <view v-else-if="orderList.length == 0" class="tips"> - 暂无订单 - </view>
        <BfOrderItem v-else="orderList.length " v-for="item in orderList" :key="item.order_id" :order_info="item" :updateOrderList="getOrderListData"></BfOrderItem>
        <!-- <BfOrderItem :order_info="order"></BfOrderItem>
        <BfOrderItem :order_info="order"></BfOrderItem>
        <BfOrderItem :order_info="order"></BfOrderItem>
        <BfOrderItem :order_info="order"></BfOrderItem>
        <BfOrderItem :order_info="order"></BfOrderItem>
        <BfOrderItem :order_info="order"></BfOrderItem> -->

      </scroll-view>
    </view>

  </view>

</template>

<style lang="scss">
page {
  background-color: #f5f5f5;
}

// 头部图片
.head-bg {
  width: 750rpx;
  height: 410rpx;
  background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order_list/head-img.png") top center no-repeat;
  background-size: 100% 100%;
}

// 菜单项容器
.menu-container {
  margin-top: -90rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 660rpx;
  height: 200rpx;
  border-radius: 60rpx;
  background-color: white;

  display: flex;
  justify-content: space-between;
  align-items: center;

  // 未选中
  .title-default {
    color: black;
  }

  // 已选中
  .title-selected {
    color: #d34364;
  }

  // 待支付容器
  .unpaid-container {
    width: 220rpx;
    height: 150rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    image {
      width: 72rpx;
      height: 72rpx;
    }

    .title {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 25rpx;
    }
  }

  // 待使用容器
  .wait-use-container {
    width: 220rpx;
    height: 150rpx;
    border: solid 1rpx #f5f5f5;
    border-top: none;
    border-bottom: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    image {
      width: 72rpx;
      height: 72rpx;
    }

    .title {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 25rpx;
    }
  }

  // 已完成容器
  .done-container {
    width: 220rpx;
    height: 150rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    image {
      width: 72rpx;
      height: 72rpx;
    }

    .title {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 25rpx;
    }
  }


}

// 订单容器
.order-container {
  margin-top: 20rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  padding-top: 20rpx;
  width: 660rpx;
  height: 800rpx;
  border-radius: 60rpx;
  background-color: white;

  .scroll-container {
    margin-top: 10rpx;
    padding-bottom: 20rpx;
    width: 640rpx;
    height: 780rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    // background-color: pink;
    overflow: hidden;

    // 滚动容器
    scroll-view {
      width: 100%;
      height: 100%;

      // 文字提示
      .tips {
        margin-top: 30rpx;
        text-align: center;
        font-size: 30rpx;
        color: #6c6c6c;
      }
    }
  }



}
</style>