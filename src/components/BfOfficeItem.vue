<!-- 场地项入口 -->
<script setup lang="ts">

import type { OfficeType } from '@/types/office'

// 定义Props接收参数
defineProps<{
    office_info: OfficeType;
}>()


</script>

<template>
    <!-- <navigator :url="`/pages/office/office?office_id=${office_info.office_id}`" open-type="navigate" -->
    <navigator :url="`/pages/reserve/reserve?office_id=${office_info.office_id}`" open-type="navigate"
        hover-class="navigator-hover" class="space-item">
        <view class="space-cover">
            <!-- <image src="/src/static/mock/index/space-cover.png" mode="scaleToFill" /> -->
            <image :src="office_info.office_cover" mode="scaleToFill" />
        </view>
        <view class="space-content">
            <view class="building-title">{{ office_info.building_name }}</view>
            <view class="room-num">房号{{ office_info.office_name }}</view>
            <view class="space-address">{{ office_info.address }}</view>
            <view class="space-num">人数：{{ office_info.maximum }}</view>
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
    height: 200rpx;
    background-color: white;
    display: flex;
    justify-content: left;
    align-items: center;

    .space-cover {
        width: 242rpx;
        height: 136rpx;
        border-radius: 20rpx;
        overflow: hidden;

        image {
            width: 100%;
            height: 100%;
        }
    }

    .space-content {
        margin-left: 20rpx;
        padding: 20rpx 0;
        // background-color: pink;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .building-title {
            font-size: 32rpx;
            font-weight: 900;
        }
        .room-num {
            font-size: 24rpx;
            font-weight: 600;
            color: #787878;
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
        .space-address {
            font-size: 24rpx;
            font-weight: 600;
            color: #787878;
            display: flex;
            align-items: center;

            &:before {
                margin-right: 15rpx;
                content: '';
                width: 24rpx;
                height: 30rpx;
                background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/icon-address.png") top center no-repeat;
                background-size: 100% 100%;
            }
        }

        .space-num {
            font-size: 24rpx;
            font-weight: 600;
            color: #787878;
            display: flex;
            align-items: center;

            &:before {
                margin-right: 15rpx;
                content: '';
                width: 25rpx;
                height: 25rpx;
                background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/icon-people-num.png") top center no-repeat;
                background-size: 100% 100%;
            }
        }
    }
}
</style>