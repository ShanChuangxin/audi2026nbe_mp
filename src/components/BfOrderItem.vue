<!-- 场地项入口 -->
<script setup lang="ts">

import {computed } from 'vue';
import type { OrderInfoType } from '@/types/order'
import { delOrderAPI } from '@/services/order'

import { useMyStore } from '@/stores';

// 定义Props接收参数
const props = defineProps<{
    order_info: OrderInfoType;
    updateOrderList: Function;
}>()

const myStore = useMyStore()

// 计算属性用于显示参与码的状态
const order_status = computed(() => {
    let now = Math.floor(Date.now() / 1000);    // 精确到秒
//   console.log("--------------------")
//   console.log("当前时间戳：", now)
//   console.log("起始时间戳：", props.ticket_info.time_node_start)
//   console.log("结束时间戳：", props.ticket_info.time_node_end)
    if (1 == props.order_info.order_status){
        return "待支付"
    }
    else if (now >= props.order_info.end_time){
    // console.log("已结束")
        return "已完成";
    } else if (now <= props.order_info.start_time){
    // console.log("进行中")
        return "未开始";
    }
    else {
    // console.log("未开始")
        return "进行中";
    }
});

// 删除订单功能
async function onTapDelOrder() {
    console.log("点击了删除订单")

    const res = await delOrderAPI({user_id: myStore.profile?.user_id!, order_id: props.order_info.order_id!})
    console.log("订单删除结果：", res)
    if (0 == res.errcode){
        // 调用父组件更新订单列表
        props.updateOrderList()
    } else {
        uni.showToast({icon: 'none', title: '网络错误~', duration: 2000})
    }
}
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
            <view class="time-container">
                <view class="title">日期</view>
                <view class="time">{{ order_info.date }}</view>
            </view>
            <view class="status-container">
                <view class="title">状态</view>
                <!-- <view class="status-text">{{ 1 == order_info.order_status ? "待支付" : (2 == order_info.order_status ? "待使用" : "已完成") }}</view> -->
                <view class="status-text">{{ order_status }}</view>
            </view>
            <view class="btn-container">
                <view v-if="1 == order_info.order_status" @tap.stop="onTapDelOrder">删除订单</view>
                <view v-if="2 == order_info.order_status" @tap.stop> 取消预约
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
        </view>
    </navigator>
</template>

<style lang="scss">
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
                width: 100%;
                height: 100%;
            }
        }

        .info-container {
            margin-left: 10rpx;
            display: inline-block;
            width: 405rpx;
            height: 120rpx;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;

            .office-name {
                width: 100%;
                height: 50rpx;
                font-size: 30rpx;
                font-weight: 600;
                text-align: left;
                color: black;
            }
            .room-num {
                width: 100%;
                height: 50rpx;
                font-size: 20rpx;
                text-align: left;
                color: black;
                display: flex;

                &:before {
                    margin-right: 10rpx;
                    content: '';
                    width: 20rpx;
                    height: 30rpx;
                    background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order_list/icon-room.png") top center no-repeat;
                    background-size: 100% 100%;
                }
            }
            .office-address {
                width: 100%;
                height: 50rpx;
                font-size: 20rpx;
                text-align: left;
                color: black;
                display: flex;

                &:before {
                    margin-right: 8rpx;
                    content: '';
                    width: 23rpx;
                    height: 26rpx;
                    background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/order_list/icon-location.png") top center no-repeat;
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
                position: relative;
                width: 100%;
                height: 55rpx;
                border-radius: 10rpx;
                background-color: #cc5872;
                text-align: center;
                line-height: 55rpx;
                color: white;
                font-size: 20rpx;

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
    }


}
</style>