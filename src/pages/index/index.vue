<!-- TabBar主页 -->

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useMeetingRoomList } from '@/composables'
import { useMyStore, useSystemStore } from '@/stores'
import type { UserInfoType } from '@/types/user_info'
import { getOpenIdAPI, getUserInfoAPI } from '@/services/login'

const currentCity = "shanghai";

// 持久化存储
const myStore = useMyStore();
const systemStore = useSystemStore();
// 更新城市
onLoad(() => {
    systemStore.updateCity("shanghai")
    console.log(
        "当前系统配置:",
        systemStore.system_config
    )
})

// 获取页面参数
// 页面参数通过defineProps来定义
// 注意是把多个不同情况下传的不同参数取并集，且是可选的
const query = defineProps<{
  scene: string // scene是获取小程序码中官方指定的唯一参数scene，需要解码出需要的参数
}>();

// 获取 code 登录凭证
// 获取微信登录的凭证
let open_id = '';
const getOpenId = async () => {
  const res = await wx.login();  // 根据微信的官方文档需要调取用于获取code
  console.log("wx.login的结果：", res);
  const jscode = res.code;
  const getOpenId = await getOpenIdAPI({jscode});
  console.log("获取的openid信息：", getOpenId);
  if (0 == getOpenId.errcode){
    open_id = getOpenId.data.open_id;
    // 请求用户信息
    const getUserInfo = await getUserInfoAPI({open_id, city: currentCity, is_register: true})
    console.log("调取用户信息的结果为：", getUserInfo);
    if (0 == getUserInfo.errcode) {
      const user_info = getUserInfo.data.user_info;
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
  } else {
    uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~"
    });
  }
}
onLoad(async () => {
  // 注意，这里可以同时进行，而不是一个完成后再处理另外一个；等所有都完成后，才会往下继续执行代码
  // await Promise.all([getSwiperData(), getOpenId()])
  getOpenId();
});



// 解析scene中的参数
    // const scene = decodeURIComponent(query.scene) // 把scene中的值转化为字符串（生成小程序码时传的字符串）
    // const query_info = parseScene(scene)  // 把字符串转化为对象形式
    // console.log("获取到了参数：", query_info)
    // if (query_info.hasOwnProperty("promotion_id")) {
    //   // 必须先登录才能获取权益
    //   if (!myStore.profile) {  // 未登录，跳转到登录页面
    //     uni.navigateTo({ url: "/pages/login/login" })
    //     return
    //   }
  

// 页面跳转
// uni.navigateTo({ url: `/pages/office_list/office_list?num_type=${peopleNum.value}&table_type=${iconTypeListParam[selectedTableType.value].text}&city_type=${cityTypeListParam[selectedCityType.value].text}&purpose_type=${purposeTypeListParam[selectedPurposeType.value].text}&building_id=` })

// 显示隐私条款
const showPrivacy = ref(true);  // false为不显示弹窗；true为显示弹窗

// 关闭隐私条款弹窗
function closePopWindow(){
  console.log("关闭隐私条款弹窗");
  showPrivacy.value = false;
  // 跳转至地图页面
  navigateToMapPage();
}

// 解析scene参数中的值
function parseScene(scene: string): Record<string, string> {
  const params: Record<string, string> = {}; // 明确指定类型
  scene.split("&").forEach(item => {
    const [key, value] = item.split("=");
    if (key && value) {
      params[key] = value;
    }
  });
  return params;
}

// 页面加载
onLoad(async () => {
  const scene = decodeURIComponent(query.scene)
  console.log("scene:", parseScene(scene))
})
// onShow(
//   ()=>{
//     bindPromotionInfo()
//   }
// )

// 开屏动画相关
const showSplash = ref(true);
const isFadeOut = ref(false);
let timer = null;

onMounted(() => {
	// 例如视频最长 5 秒，6 秒后强制关闭
	timer = setTimeout(() => {
		closeSplash()
	}, 7000)
})

const videoPlay = () => {
    console.log("视频开始播放")
}
const videoEnded = () => {
	console.log('视频播放结束')
  closeSplash();
}
const videoError = (e) => {
    console.log("视频加载失败", e)
}
const closeSplash = () => {
	if (isFadeOut.value) return

	isFadeOut.value = true

	if (timer) {
		clearTimeout(timer)
	}

	setTimeout(() => {
		showSplash.value = false
	}, 800)
}

onUnmounted(() => {
	if (timer) {
		clearTimeout(timer)
	}
})

// 跳转到地图页面
function navigateToMapPage() {
  // 把填写的信息以参数形式传到列表页面
  console.log("跳转到地图页面")
  // uni.navigateTo({ url: `/pages/office_list/office_list?num_type=${peopleNum.value}&table_type=${selectedTableType.value}&city_type=${selectedCityType.value}&purpose_type=${selectedPurposeType.value}` })
  uni.navigateTo({url: "/pages/map/map"});

}

</script>

<template>
  <view class="page-container">
    <view class="body-view">
      <!-- <view class="explore" @tap="navigateToMapPage"></view> -->
    </view>

    <!-- 隐私条款弹窗 -->
    <view class="privacy-container" v-if="showPrivacy" @touchmove.stop.prevent="">
        <view class="pop-window">
          <view class="privacy-title"></view>
          <view class="privacy-content"></view>
          <view class="btn-agree" @tap="closePopWindow">
          </view> 
        </view>
    </view>

    <!-- 开屏动画 -->
    <view
			v-if="showSplash"
			class="splash"
			:class="{ fadeOut: isFadeOut }"
		>
			<video
				class="splash-video"
				src="https://www.mbcstyle.cn/projects/static/audi2026nbe/splash.mp4"
				autoplay
				:controls="false"
				:show-center-play-btn="false"
				:show-play-btn="false"
				:enable-progress-gesture="false"
				object-fit="cover"
        @play="videoPlay"
        @ended="videoEnded"
        @error="videoError"
			/>
		</view>

  </view>

</template>

<style lang="scss">

.page-container {
  .body-view {
    // background-color: #f6f6f6; 
    background-color: skyblue;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/index/bg.png") top center no-repeat;
    background-size: 100% 100%;
    width: 100vw;
    height: 100vh;

    .explore {
      position: absolute;
      bottom: 300rpx;
      margin-left: 50%;
      transform: translateX(-50%);
      background-color: pink;
      width: 300rpx;
      height: 80rpx;
    }

  }

  // 隐私条款弹窗
  .privacy-container {
    position: absolute;
    top: 0rpx;
    left: 0rpx;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: black;
    // opacity: .5;
    background-color: rgba(0, 0, 0, .5);
    
    .pop-window {
      width: 538rpx;
      height: 949rpx;
      // background-color: pink;
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/index/pop-window.png") top center no-repeat;
      background-size: 100% 100%;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .privacy-title {
        margin-top: 50rpx;
        width: 345rpx;
        height: 70rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/index/privacy-title.png") top center no-repeat;
        background-size: 100% 100%;
      }
      .privacy-content {
        margin-top: 50rpx;
        width: 389rpx;
        height: 465rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/index/privacy-content.png") top center no-repeat;
        background-size: 100% 100%;
      }

      .btn-agree {
        margin-top: 50rpx;
        width: 394rpx;
        height: 60rpx;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/index/btn-agree.png") top center no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  // 开屏层
  .splash {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    opacity: 1;
    transition: opacity 0.8s ease;
  }
  /* 视频 */
  .splash-video {
    width: 100%;
    height: 100%;
  }
  /* 淡出 */
  .fadeOut {
    opacity: 0;
    pointer-events: none;
  }
}


</style>
