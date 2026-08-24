<!-- 积分赠送页面 -->
<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app'
import type { UserInfo } from '@/types/global'
import type { ShareScore, ResultShareScore, ShareRecordInfoList } from '@/types/score_share'
import { shareScoreAPI, getShareListAPI } from '@/services/member'
import { useMyStore } from '@/stores/modules/my'

// 获取用户信息
const myInfo = useMyStore()
const user_id = myInfo.profile!.user_id!

// 获取用户积分赠送记录列表
const shareInfoList = ref<ShareRecordInfoList>()
const getShareListData = async () => {
  const res = await getShareListAPI({ user_id })
  shareInfoList.value!.share_score_list = res.result.share_score_list
}

// 为其它用户赠送积分
const shareScoreNum = ref(0)
const shareScoreData = async () => {
  const res = await shareScoreAPI({ user_id, share_score: shareScoreNum.value })
  // 更新到本地存储
  // 页面toast提示
}

// 页面显示时就加载
onShow(() => {
  getShareListData()
})

</script>

<template>
  <!-- 会员卡容器 -->
  <!-- 当前积分从本地存储里取 -->
  <view class="card-container">
    <image src="" mode="scaleToFill" />
  </view>

  <!-- 积分选择赠送容器 -->
  <view class="score-share-container">
    <view class="score-select"></view>
    <button>立即赠送</button>
  </view>

  <!-- 赠送记录 -->
  <view>
    <title>赠送记录</title>
    <view class="share-list"></view>
  </view>
</template>

<style scoped></style>