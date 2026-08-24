<!-- 隐私条款页面，所有的隐私条款共用 -->
<!-- 通过页面参数来判断是哪个隐私条款 -->

<script setup lang="ts">
import { ref } from 'vue';
import { getAgreementAPI } from '@/services/agreement'
import type { ResultAgreement } from '@/types/agreement'
import { onLoad } from '@dcloudio/uni-app'

// 获取页面参数
// 页面参数通过defineProps来定义
// 注意是把多个不同情况下传的不同参数取并集，且是可选的
const query = defineProps<{
  type: string
}>()

// 获取隐私条款
// const agreementInfo = ref('')
// const getAgreementData = async () => {
//   if (query.type) {
//     const res = await getAgreementAPI(query.type)
//     agreementInfo.value = res.data.agreementInfo
//   }
// }

// onLoad(() => {
//   getAgreementData()
// })

</script>

<template>
  <image
    src="https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/agreement/login_agreement.jpg"
    mode="widthFix"
    style="width: 100%;"
  />
</template>

<style scoped>
</style>