<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app'
import { useMyStore, useSystemStore } from '@/stores'
import type { TennisRankType } from '@/types/user_info'
import { getUserInfoAPI, getTennisRankAPI } from '@/services/login'

// 持久化存储
const myStore = useMyStore();
const mySystem = useSystemStore();
// 请求用户信息
const getUserInfo = async() => {
  const open_id = myStore.profile?.open_id;
  if (!open_id){
    console.log("未获取到用户信息，跳转到首首页");
    uni.navigateTo({url: "/pages/index/index"});
    return;
  }
  const userInfo = await getUserInfoAPI({open_id: open_id, city:"beijing", is_register: false})
  console.log("调取用户信息的结果为：", userInfo);
  if (0 == userInfo.errcode) {
    const user_info = userInfo.data.user_info;
      console.log("获取到的用户信息：", user_info);
      // 本地化存储
      myStore.setProfile(user_info);
  } else {
    uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~",
      duration: 1000
    });
  }
}

const rank_list = ref<TennisRankType[]>([])
// 请求排行榜信息
const getTennisRankInfo = async() => {
  const open_id = myStore.profile?.open_id;
  if (!open_id){
    console.log("未获取到用户信息，跳转到首首页");
    uni.navigateTo({url: "/pages/index/index"});
  }
  const rankInfo = await getTennisRankAPI()
  console.log("获取的排行榜结果为：", rankInfo);
  if (0 == rankInfo.errcode) {
    console.log("获取到的排行榜信息：", rank_list);
    rank_list.value = rankInfo.data.daily_rank!;
  } else {
    uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~",
      duration: 1000
    });
  }
}
// 判断当前排行榜位置是否有数据
function getRankItem(index: number) {
  return rank_list.value[index]
}
// 判断是不是当前用户
function isMyRank(item: TennisRankType | undefined) {
  if (!item) {
    return false
  }
  return item.open_id === myStore.profile?.open_id
}
// 判断是不是前三名
function isTopRank(item: TennisRankType | undefined) {
  if (!item) {
    return false
  }
  return item.rank <= 3
}
// mock排行榜数据
// rank_list.value = [
//   {
//     id: 0,
//     rank: 1,
//     user_id: "123456",
//     open_id: "osOks5RyQ28Z9S5DII5G3dbAfNFM",
//     nick_name: "audi-1",
//     avatar: "https://www.mbcstyle.cn/uploads/audi2026nbe/avatar/osOks5RyQ28Z9S5DII5G3dbAfNFM-1788708216.jpeg",
//     tennis_score: 100
//   },
//   {
//     id: 1,
//     rank: 2,
//     user_id: "123457",
//     open_id: "bbbb",
//     nick_name: "audi-2",
//     avatar: "https://www.mbcstyle.cn/uploads/audi2026nbe/avatar/osOks5RyQ28Z9S5DII5G3dbAfNFM-1788708216.jpeg",
//     tennis_score: 98
//   },
//   {
//     id: 2,
//     rank: 3,
//     user_id: "123458",
//     open_id: "cccc",
//     nick_name: "audi-3",
//     avatar: "https://www.mbcstyle.cn/uploads/audi2026nbe/avatar/osOks5RyQ28Z9S5DII5G3dbAfNFM-1788708216.jpeg",
//     tennis_score: 95
//   },
//   {
//     id: 3,
//     rank: 4,
//     user_id: "123459",
//     open_id: "qwer",
//     nick_name: "audi-4",
//     avatar: "https://www.mbcstyle.cn/uploads/audi2026nbe/avatar/osOks5RyQ28Z9S5DII5G3dbAfNFM-1788708216.jpeg",
//     tennis_score: 90
//   },
//   {
//     id: 4,
//     rank: 5,
//     user_id: "123460",
//     open_id: "eeee",
//     nick_name: "audi-5",
//     avatar: "https://www.mbcstyle.cn/uploads/audi2026nbe/avatar/osOks5RyQ28Z9S5DII5G3dbAfNFM-1788708216.jpeg",
//     tennis_score: 85
//   },
//   {
//     id: 5,
//     rank: 6,
//     user_id: "123461",
//     open_id: "ffff",
//     nick_name: "audi-6",
//     avatar: "https://www.mbcstyle.cn/uploads/audi2026nbe/avatar/osOks5RyQ28Z9S5DII5G3dbAfNFM-1788708216.jpeg",
//     tennis_score: 80
//   },
//   {
//     id: 6,
//     rank: 7,
//     user_id: "123462",
//     open_id: "gggg",
//     nick_name: "audi-7",
//     avatar: "https://www.mbcstyle.cn/uploads/audi2026nbe/avatar/osOks5RyQ28Z9S5DII5G3dbAfNFM-1788708216.jpeg",
//     tennis_score: 75
//   },
//   {
//     id: 7,
//     rank: 8,
//     user_id: "123463",
//     open_id: "osOks5RyQ28Z9S5DII5G3dbAfNFM",
//     nick_name: "audi-8",
//     avatar: "https://www.mbcstyle.cn/uploads/audi2026nbe/avatar/osOks5RyQ28Z9S5DII5G3dbAfNFM-1788708216.jpeg",
//     tennis_score: 70
//   },
//   {
//     id: 8,
//     rank: 9,
//     user_id: "123464",
//     open_id: "iiii",
//     nick_name: "audi-9",
//     avatar: "https://www.mbcstyle.cn/uploads/audi2026nbe/avatar/osOks5RyQ28Z9S5DII5G3dbAfNFM-1788708216.jpeg",
//     tennis_score: 65
//   },
//   {
//     id: 9,
//     rank: 10,
//     user_id: "osOks5RyQ28Z9S5DII5G3dbAfNFM",
//     open_id: "osOks5RyQ28Z9S5DII5G3dbAfNFM",
//     nick_name: "audi-10",
//     avatar: "https://www.mbcstyle.cn/uploads/audi2026nbe/avatar/osOks5RyQ28Z9S5DII5G3dbAfNFM-1788708216.jpeg",
//     tennis_score: 60
//   }
// ]


