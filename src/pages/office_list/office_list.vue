<!-- 会议室预约页面 -->
<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import type { OfficeType } from '@/types/office'
import { getOfficeListAPI } from '@/services/office_list'



// 获取页面参数
// 页面参数通过defineProps来定义
// 注意是把多个不同情况下传的不同参数取并集，且是可选的
const query = defineProps<{
  num_type: string
  table_type: string
  city_type: string
  purpose_type: string
  building_id: string
}>()

// 城市地点相关的信息。注意，这里与building页面的需要一致
const cityTypeList = [
  { id: 1, text: "北京" },
  { id: 2, text: "上海" },
  { id: 3, text: "深圳" },
]

// 获取会议室列表
const officeList = ref<OfficeType[]>()
const getOfficeListData = async () => {
  console.log("进入会议室列表页面")
  const queryInfo = {
    num_type: query.num_type,
    table_type: query.table_type,
    city_type: query.city_type, // === "" ? query.city_type : cityTypeList[parseInt(query.city_type, 10) - 1].text, // 注意下标不是从0开始
    purpose_type: query.purpose_type,
    building_id: query.building_id
  }
  console.log("获取的参数为：", queryInfo)
  const res = await getOfficeListAPI(queryInfo)
  console.log("获取的会议室列表信息为：", res)
  if (0 == res.errcode) {
    officeList.value = res.data.office_list
  } else {
    uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~"
    })
  }


}

onLoad(
  () => {
    getOfficeListData()
  }
)

</script>

<template>
  <view v-if="officeList?.length == 0" class="tips"> - 暂无数据 - </view>
  <scroll-view v-else scroll-y>
    <BfOfficeItem v-for="item in officeList" :key="item.office_id" :office_info="item"></BfOfficeItem>
  </scroll-view>
</template>

<style lang="scss" scoped>
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