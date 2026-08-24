<!-- 会议室详情页面 -->
<!-- 下订单要在这个页面做选择 -->

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { getBuildingDetailAPI } from '@/services/office'
import { useMyStore } from '@/stores/modules/my'
import { useOrderSelectionStore } from '@/stores/modules/system'
import type { BuildingType } from '@/types/office'
import type { OwenerOrder } from '@/types/order'


// 获取页面参数
// 页面参数通过defineProps来定义
// 注意是把多个不同情况下传的不同参数取并集，且是可选的
const query = defineProps<{
  building_id: string
}>()

// 获取用户信息
// const myInfo = useMyStore()
// const user_id = myInfo.profile!.user_id!


// 获取会议室详情
const buildingInfo = ref<BuildingType>({} as BuildingType)
const swiperList = ref<{ id: number, imgUrl: string }[]>([])
const getBuildingInfoData = async () => {
  if (query.building_id) {
    const res = await getBuildingDetailAPI({ building_id: query.building_id })
    console.log(res)
    buildingInfo.value = res.data.building
    swiperList.value = res.data.building.building_swiper_list!
    console.log(swiperList.value)
  }
}

// 页面加载就请求会议室详情
onLoad(
  () => {
    getBuildingInfoData()
  }
)


// function tapReserveBtn() {
//   console.log("点击了预定")
//   // uni.navigateTo({ url: `/pages/reserve/reserve?office_id=${query.office_id}` })
// }

// // 订单信息；用户的操作和选择会双向绑定存入这个响应式变量里
// const orderInfo = ref<OwenerOrder>({} as OwenerOrder)
// // 提交订单信息
// const finishOrderSelection = async () => {
//   // 订单内容跨页面维护
//   const orderSelection = useOrderSelectionStore()
//   orderSelection.prepareOrder(orderInfo.value)
//   // 跳转到支付页面
//   uni.navigateTo({ url: '/pages/pay/pay' })
// }

// 上滑弹窗相关
// 弹窗回调，用于控制tabbar的显示和隐藏
function popupChange(e: UniHelper.UniPopupOnChangeEvent) {
  console.log(e)
  return 
  // if (e.show) {
  //   uni.hideTabBar()
  // } else {
  //   uni.showTabBar()
  // }
}
// 筛选会议室类型
const popup = ref<UniHelper.UniPopup>()
function openFilterOffice() {
  console.log("打开筛选会议室弹窗")

  // 设置城市默认选择（不可修改）
  for (let item = 0; item < cityTypeList.value.length; ++item ){  // 注意是从1开始
    if(cityTypeList.value[item].text == buildingInfo.value.city){
      selectedCityType.value = item + 1
      break
    }
  }

  popup.value?.open('bottom')
}
// function closeFilterOffice() {
//   console.log("关闭筛选会议室弹窗")
//   popup.value?.close()
//   uni.showTabBar({
//     complete: (msg) => { console.log(msg) },
//   })
// }
// 筛选人数
// 文本框方式填写
const peopleNum = ref('')
// 把文本过滤成整数
function filterInput(e:any) {
  console.log("输入了文字", e.detail.value)
  let filteredValue = e.detail.value.replace(/[^0-9]/g, '');
  // 去除前导零
  filteredValue = parseInt(filteredValue, 10) || '';
  console.log(filteredValue)
  setTimeout(() => {  // 0秒的定时器可以帮忙重新渲染页面
    peopleNum.value = filteredValue
  }, 0)
}

// 桌型相关
const iconTypeListParam = [
  { id: 0, text: ""},
  { id: 1, text: "培训室型"},  
  { id: 2, text: "剧院型" },  
  { id: 3, text: "岛型"},  
  { id: 4, text: "回字型" },  
  { id: 5, text: "阶梯会议室"}, 
]
const iconTypeList = ref([
  { id: 1, text: "培训室型", default: "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/peixun-default.png", selected: "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/peixun-selected.png" },  // 培训室形图标
  { id: 2, text: "剧院型", default: "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/juyuan-default.png", selected: "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/juyuan-selected.png" },  // 剧院形图标
  { id: 3, text: "岛型", default: "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/dao-default.png", selected: "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/dao-selected.png" },  // 岛形图标
  { id: 4, text: "回字型", default: "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/huizi-default.png", selected: "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/huizi-selected.png" },  // 回字形图标
  { id: 5, text: "阶梯会议室", default: "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/jieti-default.png", selected: "https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/index/jieti-selected.png" },  // 阶梯教室形图标
])