onShow(() => {
  getUserInfo();
  getTennisRankInfo();
})
// 下载视频
function downloadVideo() {
  console.log('下载视频')

  const videoUrl = myStore.profile?.latest_highlight_url;

  if (!videoUrl) {
    uni.showToast({
      title: '没有视频',
      icon: 'none'
    })
    return
  }

  uni.showLoading({
    title: '下载中...'
  })

  // 1. 下载视频到临时文件
  uni.downloadFile({
    url: videoUrl,

    success: (downloadRes) => {
      console.log('视频下载结果：', downloadRes)

      if (downloadRes.statusCode !== 200) {
        uni.hideLoading()

        uni.showToast({
          title: '视频下载失败',
          icon: 'none'
        })

        return
      }

      console.log('视频临时文件：', downloadRes.tempFilePath)

      // 2. 保存到手机系统相册
      uni.saveVideoToPhotosAlbum({
        filePath: downloadRes.tempFilePath,

        success: () => {
          uni.hideLoading()

          uni.showToast({
            title: '视频已保存',
            icon: 'success'
          })

          console.log('视频保存到相册成功')
        },

        fail: (err) => {
          uni.hideLoading()

          console.error('保存视频失败：', err)

          uni.showToast({
            title: '保存失败',
            icon: 'none'
          })
        }
      })
    },

    fail: (err) => {
      uni.hideLoading()

      console.error('视频下载失败：', err)

      uni.showToast({
        title: '下载失败',
        icon: 'none'
      })
    }
  })
}



function navitateToMP() {
  console.log("跳转到其它小程序页面")
}

// 返回主页，分为传不传参数两种
function navitateToHome(isExplore: boolean){
  if (isExplore) {
    console.log("带参跳转到地图页");
    uni.reLaunch({ url: "/pages/map/map?is_explore=audi_vision"});
  } else {
    console.log("跳转到地图页");
    // uni.reLaunch({ url: "/pages/map/map"});
    uni.navigateBack({delta: 2});
  }
}
function switchLanguage() {
  console.log("切换语言");
  mySystem.switchLanguage();
}
</script>

