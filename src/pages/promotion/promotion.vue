<!-- 推广页面 -->
<script setup lang="ts">

import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { getPromoterInfoAPI } from '@/services/promotion'
import { useMyStore } from '@/stores/modules/my'
import type { PromoterInfo } from '@/types/promotion'

// 获取用户信息
const myInfo = useMyStore()
const user_id = myInfo.profile!.user_id!

// 获取推广者信息
const promoterInfo = ref<PromoterInfo>({} as PromoterInfo)
const getPromoterInfoData = async () => {
  const res = await getPromoterInfoAPI({ user_id })
  promoterInfo.value = res.result
}


onLoad(() => {
  getPromoterInfoData()
})

</script>

<template>
  <div class="promotion">promotion</div>
</template>

<style lang="scss"></style>