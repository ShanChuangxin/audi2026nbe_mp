<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { getPromotionDetailListAPI } from '@/services/promotion'
import { useMyStore } from '@/stores/modules/my'
import type { PromotionDetailList } from '@/types/promotion'

// 获取用户信息
const myInfo = useMyStore()
const user_id = myInfo.profile!.user_id!

// 获取推广收益列表
const promotionDetailList = ref<PromotionDetailList>({} as PromotionDetailList)
const getShareListData = async () => {
  const res = await getPromotionDetailListAPI({ user_id })
  promotionDetailList.value = res.result
}

onLoad(() => {
  getShareListData()
})
</script>

<template>
  <div class="promotion_reward">promotion_reward</div>
</template>

<style lang="scss"></style>