<template>
  <view class="page">
    <image
      class="page-bg"
      src="https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_detail/bg.jpg"
      mode="widthFix"
    />

    <view class="top-container">
      <!-- 标题 -->
        <view class="language" @tap="switchLanguage"></view>
    </view>
    <view class="score-container">
      <view v-if="mySystem.system_config.language=='en'" class="score-label"></view>
      <view v-else class="score-label-cn"></view>
      <view v-if="myStore.profile?.latest_tennis_time==0">
        <view v-if="mySystem.system_config.language=='en'" class="no-score"></view>
        <view v-else class="no-score-cn"></view>
      </view>
      
      <view v-else class="my-score">
        <view class="user-info">
          <!-- <view class="my-rank"> - </view> -->
          <view class="avatar">
            <image
              :src="myStore.profile?.avatar"
              mode="aspectFill"
            />
          </view>
          <view class="nick-name">{{ myStore.profile?.nick_name }}</view>
        </view>
        <view class="score-num">{{ myStore.profile?.latest_tennis_score }}</view>
      </view>
    </view>
    <view class="highlight-container">
      <view v-if="mySystem.system_config.language=='en'" class="highlight-label"></view>
      <view v-else class="highlight-label-cn"></view>
      <view v-if="myStore.profile?.latest_tennis_time==0">
        <view v-if="mySystem.system_config.language=='en'" >
          <view class="no-highlight"></view>
        </view>
        <view v-else>
          <view class="no-highlight-cn"></view>
        </view>
      </view>
      <view v-else class="my-highlight">
        <video
          class="video"
          :src="myStore.profile?.latest_highlight_url"
          autoplay
          loop
          :controls="true"
          object-fit="cover"
        ></video>
      </view>
    </view>

    <view class="leaderboard-container">
      <view v-if="mySystem.system_config.language=='en'" class="leaderboard-label"></view>
      <view v-else class="leaderboard-label-cn"></view>

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

            <!-- 排名 -->
            <view class="rank-num">
              {{ getRankItem(index - 1)?.rank }}
            </view>

            <!-- 用户信息 -->
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

            <!-- 分数 -->
            <view class="score-num">
              {{ getRankItem(index - 1)?.tennis_score }}
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
    <!-- <view class="btn-container">
      <view class="btn-home" @tap="navitateToHome"></view>
      <view class="btn-my-score" @tap="downloadVideo"></view>
    </view> -->
    <!-- 底部按钮栏 -->
    <view class="btn-container">
      <view v-if="myStore.profile?.latest_tennis_time==0">
        <view v-if="mySystem.system_config.language=='en'" >
          <view class="btn-explore" @tap="navitateToHome(true)"></view>
        </view>
        <view v-else>
          <view class="btn-explore-cn" @tap="navitateToHome(true)"></view>
        </view>
      </view>
      <view v-else class="photo-btn-container">
        <view v-if="mySystem.system_config.language=='en'" class="en-container">
          <view class="btn-home" @tap="navitateToHome(false)"></view>
          <view class="btn-download" @tap="downloadVideo"></view>
        </view>
        <view v-else class="cn-container">
          <view class="btn-home-cn" @tap="navitateToHome(false)"></view>
          <view class="btn-download-cn" @tap="downloadVideo"></view>
        </view>
      </view>
    </view>

  </view>
</template>

<style lang="scss">
// page {
//   background-color: black;
//   display: flex;
//   flex-direction: column;
//   align-items: center;

//   padding-bottom: 150rpx;
//   box-sizing: border-box;
// }

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

// 顶部Bar
.top-container {
  // position: absolute;
  // top: 50rpx;
  // margin-left: 50%;
  // transform: translateX(-50%);
  // margin-top: 20rpx;
  margin: 20rpx auto 0;
  // background-color: pink;
  width: 90%;

  .language {
    float: right;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-language.png") top center no-repeat;
    background-size: 100% 100%;
    width: 60rpx;
    height: 60rpx;
  }
}

.score-container {
  margin: 30rpx auto 0;
  width: 90%;
  // height: 332rpx;
  .score-label {
    margin-bottom: 50rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_detail/label-my-score.png") top center no-repeat;
    background-size: 100% 100%;
    width: 235rpx;
    height: 44rpx;
  }
  .score-label-cn {
    margin-bottom: 50rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/tennis_detail/标签-我的分数.png") top center no-repeat;
    background-size: 100% 100%;
    width: 187rpx;
    height: 37rpx;
  }
  .no-score {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_detail/no-score.png") top center no-repeat;
    background-size: 100% 100%;
    width: 556rpx;
    height: 152rpx;
  }
  .no-score-cn {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/tennis_detail/无分数记录.png") top center no-repeat;
    background-size: 100% 100%;
    width: 298rpx;
    height: 120rpx;
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
      }
    }
    .score-num {
      width: 100rpx;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 28rpx;
    }
  }
}
.highlight-container {
  margin: 50rpx auto 0;
  width: 90%;
  // height: 332rpx;
  .highlight-label {
    margin-bottom: 50rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_detail/label-highlight.png") top center no-repeat;
    background-size: 100% 100%;
    width: 408rpx;
    height: 43rpx;
  }
  .highlight-label-cn {
    margin-bottom: 50rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/tennis_detail/标签-高光视频.png") top center no-repeat;
    background-size: 100% 100%;
    width: 186rpx;
    height: 38rpx;
  }
  .no-highlight {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_detail/no-highlight.png") top center no-repeat;
    background-size: 100% 100%;
    width: 114rpx;
    height: 31rpx;
  }
  .no-highlight-cn {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/tennis_detail/无体验记录.png") top center no-repeat;
    background-size: 100% 100%;
    width: 189rpx;
    height: 30rpx;
  }
  .my-highlight {
    // border-top: solid 1rpx white;
    // border-bottom: solid 1rpx white;
    border-radius: 20rpx;
    overflow: hidden;
    background: #000;
    width: 650rpx;
    height: 866rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    video {
      width: 100%;
      height: 100%;
    }
  }

}

