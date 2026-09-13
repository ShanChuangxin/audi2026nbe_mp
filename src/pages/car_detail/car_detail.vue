<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app'
import { useMyStore, useSystemStore } from '@/stores'
import type { CarDailyRankType, CarCityRankType } from '@/types/user_info'
import { getUserInfoAPI, getCarRankAPI } from '@/services/login'

// 持久化存储
const myStore = useMyStore();
const systemStore = useSystemStore();

// 当前排行榜：today 今日榜 / city 城市榜
const currentRankType = ref<'today' | 'city'>('today');

// 排行榜数据
const today_rank_list = ref<CarDailyRankType[]>([]);
const city_rank_list = ref<CarCityRankType[]>([]);

// 请求用户信息
const getUserInfo = async () => {
  const open_id = myStore.profile?.open_id;
  if (!open_id) {
    console.log("未获取到用户信息，跳转到首页");
    uni.navigateTo({ url: "/pages/index/index" });
    return;
  }

  const userInfo = await getUserInfoAPI({ open_id, city:"beijing",is_register: false });
  console.log("调取用户信息的结果为：", userInfo);

  if (userInfo.errcode === 0) {
    const user_info = userInfo.data.user_info;
    console.log("获取到的用户信息：", user_info);
    myStore.setProfile(user_info);
  } else {
    uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~",
      duration: 1000
    });
  }
}

// 请求排行榜信息
const getCarRankInfo = async () => {
  const open_id = myStore.profile?.open_id;
  if (!open_id) {
    console.log("未获取到用户信息，跳转到首页");
    uni.navigateTo({ url: "/pages/index/index" });
    return;
  }

  const rankInfo = await getCarRankAPI();
  console.log("获取的排行榜结果为：", rankInfo);

  if (rankInfo.errcode === 0) {
    const rank_info = rankInfo.data.rank_info;

    today_rank_list.value = rank_info.daily_rank || [];
    city_rank_list.value = rank_info.city_rank || [];

    console.log("获取到的当日排行榜信息：", today_rank_list.value);
    console.log("获取到的城市排行榜信息：", city_rank_list.value);
  } else {
    uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~",
      duration: 1000
    });
  }
}

// 当前正在显示的排行榜
const currentRankList = computed(() => {
  return currentRankType.value === 'city'
    ? city_rank_list.value
    : today_rank_list.value;
});

// 切换排行榜
function switchRank(type: 'today' | 'city') {
  currentRankType.value = type;
  console.log("切换排行榜：", type === 'today' ? '今日榜' : '城市榜');
}

// 获取指定位置的排行榜数据
function getRankItem(index: number) {
  return currentRankList.value[index];
}

// 判断是不是当前用户
function isMyRank(item: CarDailyRankType | CarCityRankType | undefined) {
  if (!item) return false;
  return item.open_id === myStore.profile?.open_id;
}

// 判断是不是前三名
function isTopRank(item: CarDailyRankType | CarCityRankType | undefined) {
  if (!item) return false;
  return item.rank <= 3;
}

// 页面显示
onShow(async () => {
  await getUserInfo();
  await getCarRankInfo();
});

// 返回地图
function navitateToHome() {
  console.log("跳转到地图页面");
  uni.reLaunch({ url: "/pages/map/map" });
}

</script>

<template>

  <view class="page">
    <image
      class="page-bg"
      src="https://www.mbcstyle.cn/projects/static/audi2026nbe/car_detail/bg.jpg"
      mode="widthFix"
    />
     <!-- 顶部 Bar -->
    <view class="top-container">
      <view class="language"></view>
    </view>

    <!-- 我的成绩 -->
    <view class="score-container">
      <view class="score-label"></view>

      <view v-if="myStore.profile?.latest_car_time == 0" class="no-score"></view>

      <view v-else class="my-score">
        <view class="user-info">
          <view class="my-rank">-</view>

          <view class="avatar">
            <image :src="myStore.profile?.avatar" mode="aspectFill" />
          </view>

          <view class="nick-name">
            {{ myStore.profile?.nick_name }}
          </view>
        </view>

        <view class="score-num">
          {{ myStore.profile?.latest_car_score }}
        </view>
      </view>
    </view>

    <!-- 排行榜 -->
    <view class="leaderboard-container">
      <view class="leaderboard-label"></view>

      <!-- 今日榜 / 城市榜 -->
      <view class="rank-tabs">
        <view
          class="rank-tab rank-tab-today"
          :class="{ active: currentRankType === 'today' }"
          @tap="switchRank('today')"
        >
          Today
        </view>

        <view
          class="rank-tab rank-tab-city"
          :class="{ active: currentRankType === 'city' }"
          @tap="switchRank('city')"
        >
          Beijing
        </view>
      </view>

      <view class="leaderboard-body">
        <!-- 固定10个位置 -->
        <view
          v-for="index in 10"
          :key="index"
          class="rank-row"
          :class="{
            'top-rank-row': isTopRank(getRankItem(index - 1)),
            'my-rank-row': isMyRank(getRankItem(index - 1))
          }"
        >
          <!-- 有数据 -->
          <template v-if="getRankItem(index - 1)">
            <view class="rank-num">
              {{ getRankItem(index - 1)?.rank }}
            </view>

            <view class="user-info">
              <view class="avatar">
                <image
                  :src="getRankItem(index - 1)?.avatar"
                  mode="aspectFill"
                />
              </view>

              <view class="nick-name">
                {{ getRankItem(index - 1)?.nick_name }}
              </view>
            </view>

            <view class="score-num">
              {{ getRankItem(index - 1)?.car_score }}
            </view>
          </template>

          <!-- 没有数据 -->
          <template v-else>
            <view class="rank-num"></view>
            <view class="user-info"></view>
            <view class="score-num"></view>
          </template>
        </view>
      </view>
    </view>

    <!-- 底部按钮栏 -->
    <view class="btn-container">
      <view v-if="myStore.profile?.latest_car_time != 0" class="btn-home" @tap="navitateToHome"></view>
      <view v-else class="btn-experience" @tap="navitateToHome"></view>
    </view>
  </view>

 
