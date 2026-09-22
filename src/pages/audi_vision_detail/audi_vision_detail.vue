<!-- 与订单详情合并了 -->
<!-- 门禁（参与的）详情 -->

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app'
import { useMyStore, useSystemStore } from '@/stores'
import { getUserInfoAPI } from '@/services/login'


// 获取用户信息
const myInfo = useMyStore()
console.log(myInfo.profile);
// const user_id = myInfo.profile!.user_id!
const mySystem = useSystemStore(); // 主要用于切换语言
function switchLanguage() {
  console.log("切换语言");
  mySystem.switchLanguage();
}

// 请求用户信息
const getUserInfo = async () => {
  const open_id = myInfo.profile?.open_id;
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
    myInfo.setProfile(user_info);
  } else {
    uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~",
      duration: 1000
    });
  }
}
// 页面显示
onShow(async () => {
  await getUserInfo();
});

// 返回主页，分为传不传参数两种
function navitateToHome(isExplore: boolean){
  if (isExplore) {
    console.log("带参跳转到地图页");
    // uni.reLaunch({ url: "/pages/map/map?is_explore=audi_vision"});
    uni.navigateBack({delta: 2});
  } else {
    console.log("跳转到地图页");
    // uni.reLaunch({ url: "/pages/map/map"});
    uni.navigateBack({delta: 2});
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
  <view class="top-container">
    <view class="language" @tap="switchLanguage"></view>
  </view>
    <!-- Audi Vision内容介绍 -->
  <view v-if="mySystem.system_config.language=='en'" class="detail-content"></view>
  <view v-else class="detail-content-cn"></view>
  <!-- 照片容器 -->
  <view class="photo-container">
    <view v-if="myInfo.profile?.photo_time==0" >
      <view v-if="mySystem.system_config.language=='en'" class="no-photo"></view>
      <view v-else class="no-photo-cn"></view>
    </view>
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
      <view v-if="mySystem.system_config.language=='en'"  class="btn-explore" @tap="navitateToHome(true)"></view>
      <view v-else class="btn-explore-cn" @tap="navitateToHome(true)"></view>
    </view>
    <view v-else class="photo-btn-container">
      <view v-if="mySystem.system_config.language=='en'" class="en-container" >
        <view class="btn-home" @tap="navitateToHome(false)"></view>
        <view class="btn-download" @tap="downloadPhoto"></view>
      </view>
      <view v-else class="cn-container">
        <view class="btn-home-cn" @tap="navitateToHome(false)"></view>
        <view class="btn-download-cn" @tap="downloadPhoto"></view>
      </view>
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
.detail-content {
  position: absolute;
  top: 100rpx;
  margin-left: 30rpx;
  width: 421rpx;
  height: 98rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_detail/content.png") top center no-repeat;
  background-size: 100% 100%;
}
.detail-content-cn {
  position: absolute;
  top: 100rpx;
  margin-left: 30rpx;
  width: 188rpx;
  height: 85rpx;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/audi_vision_detail/标题.png") top center no-repeat;
  background-size: 100% 100%;
}

.photo-container {
  position: absolute;
  top: 260rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 90%;
  .no-photo {
    // margin-top: 100rpx;
    width: 556rpx;
    height: 152rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_detail/no-photo.png") top center no-repeat;
    background-size: 100% 100%;
  }
  .no-photo-cn {
    // margin-top: 100rpx;
    width: 298rpx;
    height: 75rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/audi_vision_detail/无照片提示.png") top center no-repeat;
    background-size: 100% 100%;
  }
  .photo {
    margin-top: 20rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 661.5rpx;
    height: 441rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.btn-container {
  position: absolute;
  bottom: 80rpx;
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
    width: 230rpx;
    height: 31rpx;
  }
  .btn-explore-cn {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/audi_vision_detail/现在体验按钮.png") top center no-repeat;
    background-size: 100% 100%;
    width: 125rpx;
    height: 30rpx;
  }
  .photo-btn-container {
    width: 100%;
    .en-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn-home {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_detail/btn-home.png") top center no-repeat;
        background-size: 100% 100%;
        width: 85rpx;
        height: 24rpx;
      }
      .btn-download {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/audi_vision_detail/btn-download.png") top center no-repeat;
        background-size: 100% 100%;
        width: 145rpx;
        height: 25rpx;
      }
    }
    .cn-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn-home-cn {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/audi_vision_detail/主页按钮.png") top center no-repeat;
        background-size: 100% 100%;
        width: 61rpx;
        height: 30rpx;
      }
      .btn-download-cn {
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/audi_vision_detail/下载照片按钮.png") top center no-repeat;
        background-size: 100% 100%;
        width: 123rpx;
        height: 30rpx;
      }
    }
  }
  
}

</style>