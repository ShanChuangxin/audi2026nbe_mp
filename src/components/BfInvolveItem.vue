<!-- 我参与项入口 -->
<script setup lang="ts">

import {computed, onMounted } from 'vue';
// import type { AccessTicketType } from '@/types/access_ticket'
import { getInvolveListAPI } from '@/services/access_ticket'
import type { OrderInfoType } from '@/types/order'
import { ref } from 'vue';
import { useMyStore } from '@/stores/modules/my'
import { getOrderDetailAPI } from '@/services/order'

// 定义Props接收参数
const props = defineProps<{ // 定义变量接收，后续可以在js中继续使用
    involve_id: string;
}>()

const myStore = useMyStore()

// 获取订单详情
const order_info = ref<OrderInfoType>({} as OrderInfoType)
const getOrderInfoData = async () => {
  console.log(props.involve_id)
  if (props.involve_id) {
      // const res = await getOrderDetailAPI({ user_id: "1234", order_id: query.order_id })
      const res = await getOrderDetailAPI({ user_id: myStore.profile!.user_id, order_id: props.involve_id })
      console.log("获取到的订单信息为：", res)
      if (0 == res.errcode){
        order_info.value = res.data.order
      } else {
        // 提示加载失败
        console.log("加载失败")
        uni.showToast({
          icon: 'none',
          title: "网络错误，请稍后重试~"
        })
      }

    }     
}

// 进入页面加载订单详情
onMounted(() => {
  console.log("query中的order_id为：", props.involve_id)
  getOrderInfoData()  // 获取订单详情
})


// 计算属性用于显示时间段的起始时间和结束时间
const start_time = computed(() => {
    const timestamp = order_info.value.start_time * 1000;
    const date = new Date(timestamp)
    // 获取时分
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formatTime = `${hours}:${minutes}`
    return formatTime
})
const end_time = computed(() => {
    const timestamp = (order_info.value.end_time + 1)* 1000;
    const date = new Date(timestamp)
    // 获取时分
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formatTime = `${hours}:${minutes}`
    return formatTime
})

// 计算属性用于显示参与码的状态
const involve_status = computed(() => {
  let now = Math.floor(Date.now() / 1000);    // 精确到秒
//   console.log("--------------------")
//   console.log("当前时间戳：", now)
//   console.log("起始时间戳：", props.ticket_info.time_node_start)
//   console.log("结束时间戳：", props.ticket_info.time_node_end)
  if (now >= order_info.value.end_time){
    // console.log("已结束")
    return "已结束";
  } else if (now <= order_info.value.start_time){
    // console.log("进行中")
    return "未开始";
  }
  else {
    // console.log("未开始")
    return "进行中";
  }
});


</script>

<template>
    <navigator :url="`/pages/order_detail/order_detail?order_id=${order_info.order_id}`" open-type="navigate"
        hover-class="navigator-hover" class="order-item">
        <!-- 会议室信息区域 -->
        <view class="office-info-container">
            <view class="office-cover">
                <image :src="order_info.office_info?.office_cover" mode="scaleToFill" />
            </view>
            <view class="info-container">
                <view class="office-name">{{ order_info.office_info?.building_name }}</view>
                <view class="room-num">房号: {{ order_info.office_info?.office_name }}</view>
                <view class="office-address">{{ order_info.office_info?.address }}</view>
            </view>
        </view>
        <!-- 订单信息区域 -->
        <view class="order-info-container">
            <view class="date-container">
                <view class="title">日期</view>
                <view class="time">{{ order_info.date }}</view>
            </view>
            <view class="time-container">
                <view class="title">时间</view>
                <view class="time">{{ start_time }}-{{ end_time }}</view>
            </view>
            <view class="status-container">
                <view class="title">状态</view>
                <view class="status-text">{{ involve_status }}</view>
            </view>
             
        </view>
    </navigator>
</template>

<style lang="scss" scoped>
// 会议室项
.order-item {
    margin: 20rpx 0;
    margin-left: 50%;
    transform: translateX(-50%);
    border: solid 2rpx #e3e3e3;
    border-radius: 20rpx;
    width: 600rpx;
    height: 300rpx;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    // 会议室信息区域
    .office-info-container {
        width: 550rpx;
        height: 150rpx;
        // padding-top: 30rpx;
        // background-color: pink;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .office-cover {
            width: 214rpx;
            height: 120rpx;
            image {
                width:100%;
                height: 100%;
                // display: inline-block;                
                // vertical-align: middle;
            }
        }
        

        .info-container {
            // background-color: skyblue;
            margin-left: 10rpx;
            display: inline-block;
            width: 405rpx;
            height: 120rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;

            .office-name {
                width: 100%;
                height: 50rpx;
                font-size: 30rpx;
                font-weight: 600;
                text-align: left;
                color: black;
            }

            .room-num {
                margin-top: 5rpx;
                font-size: 20rpx;
                font-weight: 600;
                color: black;
                display: flex;
                align-items: center;

                &:before {
                    margin-left: 5rpx;
                    margin-right: 15rpx;
                    content: '';
                    width: 20rpx;
                    height: 30rpx;
                    background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/icon-room.png") top center no-repeat;
                    background-size: 100% 100%;
                }
            }

            .office-address {
                margin-top: 5rpx;
                width: 100%;
                height: 50rpx;
                font-size: 20rpx;
                text-align: left;
                color: #787878;
                display: flex;

                &:before {
                    margin-right: 8rpx;
                    content: '';
                    width: 26rpx;
                    height: 30rpx;
                    background: url("https://www.1024.art/projects/mbcstyle_mock/static/images/order_list/icon-location.png") top center no-repeat;
                    background-size: 100% 100%;
                }
            }
        }

    }

    // 订单信息区域
    .order-info-container {
        width: 550rpx;
        height: 150rpx;
        // background-color: skyblue;
        border-top: dashed 2rpx #e3e3e3;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .date-container {
            width: 150rpx;
            height: 50%;
            // background-color: pink;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .title {
                width: 100%;
                height: 50%;
                text-align: left;
                font-size: 20rpx;
                color: #a7adc0;
            }

            .time {
                width: 100%;
                height: 50%;
                font-size: 20rpx;
                color: black;
            }
        }
        .time-container {
            width: 150rpx;
            height: 50%;
            // background-color: pink;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .title {
                width: 100%;
                height: 50%;
                text-align: left;
                font-size: 20rpx;
                color: #a7adc0;
            }

            .time {
                width: 100%;
                height: 50%;
                font-size: 20rpx;
                color: black;
            }
        }

        .status-container {
            width: 100rpx;
            height: 50%;

            .title {
                width: 100%;
                height: 50%;
                text-align: left;
                font-size: 20rpx;
                color: #a7adc0;
            }

            .status-text {
                width: 100%;
                height: 50%;
                font-size: 20rpx;
                color: #5ecd6e;
            }
        }

        .btn-container {
            width: 150rpx;
            height: 100%;
            // background-color: pink;
            display: flex;
            justify-content: center;
            align-items: center;

            view {
                width: 100%;
                height: 55rpx;
                border-radius: 10rpx;
                background-color: #cc5872;
                text-align: center;
                line-height: 55rpx;
                color: white;
                font-size: 20rpx;
            }
        }
    }
}
</style>