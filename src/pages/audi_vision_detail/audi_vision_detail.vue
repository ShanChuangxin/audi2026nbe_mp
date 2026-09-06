<!-- 与订单详情合并了 -->
<!-- 门禁（参与的）详情 -->

<script setup lang="ts">
import { ref } from 'vue';
import { useMyStore } from '@/stores/modules/my'


// 获取用户信息
const myInfo = useMyStore()
console.log(myInfo.profile);
// const user_id = myInfo.profile!.user_id!

// 返回主页，分为传不传参数两种
function navitateToHome(isExplore: boolean){
  if (isExplore) {
    console.log("带参跳转到地图页");
    uni.navigateTo({ url: "/pages/map/map?is_explore=audi_vision"});
  } else {
    console.log("跳转到地图页");
    uni.navigateTo({ url: "/pages/map/map"});
  }
}

// 下载照片
function downloadPhoto() {
  console.log("下载照片");
  const imageUrl = myInfo.profile?.photo_url;
  uni.showLoading({ title: '图片下载中...' })
  // 下载图片
  uni.downloadFile({
    url: imageUrl!,
    success: (downloadRes) => {
      console.log('下载成功：', downloadRes)
      if (downloadRes.statusCode === 200) {
        // 保存到手机相册
        uni.saveImageToPhotosAlbum({
          filePath: downloadRes.tempFilePath,
          success: () => {
            uni.hideLoading()
            uni.showToast({
              title: '图片已保存到相册',
              icon: 'success'
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
          title: '图片下载失败',
          icon: 'none'
        })
      }
    },
    fail: (err) => {
      uni.hideLoading()
      console.log('下载失败：', err)
      uni.showToast({
        title: '图片下载失败',
        icon: 'none'
      })
    }
  })
}


</script>

<template>
  <!-- 顶部按钮容器 -->
  <view class="top-container"></view>
    <!-- Audi Vision内容介绍 -->
  <view class="detail-content"></view>
  <!-- 照片容器 -->
  <view class="photo-container">
    <view v-if="myInfo.profile?.photo_time==0" class="no-photo"></view>
    <view v-else class="photo">
      <image
        :src="myInfo.profile?.photo_url" 
        mode="scaleToFill"
      />
      
    </view>
  </view>
  <!-- 底部按钮栏 -->
  <view class="btn-container">
    <view v-if="myInfo.profile?.photo_time==0">
      <view class="btn-explore" @tap="navitateToHome(true)"></view>
    </view>
    <view v-else class="photo-btn-container">
      <view class="btn-home" @tap="navitateToHome(false)"></view>
      <view class="btn-my-photo" @tap="downloadPhoto"></view>
    </view>
  </view>
  

</template>

<style lang="scss">
page {
  background-color: black;
  width: 100vw;
  height: 100vh;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_detail/bg.jpg") top center no-repeat;
  background-size: cover;
  overflow: hidden;
  padding-top: 100rpx;
}
// 顶部Bar
.top-container {
  position: absolute;
  top: 50rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  // background-color: pink;
  width: 90%;

  .language {
    float: right;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/language.png") top center no-repeat;
    background-size: 100% 100%;
    width: 60rpx;
    height: 60rpx;
  }
}
.detail-content {
  position: absolute;
  top: 150rpx;
  margin-left: 10rpx;
  width: 568rpx;
  height: 118rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_detail/content.png") top center no-repeat;
  background-size: 100% 100%;
}

.photo-container {
  position: absolute;
  top: 300rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 90%;
  .no-photo {
    margin-top: 100rpx;
    width: 459rpx;
    height: 152rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_detail/no-photo.png") top center no-repeat;
    background-size: 100% 100%;
  }
  .photo {
    margin-top: 20rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 649rpx;
    height: 866rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.btn-container {
  position: absolute;
  bottom: 50rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  // background-color: pink;
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btn-explore {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_detail/btn-explore-now.png") top center no-repeat;
    background-size: 100% 100%;
    width: 284rpx;
    height: 30rpx;
  }
  .photo-btn-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn-home {
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_detail/btn-home.png") top center no-repeat;
      background-size: 100% 100%;
      width: 125rpx;
      height: 24rpx;
    }
    .btn-my-photo {
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_detail/btn-download.png") top center no-repeat;
      background-size: 100% 100%;
      width: 222rpx;
      height: 24rpx;
    }
  }
  
}

</style>