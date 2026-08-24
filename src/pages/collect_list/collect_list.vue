<!-- 我的收藏页面 -->

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getMyCollectAPI } from '@/services/collect'
import { useMyStore } from '@/stores/modules/my'
import type { CollectInfoType } from '@/types/collect'

// 获取用户信息
const myStore = useMyStore()
// const user_id = myInfo.profile!.user_id!

// 获取用户收藏记录列表
const collectInfoList = ref<CollectInfoType[]>()
const getCollectListData = async () => {
  // const res = await getMyCollectAPI({ user_id })
  console.log("从服务器加载收藏列表")
  const res = await getMyCollectAPI({ user_id: myStore.profile?.user_id! })
  console.log("获取的收藏列表信息: ", res)
  if (0 == res.errcode) {
    collectInfoList.value = res.data.collect_list
    // console.log("响应式收藏列表：", collectInfoList.value)
  } else {
    uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~"
    })
  }
  collectInfoList.value = res.data.collect_list
}

// 显示就刷新
onShow(() => {
    getCollectListData()
})
  

</script>

<template>
  <view v-if="collectInfoList?.length == 0" class="tips"> - 暂无数据 - </view>
  <scroll-view v-else scroll-y>
    <BfCollectItem v-for="item in collectInfoList" :key="item" :office_id="item"></BfCollectItem>
  </scroll-view>
</template>


<style lange="scss" scoped>
.tips {
  margin-top: 30rpx;
  text-align: center;
  font-size: 30rpx;
  color: #6c6c6c;
}
scroll-view {
  background-color: #f6f6f6;
}
</style>