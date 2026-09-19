<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useMyStore } from '@/stores/modules/my'
import { onShow } from '@dcloudio/uni-app'
import { getUserInfoAPI } from '@/services/login'

// 获取用户信息
const myInfo = useMyStore()
console.log(myInfo.profile);
// const user_id = myInfo.profile!.user_id!
const getUserInfo = async() => {
  const open_id = myInfo.profile?.open_id;
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
      myInfo.setProfile(user_info);
  } else {
    uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~",
      duration: 1000
    });
  }
}
onShow(() => {
  getUserInfo();
})

// ==================== 页面跳转 ====================
// 返回主页，分为传不传参数两种
function navigateToHome(isExplore: boolean){
  if (isExplore) {
    console.log("带参跳转到地图页");
    uni.reLaunch({ url: "/pages/map/map?is_explore=music_lab"});
  } else {
    console.log("跳转到地图页");
    // uni.reLaunch({ url: "/pages/map/map"});
    uni.navigateBack({delta: 2});
  }
}

// ==================== 音乐播放 ====================
// 播放暂停控制
const isPlaying = ref(false); // 默认不播放
// 创建音频播放器
let audioContext: UniApp.InnerAudioContext | null = null
// 初始化音乐播放器
function initAudio() {
  const musicUrl = myInfo.profile?.music_url
  if (!musicUrl) {
    console.log('没有音乐地址')
    return
  }
  console.log('初始化音乐：', musicUrl)
  // 创建音频播放器
  audioContext = uni.createInnerAudioContext()
  // 设置音乐地址
  audioContext.src = musicUrl
  // 播放完成后循环
  audioContext.loop = true
  // ==================== 播放事件 ====================
  audioContext.onPlay(() => {
    console.log('音乐开始播放')
    isPlaying.value = true
  })
  // ==================== 暂停事件 ====================
  audioContext.onPause(() => {
    console.log('音乐暂停')
    isPlaying.value = false
  })
  // ==================== 播放结束 ====================
  audioContext.onEnded(() => {
    console.log('音乐播放完成')
    // 因为设置了 loop=true，
    // 正常情况下这里不会触发，
    // 如果触发了就手动重新播放
    audioContext?.play()
  })
  // ==================== 播放错误 ====================
  audioContext.onError((err) => {
    console.error('音乐播放失败：', err)
    isPlaying.value = false
    uni.showToast({
      title: '音乐播放失败',
      icon: 'none'
    })
  })
}

// 播放音乐
function playMusic() {
  if (!audioContext) {
    console.log('音频播放器不存在')
    initAudio()
  }
  if (!audioContext) {
    return
  }
  console.log('播放音乐')
  audioContext.play()
}

// 暂停音乐
function pauseMusic() {
  if (!audioContext) {
    return
  }
  console.log('暂停音乐')
  audioContext.pause()
}

// 点击播放/暂停按钮
function toggleMusic() {
  if (isPlaying.value) {
    // 当前正在播放 → 暂停
    pauseMusic()
  } else {
    // 当前没有播放 → 播放
    playMusic()
  }
}

// ==================== 页面生命周期 ====================
onMounted(() => {
  // 只有存在音乐的时候才初始化
  if (myInfo.profile?.music_time && myInfo.profile.music_time > 0) {
    initAudio()
  }
})

onUnmounted(() => {
  console.log('页面销毁，停止音乐')
  if (audioContext) {
    audioContext.stop()
    audioContext.destroy()
    audioContext = null
  }
})

// 下载音乐
function downloadMusic() {
  console.log("下载音乐");
  const musicUrl = myInfo.profile?.music_url;
  if (!musicUrl) {
    uni.showToast({ title: '没有音乐', icon: 'none' })
    return
  }
  uni.showLoading({ title: '下载中...' })
  // 下载音乐
  uni.downloadFile({
    url: musicUrl!,
    success: (downloadRes) => {
      console.log('下载成功：', downloadRes)
      if (downloadRes.statusCode === 200) {
        // 保存到手机
        uni.saveFile({
          tempFilePath: downloadRes.tempFilePath,
          success: (saveRes) => {
            uni.hideLoading()
            uni.openDocument({
              filePath: saveRes.savedFilePath,
              showMenu: true,
              success: () => {
                console.log("打开音乐文件成功");
              },
              fail: (err) => {
                console.log("打开音乐文件失败: ", err);
              }
            })            
          },
          fail: (err) => {
            uni.hideLoading()
            console.log('保存失败：', err)
            uni.showToast({
              title: '保存失败',
              icon: 'none'
            })
          }
        })

      } else {
        uni.hideLoading()
        uni.showToast({
          title: '音乐下载失败',
          icon: 'none'
        })
      }
    },
    fail: (err) => {
      uni.hideLoading()
      console.log('下载失败：', err)
      uni.showToast({
        title: '下载失败',
        icon: 'none'
      })
    }
  })
}


