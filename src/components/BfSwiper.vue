<!-- 通用的轮播图组件 -->
<script setup lang="ts">
import type { BannerItem } from '@/types/index'
import { ref } from 'vue'

const activeIndex = ref(0)

// 当 swiper 下标发生变化时触发(轮播图滚动时，下标就会发生变化)
// const onChange: UniHelper.SwiperOnChange = (ev) => {
const onChange: UniHelper.SwiperOnChange = (ev) => {
  // !.为TS的非空断言，主观上排除掉空值的情况
  // activeIndex.value = ev.detail!.current
  activeIndex.value = ev.detail.current
}
// 定义 props 接收
defineProps<{
  list: BannerItem[]
}>()
</script>

<template>
  <view class="carousel">
    <swiper :circular="true" :autoplay="true" :interval="3000" @change="onChange">
      <swiper-item v-for="item in list" :key="item.id">
        <navigator url="/pages/index/index" hover-class="none" class="navigator">
          <image mode="aspectFill" class="image" :src="item.imgUrl"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 指示点 -->
    <view class="indicator">
      <text v-for="(item, index) in list" :key="item.id" class="dot" :class="{ active: index === activeIndex }"></text>
    </view>
  </view>
</template>

<style lang="scss">
@import './styles/BfSwiper.scss';
</style>