const selectedTableType = ref(0)  // 选择的桌形
// 桌形切换
function selectTableType(index: number) {
  // console.log(index)
  selectedTableType.value = index
}

// 城市地点相关的信息
const cityTypeListParam = [
  { id: 0, text: "" },
  { id: 1, text: "北京" },
  { id: 2, text: "上海" },
  { id: 3, text: "深圳" },
]
const cityTypeList = ref([
  { id: 1, text: "北京" },
  { id: 2, text: "上海" },
  { id: 3, text: "深圳" },
])
const selectedCityType = ref(0) // 选择的城市
// 城市类型选择切换
function selectCityType(index: number) {
  // console.log(index)
  selectedCityType.value = index
}

// 用途相关的信息
const purposeTypeListParam = [
  { id: 0, text: "" },
  { id: 1, text: "直播" },
  { id: 2, text: "会议" },
  { id: 3, text: "培训" },
  { id: 4, text: "活动" },
  { id: 5, text: "其他" },
]
const purposeTypeList = ref([
  { id: 1, text: "直播" },
  { id: 2, text: "会议" },
  { id: 3, text: "培训" },
  { id: 4, text: "活动" },
  { id: 5, text: "其他" },
])
const selectedPurposeType = ref(0)  // 选择的用途
// 用途类型选择切换
function selectPurposeType(index: number) {
  // console.log(index)
  selectedPurposeType.value = index
}

// 筛选提交
function submitFilter() {
  // 把填写的信息以参数形式传到列表页面
  console.log("跳转到会议室列表页面")
  console.log(iconTypeListParam[selectedTableType.value].text)
  console.log(cityTypeListParam[selectedCityType.value].text)
  console.log(purposeTypeListParam[selectedPurposeType.value].text)
  // uni.navigateTo({ url: `/pages/office_list/office_list?num_type=${peopleNum.value}&table_type=${selectedTableType.value}&city_type=${selectedCityType.value}&purpose_type=${selectedPurposeType.value}` })
  uni.navigateTo({ url: `/pages/office_list/office_list?num_type=${peopleNum.value}&table_type=${iconTypeListParam[selectedTableType.value].text}&city_type=${cityTypeListParam[selectedCityType.value].text}&purpose_type=${purposeTypeListParam[selectedPurposeType.value].text}&building_id=${buildingInfo.value.building_id}` })

}









</script>

<template>
  <!-- 页面 -->
  <view class="body-view">
    <!-- <div class="meeting_room">meeting_room: {{ office_id }}</div> -->
    <!-- 头部 -->
    <view class="head">
      <!-- <image class="favorite-default"
        src="https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/office/favorite-default.png" mode="scaleToFill" /> -->
      <!-- 概述 -->
      <view class="overview">
        <view class="overview-title">{{ buildingInfo.building_name }}</view>
        <!-- <view class="overview-content">今天可用的空间</view> -->
      </view>
    </view>
    <!-- 会议室轮播图 -->
    <view class="carousel">
      <!-- 轮播图 -->
      <swiper autoplay circular interval="3000">
        <swiper-item v-for="item in swiperList" :key="item.id">
          <image :src="item.imgUrl" mode="scaleToFill" />
        </swiper-item>
      </swiper>
    </view>
    <!-- 会议室基本信息 -->
    <view class="building-base-info">
      <view class="building-name">{{ buildingInfo.building_name }}</view>
      <view class="building-address"><text>{{ buildingInfo.address }}</text></view>
      <view class="building-people-num">
        <view class="people-num-title">容纳人数: </view>
        <text>{{ buildingInfo.building_minimum }}-{{ buildingInfo.building_maximum }}</text>
      </view>
    </view>
    <!-- 会议室设施 -->
    <view class="facilities-container">
      <!-- 标题 -->
      <view class="facility-title">会议设施</view>
      <!-- 装icon的容器 -->
      <view class="icon-container">
        <!-- 单个设施 -->
        <view class="facility" v-for="item in buildingInfo.facility_list" :id="item.id">
          <image :src="item.icon" mode="scaleToFill" />
          <text>{{ item.text }}</text>
        </view>
      </view>

    </view>
    <!-- 预订按钮 -->
    <view class="btn-container">
      <view class="reserve-btn" @tap="openFilterOffice">预定</view>
    </view>
  </view>

  <!-- 上滑弹窗 -->
  <uni-popup ref="popup" type="bottom" @change="popupChange">

    <view class="office-filter-container">
      <!-- 顶部横条 -->
      <view class="indicator"></view>
      <!-- 筛选容器 -->
      <view class="filter-container">
        <!-- 人数 -->
        <view class="people-num-container">
          <text>人数</text>
          <!-- 修改样式需要在node_modules/@dcloudio/uni-ui/lib/uni-data-select的源文件中进行样式修改 -->
          <!-- <uni-data-select placeholder="请选择人数" :localdata="peopleNumrange" @change="numTypeChange"></uni-data-select> -->
           <view class="input-container">
            <!-- 使用v-model进行双向绑定 -->
            <input class="name-input" type="number" inputmode="numeric" @input="filterInput" v-model="peopleNum">
           </view>
        </view>
        <!-- 桌型 -->
        <view class="table-type-container">
          <text>桌型</text>
          <view class="icon-list">
            <view class="table-type" v-for="item in iconTypeList" :key="item.id" @tap="selectTableType(item.id)">
              <!-- 注意不要使用img标签 -->
              <image :src="item.id == selectedTableType ? item.selected : item.default" mode="aspectFit" alt=""></image>
              <text>{{ item.text }}</text>
            </view>
          </view>
        </view>
        <!-- 城市 -->
        <view class="city-container">
          <text>地点</text>
          <view class="city-list">
            <view :class="item.id == selectedCityType ? 'city-selected' : 'city-default'" v-for="item in cityTypeList"
              :key="item.id">
              <text>{{ item.text }}</text>
            </view>
          </view>
        </view>
        <!-- 用途 -->
        <view class="purpose-container">
          <text>用途</text>
          <view class="purpose-list">
            <view :class="item.id == selectedPurposeType ? 'purpose-selected' : 'purpose-default'"
              v-for="item in purposeTypeList" :key="item.id" @tap="selectPurposeType(item.id)">
              <text>{{ item.text }}</text>
            </view>
          </view>
        </view>
        <!-- 应用按钮 -->
        <view class="apply-btn" @tap="submitFilter">
          <text>应用</text>
        </view>
      </view>
    </view>

  </uni-popup>