</template>

<style lang="scss">
page {
  background: #000;
}
.page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 150rpx;
  box-sizing: border-box;
  overflow: hidden;
}
.page-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: auto;
  z-index: 0;
  pointer-events: none;
}

.top-container,
.score-container,
.leaderboard-container,
.btn-container {
  position: relative;
  z-index: 1;
}

// 顶部 Bar
.top-container {
  margin: 20rpx auto 0;
  width: 90%;

  .language {
    float: right;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-language.png") top center no-repeat;
    background-size: 100% 100%;
    width: 60rpx;
    height: 60rpx;
  }
}

// 我的成绩
.score-container {
  margin: 50rpx auto 0;
  width: 90%;

  .score-label {
    margin-bottom: 50rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/car_detail/label-my-score.png") top center no-repeat;
    background-size: 100% 100%;
    width: 249rpx;
    height: 44rpx;
  }

  .no-score {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/car_detail/no-score.png") top center no-repeat;
    background-size: 100% 100%;
    width: 598rpx;
    height: 98rpx;
  }

  .my-score {
    border-top: solid 1rpx white;
    border-bottom: solid 1rpx white;
    width: 100%;
    height: 120rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;

    .user-info {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;

      .my-rank {
        width: 80rpx;
        height: 80rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32rpx;
      }

      .avatar {
        margin: 0 20rpx;
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .nick-name {
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 28rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .score-num {
      width: 100rpx;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 30rpx;
    }
  }
}

// 排行榜
.leaderboard-container {
  margin: 50rpx auto 0;
  width: 90%;

  .leaderboard-label {
    margin-bottom: 35rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/car_detail/label-leaderboard.png") top center no-repeat;
    background-size: 100% 100%;
    width: 353rpx;
    height: 34rpx;
  }

  // 榜单切换
  .rank-tabs {
    width: 100%;
    height: 60rpx;
    display: flex;
    align-items: center;
    // justify-content: center;
    margin-bottom: 30rpx;

    .rank-tab {
      height: 60rpx;
      display: flex;
      align-items: center;
      // justify-content: center;
      box-sizing: border-box;
      color: #FFFFFF;
      font-weight: 600;
      font-size: 32rpx;

      &.active {
        color: #9570FF;
      }
    }

    .rank-tab-today {
      width: 120rpx;
      // border-right: solid 1rpx rgba(255, 255, 255, 0.5);
    }

    .rank-tab-city {
      width: 120rpx;
    }
  }

  // 排行榜主体
  .leaderboard-body {
    width: 100%;
    color: white;

    .rank-row {
      position: relative;
      width: 100%;
      height: 120rpx;
      display: flex;
      align-items: center;
      border-top: solid 1rpx white;
      box-sizing: border-box;

      // 前三名：紫色文字
      &.top-rank-row {
        .rank-num,
        .nick-name,
        .score-num {
          color: #b68cff !important;
        }
      }

      // 当前用户：紫色光晕
      &.my-rank-row {
        position: relative;
        overflow: hidden;
        background: transparent;

        box-shadow:
          0 0 30rpx rgba(185, 100, 255, 0.30),
          inset 0 0 30rpx rgba(185, 100, 255, 0.18);

        &::after {
          content: "";
          position: absolute;
          left: 10%;
          right: 10%;
          top: 10%;
          bottom: 10%;
          pointer-events: none;
          background: rgba(190, 105, 255, 0.42);
          filter: blur(22rpx);
          transform: scale(1.08);
          z-index: 0;
        }

        // 当前用户同时是前三名：文字改成白色
        &.top-rank-row {
          .rank-num,
          .nick-name,
          .score-num {
            color: white !important;
          }
        }

        .rank-num,
        .user-info,
        .score-num {
          position: relative;
          z-index: 1;
        }
      }

      .rank-num {
        width: 80rpx;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        font-size: 32rpx;
        color: white;
      }

      .user-info {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 0;

        .avatar {
          margin: 0 20rpx;
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;

          image {
            width: 100%;
            height: 100%;
          }
        }

        .nick-name {
          height: 100%;
          display: flex;
          align-items: center;
          color: white;
          font-size: 28rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .score-num {
        width: 100rpx;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 30rpx;
        color: white;
      }
    }
  }
}

// 底部按钮
.btn-container {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 90%;
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  padding-top: 70rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background: transparent;
  z-index: 100;

  &::before {
    content: "";
    position: absolute;
    left: -5%;
    right: -5%;
    top: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.35) 25%,
      rgba(0, 0, 0, 0.8) 55%,
      rgba(0, 0, 0, 1) 80%
    );
    pointer-events: none;
    z-index: -1;
  }

  .btn-home {
    float: left;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/car_detail/btn-home.png") top center no-repeat;
    background-size: 100% 100%;
    width: 125rpx;
    height: 24rpx;
  }

  .btn-experience {
    float: left;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/car_detail/btn-experience.png") top center no-repeat;
    background-size: 100% 100%;
    width: 363rpx;
    height: 30rpx;
  }
}
</style>