<!-- 场地项入口 -->
<script setup lang="ts">

import type { BuildingType } from '@/types/office'

// 定义Props接收参数
defineProps<{
    building_info: BuildingType;
}>()


</script>

<template>
    <navigator :url="`/pages/building/building?building_id=${building_info.building_id}`" open-type="navigate"
        hover-class="navigator-hover" class="space-item">
        <view class="space-cover">
            <!-- <image src="/src/static/mock/index/space-cover.png" mode="scaleToFill" /> -->
            <image :src="building_info.building_cover" mode="scaleToFill" />
        </view>
        <view class="space-content">
            <view class="space-title">{{ building_info.building_name }}</view>
            <view class="space-address">{{ building_info.address }}</view>
            <view class="space-num">会议室：{{ building_info.office_sum }}</view>
        </view>
    </navigator>
</template>

<style lang="scss">
// 会议室项
.space-item {
    margin: 20rpx 0;
    margin-left: 50%;
    transform: translateX(-50%);
    border-radius: 20rpx;
    width: 700rpx;
    height: 230rpx;
    background-color: white;
    display: flex;

    .space-cover {
        width: 210rpx;
        height: 230rpx;
        border-radius: 20rpx;
        overflow: hidden;

        image {
            width: 100%;
            height: 100%;
        }
    }

    .space-content {
        margin-left: 20rpx;
        padding: 40rpx 0;
        // background-color: pink;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .space-title {
            font-size: 40rpx;
            font-weight: 900;
        }

        .space-address {
            font-size: 30rpx;
            font-weight: 600;
            color: #787878;
            display: flex;
            align-items: center;

            &:before {
                margin-right: 15rpx;
                content: '';
                width: 30rpx;
                height: 30rpx;
                background: url("../static/images/index/icon-address.png") top center no-repeat;
                background-size: 100% 100%;
            }
        }

        .space-num {
            font-size: 30rpx;
            font-weight: 600;
            color: #787878;
            display: flex;
            align-items: center;

            &:before {
                margin-right: 15rpx;
                content: '';
                width: 30rpx;
                height: 30rpx;
                background: url("../static/images/index/icon-people-num.png") top center no-repeat;
                background-size: 100% 100%;
            }
        }
    }
}
</style>