.leaderboard-container {
  margin: 50rpx auto 0;
  width: 90%;

  .leaderboard-label {
    margin-bottom: 50rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_detail/label-leaderboard.png") top center no-repeat;
    background-size: 100% 100%;
    width: 333rpx;
    height: 34rpx;
  }
  .leaderboard-label-cn {
    margin-bottom: 50rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/tennis_detail/标签-排行榜.png") top center no-repeat;
    background-size: 100% 100%;
    width: 138rpx;
    height: 38rpx;
  }

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

        // ==============================
        // 前三名：紫色文字
        // ==============================
        &.top-rank-row {
          .rank-num,
          .nick-name,
          .score-num {
            color: #b68cff !important;
          }
        }

        // ==============================
        // 当前用户：紫色光晕
        // ==============================
        &.my-rank-row {
          position: relative;
          overflow: hidden;
          background: transparent;
          // 整体非常轻的紫色环境光
          box-shadow:
            0 0 30rpx rgba(185, 100, 255, 0.30),
            inset 0 0 30rpx rgba(185, 100, 255, 0.18);

          // ==============================
          // 80% 区域的紫色背景 + 柔和羽化
          // ==============================
          &::after {
            content: "";
            position: absolute;

            // 中间主体占约 80%
            left: 10%;
            right: 10%;
            top: 10%;
            bottom: 10%;

            pointer-events: none;

            background: rgba(190, 105, 255, 0.42);

            // 重点：
            // 不让中间形成一条明显的“亮带”
            // 而是把整个 80% 区域整体模糊
            filter: blur(22rpx);

            // 稍微扩大模糊后的范围
            transform: scale(1.08);

            z-index: 0;
          }

          // ==============================
          // 当前用户如果同时是前三名
          // ==============================
          &.my-rank-row {
            .rank-num,
            .nick-name,
            .score-num {
              color: white !important;
            }
          }

          // 内容放在光晕上面
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

.btn-container {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 90%;
  padding-top: 70rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
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

  // 没有视频：Experience Now 在最左边
  .btn-explore {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_detail/btn-experience-now.png") top center no-repeat;
    background-size: 100% 100%;
    width: 230rpx;
    height: 31rpx;
  }
  .btn-explore-cn {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/tennis_detail/即刻体验按钮.png") top center no-repeat;
    background-size: 100% 100%;
    width: 125rpx;
    height: 30rpx;
  }

  // 有视频：Home 左边，Download 右边
  .photo-btn-container {
    width: 100%;
    .en-container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn-home {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_detail/btn-home.png") top center no-repeat;
        background-size: 100% 100%;
        width: 85rpx;
        height: 24rpx;
        flex-shrink: 0;
      }

      .btn-download {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/tennis_detail/btn-download.png") top center no-repeat;
        background-size: 100% 100%;
        width: 145rpx;
        height: 25rpx;
        flex-shrink: 0;
      }
    }
    .cn-container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn-home-cn {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/tennis_detail/主页按钮.png") top center no-repeat;
        background-size: 100% 100%;
        width: 61rpx;
        height: 30rpx;
        flex-shrink: 0;
      }
      .btn-download-cn {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/tennis_detail/下载按钮.png") top center no-repeat;
        background-size: 100% 100%;
        width: 61rpx;
        height: 30rpx;
        flex-shrink: 0;
      }
    }
  }
}

</style>