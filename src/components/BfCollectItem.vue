<!-- 收藏项入口 -->
<script setup lang="ts">

import { addCollectAPI, delCollectAPI } from '@/services/collect'
import type { OfficeType } from '@/types/office'
import { getOfficeDetailAPI } from '@/services/office'
import { ref, onMounted } from 'vue';
// import { onLoad } from '@dcloudio/uni-app'   // 注意，组件的生命周期函数不能用onLoad，只能用onMounted
import { useMyStore } from '@/stores/modules/my'

// 定义Props接收参数
const props = defineProps<{ // 定义变量接收，后续可以在js中继续使用
    office_id: string;
}>()


// 获取会议室详情
const officeInfo = ref<OfficeType>({} as OfficeType)
// const swiperList = ref<{ id: number, imgUrl: string }[]>([])
const getOfficeInfoData = async () => {
    console.log("office_id：", props.office_id)
  if (props.office_id) {
    const res = await getOfficeDetailAPI({ office_id: props.office_id })
    console.log(res)
    officeInfo.value = res.data.office
    // swiperList.value = res.data.office_swiper_img!
    // console.log(swiperList.value)
  }
}

// 页面加载就请求会议室详情
onMounted(
  () => {
    console.log("加载预定页面")
    getOfficeInfoData()
  }
)

function tapCollectItem(){
    uni.navigateTo({ url: `/pages/reserve/reserve?office_id=${props.office_id}` })
}

// 获取用户信息
const myStore = useMyStore()
let isSelected = true   // 用于控制计数
const isCollected = ref(true)   // 用于控制响应式变化 
// 点击了collect icon
async function onTapCollectIcon(){
    console.log("点击了collect的icon")
    // 判断用户是否登录
    if (!myStore.profile) {  // 未登录，跳转到登录页面
        uni.navigateTo({ url: "/pages/login/login" })
        return
    }
    if (isSelected) {   // 定义的defineProps 返回的变量是一个直接的对象，不需要 .value
        console.log("切换为未选中状态，同时同步给服务器")
        const res = await delCollectAPI({user_id: myStore.profile.user_id, office_id: props.office_id})
        console.log("删除收藏的结果为：", res)
        if (0 == res.errcode) {
            isSelected = !isSelected
            isCollected.value = isSelected  // 更新页面数据
            myStore.setProfile(res.data.user_info)
        } else {
            uni.showToast({
            icon: 'none',
            title: "网络不佳，请稍后重试~"
            })
        }
    } else {    // 有可能是用户在进入收藏列表后，对这个会议室点击了删除又点击了加入收藏
        console.log("切换为选中状态，同时同步给服务器") 
        const res = await addCollectAPI({user_id: myStore.profile.user_id, office_id: props.office_id})
        console.log("加入收藏的结果为：", res)
        if (0 == res.errcode) {
            isSelected = !isSelected
            isCollected.value = isSelected  // 更新页面数据
            myStore.setProfile(res.data.user_info)
        } else {
            uni.showToast({
            icon: 'none',
            title: "网络不佳，请稍后重试~"
            })
        }
    }
}

</script>

<template>
    <view class="space-item" @tap="tapCollectItem">
        <view class="space-cover">
            <!-- <image src="/src/static/mock/index/space-cover.png" mode="scaleToFill" /> -->
            <image :src="officeInfo.office_cover" mode="scaleToFill" />
        </view>
        <view class="space-content">
            <view class="building-title">{{ officeInfo.building_name }}</view>
            <view class="room-num">房号{{ officeInfo.office_name }}</view>
            <view class="space-address">{{ officeInfo.address }}</view>
            <view class="space-num">人数：{{ officeInfo.maximum }}</view>
        </view>
        <view class="collect-content" @tap.stop="onTapCollectIcon">
            <view :class="isCollected ? 'collected-icon' : 'default-icon' "></view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
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
    .collect-content{
        // margin: 20rpx 0rpx 0rpx 80rpx;
        margin: 20rpx 20rpx 0rpx auto;   // 父元素为flex时，子元素设置margin-left就会靠右对齐
        width: 50rpx;
        height: 100%;
        // background-color: pink;

        // 已收藏的图标
            .collected-icon {
                width: 45rpx;
                height: 40rpx;
                background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/common/collect-collected.png") top center no-repeat;
                background-size: 100% 100%;
            }
            // 未收藏的图图标
            .default-icon {
                width: 50rpx;
                height: 45rpx;
                background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/common/collect-default.png") top center no-repeat;
                background-size: 100% 100%;
            }
    }
}
</style>