</script>

<template>
  <!-- 顶部按钮容器 -->
  <view class="top-container">
    <view class="language"></view>
  </view>
    <!-- Audi Vision内容介绍 -->
  <view v-if="myInfo.profile?.music_time==0" class="no-music">
    <view class="no-music-title"></view>
    <view class="no-music-content"></view>
    <view class="no-music-btn-container">
      <!-- <view class="btn-home" @tap="navigateToHome(false)"></view> -->
      <view class="btn-experience" @tap="navigateToHome(true)"></view>
    </view>
  </view>

  <view v-else class="music">
    <!-- 音乐容器 -->
    <view class="music-container">
      <view class="music-area">
        <!-- 需要旋转的唱片 -->
        <view class="record-card" :class="{ 'record-playing': isPlaying }"></view>
      </view>
    </view>
    <view class="music-title"></view>
    <view class="music-control" @tap="toggleMusic">
      <!-- 播放或者暂停按钮 -->
        <view v-if="!isPlaying" class="btn-play"></view>
        <view v-else class="btn-pause"></view>
    </view>
    <view class="music-btn-container">
      <view class="btn-home" @tap="navigateToHome(false)"></view>
      <!-- <view class="btn-download" @tap="downloadMusic"></view> -->
    </view>
  </view>

</template>

<style lang="scss">
page {
  background-color: black;
  width: 100vw;
  height: 100vh;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_detail/bg.jpg") top center no-repeat;
  background-size: cover;
  overflow: hidden;
  padding-top: 100rpx;
}
// 顶部Bar
.top-container {
  position: absolute;
  top: 20rpx;
  margin-left: 50%;
  transform: translateX(-50%);
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

.no-music {
  .no-music-title {
    position: absolute;
    top: 100rpx;
    margin-left: 30rpx;
    width: 621rpx;
    height: 116rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_detail/no-music-title.png") top center no-repeat;
    background-size: 100% 100%;
  }
  .no-music-content {
    margin-top: 200rpx;
    margin-left: 30rpx;
    width: 562rpx;
    height: 150rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_detail/no-music.png") top center no-repeat;
    background-size: 100% 100%;
  }
  .no-music-btn-container {
    position: absolute;
    bottom: 50rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    // background-color: pink;
    width: 90%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    // .btn-home {
    //   background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_detail/btn-home.png") top center no-repeat;
    //   background-size: 100% 100%;
    //   width: 125rpx;
    //   height: 24rpx;
    // }
    .btn-experience {
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_detail/btn-experience.png") top center no-repeat;
      background-size: 100% 100%;
      width: 295rpx;
      height: 31rpx;
    }
  }
}

.music {
  .music-container {
    position: absolute;
    top: 300rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 90%;
    .music-area {
      margin-top: -120rpx;
      margin-left: 50%;
      transform: translateX(-50%);
      width: 649rpx;
      height: 866rpx;
      .record-card {
        width: 948rpx;
        height: 948rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_detail/record-card.png") top center no-repeat;
        background-size: 100% 100%;
        animation: recordRotate 8s linear infinite;
        animation-play-state: paused;
      }
      .record-playing {
        animation-play-state: running;
      }
      @keyframes recordRotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }
  }
  .music-title {
    position: absolute;
    top: 100rpx;
    margin-left: 30rpx;
    width: 623rpx;
    height: 194rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_detail/music-title.png") top center no-repeat;
    background-size: 100% 100%;
  }

  // 音乐控制，需要在页面上垂直和水平方向都居中
  .music-control {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 164rpx;
    height: 164rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    .btn-play {
        width: 164rpx;
        height: 164rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_detail/play.png") top center no-repeat;
        background-size: 100% 100%;
    }
    .btn-pause {
      width: 164rpx;
      height: 164rpx;
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_detail/pause.png") top center no-repeat;
      background-size: 100% 100%;
    }
  }

  .music-btn-container {
    position: absolute;
    bottom: 80rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    // background-color: pink;
    width: 90%;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    .btn-home {
      float: left;
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_detail/btn-home.png") top center no-repeat;
      background-size: 100% 100%;
      width: 100rpx;
      height: 24rpx;
    }
    .btn-download {
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/music_lab_detail/btn-download.png") top center no-repeat;
      background-size: 100% 100%;
      width: 180rpx;
      height: 25rpx;
    }
  }
}

</style>