</template>


<style lang="scss">
.body-view {
  .head {
    width: 750rpx;
    height: 410rpx;
    background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/office/head-bg-gray.png") top center no-repeat;
    background-size: 100% 100%;
    position: relative;

    .favorite-default {
      position: absolute;
      top: 60rpx;
      right: 50rpx;
      width: 40rpx;
      height: 40rpx;
    }

    // 概述
    .overview {
      margin-left: 50%;
      transform: translateX(-50%);
      width: 400rpx;
      height: 150rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .overview-title {
        font-size: 40rpx;
        font-weight: 600;
        color: black;
        text-align: center;
      }

      .overview-content {
        // margin-top: 15rpx;
        font-size: 24rpx;
        font-weight: 300;
        color: #808080;
        text-align: center;
      }
    }
  }

  // 轮播图
  .carousel {
    margin-top: -250rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 590rpx;
    height: 380rpx;

    swiper {
      width: 100%;
      height: 380rpx;

      image {
        width: 100%;
        height: 100%
      }
    }
  }

  // 会议室基本信息
  .building-base-info {
    margin-top: 30rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 590rpx;
    height: 160rpx;

    .building-name {
      font-size: 35rpx;
      font-weight: 600;
      color: black;
      text-align: left;
    }

    .building-address {
      margin-top: 10rpx;
      height: 25rpx;
      display: flex;

      text {
        font-size: 20rpx;
        font-weight: 300;
        color: #808080;
        text-align: left;

      }

      &:before {
        display: inline-block;
        margin-right: 10rpx;
        content: '';
        width: 25rpx;
        height: 25rpx;
        background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/office/icon-location.png") top center no-repeat;
        background-size: 100% 100%;
      }
    }
    .building-people-num {
      margin-top: 20rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .people-num-title{
        font-size: 35rpx;
        font-weight: 400;
        color: black;
        text-align: left;
      }
      text {
        margin-left: 20rpx;
        font-size: 30rpx;
        color: #de567d;
      }
    }
  }

  // 会议室设施
  .facilities-container {
    margin-left: 50%;
    transform: translateX(-50%);
    width: 590rpx;

    .facility-title {
      font-size: 35rpx;
      font-weight: 400;
      color: black;
      text-align: left;
    }

    .icon-container {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;


      .facility {
        width: 145rpx;
        height: 200rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        image {
          width: 104rpx;
          height: 104rpx;
        }

        text {
          margin-top: 20rpx;
          font-size: 20rpx;
          color: #808080;
          text-align: center;
        }
      }
    }
  }


  // 按钮
  .btn-container {
    position: relative;
    margin-top: 20rpx 0;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 590rpx;
    height: 130rpx;

    .reserve-btn {
      position: absolute;
      top: 0rpx;
      right: 0rpx;
      height: 90rpx;
      width: 330rpx;
      background-color: #cc5872;
      border-radius: 45rpx;
      color: white;
      text-align: center;
      line-height: 90rpx;
      font-size: 40rpx;
      font-weight: 400;
    }
  }
}

