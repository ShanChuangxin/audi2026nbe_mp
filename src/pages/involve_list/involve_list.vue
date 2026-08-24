<!-- 我参与的页面 -->

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app'
import { getInvolveListAPI } from '@/services/access_ticket'
import { useMyStore } from '@/stores/modules/my'
import type { AccessTicketType } from '@/types/access_ticket'

// 获取用户信息
const myStore = useMyStore()
// const user_id = myInfo.profile!.user_id!
myStore.profile?.user_id

// 获取用户参与记录列表
const involveList = ref<AccessTicketType[]>()
const getInvolveListData = async () => {
  const res = await getInvolveListAPI({ user_id: myStore.profile?.user_id! })
  // const res = await getInvolveListAPI({ user_id: "1234" })
  console.log(res)
  if (0 == res.errcode) {
    involveList.value = res.data.involve_list
    console.log("参与的列表：", involveList.value)
  } else {
    uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~"
    })
  }
}

onShow(
  () => {
    console.log("显示我参与的列表")
    getInvolveListData()
  }
)

</script>

<template>
  <view v-if="involveList?.length == 0" class="tips"> - 暂无数据 - </view>
  <scroll-view v-else scroll-y>
    <BfInvolveItem v-for="item in involveList" :key="item" :involve_id="item"></BfInvolveItem>
  </scroll-view>
</template>


<style lange="scss">
.tips {
  margin-top: 30rpx;
  text-align: center;
  font-size: 30rpx;
  color: #6c6c6c;
}
scroll-view {
  /* background-color: #f6f6f6; */
  width: 100%;
  height: 100vh;
}

</style>