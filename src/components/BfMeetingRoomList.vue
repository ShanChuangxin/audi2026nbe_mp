<!-- 场地列表组件 -->
<!-- 这个组件比较特殊，组件请求网络数据由组件本身请求，而不是由页面来请求再父子组件传参 -->
<!-- 相比于轮播图通用组件：不仅复用结构样式，而且请求的API也一样；轮播图只复用结构样式，不同的页面请求的API地址不同，因此数据请求由父组件完成 -->

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { PageParams } from '@/types/global'
import { MeetingRoomItem } from "@/types/reserve_list"
import { getVenueListAPI } from '@/services/reserve_list'


// 定义分页参数
const pageParams: Required<PageParams> = {  // ts的语法里，Required关键词把可选转化为必选。不然后边没法对page进行自加(因为ts发现有可能类型为undefine)
    type: 0,
    page: 1,
    pageSize: 10,
}
// 会议室列表
const meetingRoomList = ref<MeetingRoomItem[]>([])
// 已结束标记
const finish = ref(false)
// 获取附近会议室数据
const getMeetingRoomData = async () => {
    // 退出分页判断
    if (finish.value === true) {  // 已经加载所有数据了，直接提示 + 退出请求数据函数
        return uni.showToast({ icon: 'none', title: '没有更多数据~' })
    }
    const res = await getVenueListAPI(pageParams)
    // 数组追加
    meetingRoomList.value.push(...res.result.items) // 要对数组进行展开，不然就变成数组嵌套数组了
    // 分页条件
    if (pageParams.page < res.result.pages) {
        // 页码累加
        pageParams.page++
    } else {
        finish.value = true
    }
}
// 重置数据，比如用于父组件下拉刷新
const resetData = () => {
    pageParams.page = 1
    meetingRoomList.value = []
    finish.value = false
}

// 当组件挂载完毕时，就可以为这个组件请求所需要的数据了
onMounted(() => {
    getMeetingRoomData()
})
// 暴露方法
// 可以在组件外使用组件内的方法
defineExpose({
    resetData,
    getMore: getMeetingRoomData, // 注意这里不是ts的写法，而是把暴露出的方法起了个别名叫getMore
})
</script>

<template>
    <!-- 获取场地列表 -->
    <view class="meeting-room-list">
        <!-- 样式暂时放下，可以渲染数据就行，等设计出来了再写 -->
        <navigator class="meeting-room-item" v-for="item in meetingRoomList" :key="item.office_id"
            :url="`/pages/meeting_room/meeting_room?id=${item.office_id}`">
            <image class="image" mode="aspectFill" :src="item.office_thumbnail"></image>
            <view class="name"> {{ item.title }} </view>
            <view class="name"> {{ item.office_layer }} </view>
            <view class="name"> {{ item.maximum }} </view>
            <view class="name"> {{ item.address }} </view>
            <view class="price">
                <text class="small">¥</text>
                <text>{{ item.price }}</text>
            </view>
        </navigator>
    </view>
    <view class="loading-text">
        <!-- 根据是否拉取完所有商品列表，通过三目运算符更新出页面提示的内容 -->
        {{ finish ? '没有更多数据~' : '正在加载...' }}
    </view>
</template>

<style lang="scss">
.meeting-room-list {
    width: 100%;
    background-color: skyblue;

    .meeting-room-item {
        width: 100%;
        background-color: #fff;
        margin: 2rpx 0;
        border-radius: 10rpx;
    }
}
</style>
@/services/office_list@/types/office_list