// 弹窗筛选容器
.office-filter-container {
  position: relative;
  margin-bottom: -70rpx; // 清除容器和uni-popup底部的空隙（原因未知）
  width: 750rpx;
  height: 1150rpx;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  background-color: white;

  // 顶部横条
  .indicator {
    position: absolute;
    top: 20rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 150rpx;
    height: 10rpx;
    background-color: #dfdfe7;
    border-radius: 5rpx;

  }

  // 筛选容器
  .filter-container {
    position: absolute;
    top: 130rpx;

    margin-left: 50%;
    transform: translateX(-50%);
    width: 600rpx;
    height: 800rpx;
    // background-color: pink;

    // 人数选择
    .people-num-container {
      text {
        margin-left: 20rpx;
        margin-bottom: 20rpx;
      }
      .input-container {
          width: 90% !important;
          height: 100rpx;
          margin: 20rpx 0 0 20rpx;
          border: solid 2rpx #f4f4f4;
          border-radius: 30rpx;
          // background-color: skyblue;

        .name-input {
          margin-left: 20rpx;
          width: 90%;
          height: 100%;
          font-size: 38rpx;
          // background-color: pink;
        }        
      }

    }

    // 桌型选择
    .table-type-container {
      margin-top: 40rpx;

      text {
        margin-left: 20rpx;
      }

      .icon-list {
        margin-left: 50%;
        margin-top: 20rpx;
        transform: translateX(-50%);
        width: 90%;
        height: 120rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .table-type {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          image {
            width: 66rpx;
            height: 66rpx;
          }

          text {
            margin: 0rpx;
            font-size: 16rpx;
            text-align: center;
          }

        }

      }
    }

    // 城市选择
    .city-container {
      // width: 700rpx;
      // height: 150rpx;
      // background-color: skyblue;
      margin-top: 40rpx;

      text {
        margin-left: 20rpx;
        margin-bottom: 20rpx;
      }

      .city-list {
        margin-left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 120rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .city-default {
          border: 2rpx solid #f2f2f2;
          width: 180rpx;
          height: 80rpx;
          border-radius: 25rpx;
          background-color: #fafafc;
          display: flex;
          justify-content: center;
          align-items: center;

          // background-color: blue;
          text {
            margin: 0rpx;
            color: #cc5872;
            text-align: center;
          }
        }

        .city-selected {
          border: 2rpx solid #f2f2f2;
          width: 180rpx;
          height: 80rpx;
          border-radius: 25rpx;
          background-color: #cc5872;
          display: flex;
          justify-content: center;
          align-items: center;

          // background-color: blue;
          text {
            margin: 0rpx;
            color: #fafafc;
            text-align: center;
          }
        }

      }
    }

    // 用途选择
    .purpose-container {
      // width: 700rpx;
      // height: 150rpx;
      // background-color: skyblue;
      margin-top: 20rpx;

      text {
        margin-left: 20rpx;
        margin-bottom: 20rpx;
      }

      .purpose-list {
        margin-left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 120rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .purpose-default {
          border: 2rpx solid #e3e3ea;
          width: 95rpx;
          height: 80rpx;
          border-radius: 25rpx;
          background-color: #fafafc;
          display: flex;
          justify-content: center;
          align-items: center;

          // background-color: blue;
          text {
            margin: 0rpx;
            color: #b2b2b2;
            text-align: center;
          }
        }

        .purpose-selected {
          border: 2rpx solid #d56029;
          width: 95rpx;
          height: 80rpx;
          border-radius: 25rpx;
          display: flex;
          justify-content: center;
          align-items: center;

          // background-color: blue;
          text {
            margin: 0rpx;
            color: black;
            text-align: center;
          }
        }

      }
    }

    // 应用按钮
    .apply-btn {
      margin-top: 20rpx;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 600rpx;
      height: 100rpx;
      border-radius: 50rpx;
      background-color: #cc5872;
      display: flex;
      justify-content: center;
      align-items: center;

      text {
        margin: 0;
        text-align: center;
        color: white;
      }
    }
  }
}

</style>
