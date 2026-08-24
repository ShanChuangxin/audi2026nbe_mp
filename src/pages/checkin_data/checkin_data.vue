<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { getCheckInListAPI } from '@/services/order'
import type { ticket_user } from '@/types/access_ticket'
import { useMyStore } from '@/stores/modules/my'

// 获取页面参数
// 页面参数通过defineProps来定义
// 注意是把多个不同情况下传的不同参数取并集，且是可选的
const query = defineProps<{
  access_ticket_id: string
}>()

// 获取用户信息
const myInfo = useMyStore()
const user_id = myInfo.profile!.user_id!

// 获取门禁签到详情
const checkInList = ref<ticket_user[]>([])
const getCheckInLista = async () => {
  if (query.access_ticket_id) {
    const res = await getCheckInListAPI({ user_id: myInfo.profile!.user_id, ticket_id: query!.access_ticket_id })
    checkInList.value = res.data
    // 判断是否为本人的门禁，基于身份做不同的内容渲染
    // undo
  }
}

onLoad(() => {
  getCheckInLista()
})


</script>

<template>
  <div class="checkin_data">checkin_data</div>
</template>

<style lang="scss"></style>