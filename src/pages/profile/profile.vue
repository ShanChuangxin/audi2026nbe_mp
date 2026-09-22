<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { getUserInfoAPI, userLogoutAPI } from '@/services/login'
import { updateMyProfileAPI } from '@/services/profile'
import { useMyStore, useSystemStore } from '@/stores'
import type { UserInfoType } from '@/types/user_info'
import { onLoad } from '@dcloudio/uni-app'
//@ts-ignore
import UQRCode from "uqrcodejs"; // ts忽略了类型校验

/**
 * 生成用户二维码
 * 二维码内容就是用户 ID
 */
/**
 * 生成二维码
 */
const qrCodeUrl = ref("")
const generateQRCode = () => {
  const openId = profile.value?.open_id
  if (!openId) {
    console.log('没有 open_id，无法生成二维码')
    return
  }

  // 先读取本地缓存
  const cacheKey = `qrcode_${openId}`
  const cachedQRCode = uni.getStorageSync(cacheKey)
  if (cachedQRCode) {
    console.log('使用缓存二维码')
    qrCodeUrl.value = cachedQRCode
    return
  }

  console.log('重新生成二维码', openId)
  // 创建二维码实例
  const qrCode = new UQRCode()
  // 设置二维码内容
  qrCode.data = String(openId)
  // 二维码尺寸
  qrCode.size = 240;
  // 生成二维码数据
  qrCode.make()
  // 获取 Canvas 上下文
  const canvasContext = uni.createCanvasContext('qrcode')
  // 设置 Canvas 上下文
  qrCode.canvasContext = canvasContext
  // 绘制二维码
  qrCode.drawCanvas()
  // 等 Canvas 绘制完成
  setTimeout(() => {
    uni.canvasToTempFilePath({
      canvasId: 'qrcode',
      success: (res) => {
        console.log('二维码生成成功：', res.tempFilePath)
        // 最终只显示这个 image
        qrCodeUrl.value = res.tempFilePath
        // 保存缓存，不用每次进来都要重新生成
        uni.setStorageSync(cacheKey, res.tempFilePath)
      },
      fail: (err) => {
        console.error('二维码转换失败：', err)
      }
    })
  }, 100)
}

// 获取屏幕安全区域
const { safeAreaInsets } = uni.getSystemInfoSync()

// Pinia Store
const myStore = useMyStore()
const systemStore = useSystemStore()

// 当前页面用户信息
const profile = ref({} as UserInfoType)

// 是否正在编辑昵称
const isEditingName = ref(false)

// 输入框中的昵称
const nickNameInput = ref('')

// 是否正在上传昵称
// 防止重复请求
const isUpdatingName = ref(false)

// 响应式计算当前打卡数量
const experienceCount = computed(() => {
  if (!profile.value) {
    return 0
  }
  const experienceTimes = [
    profile.value.photo_time,
    profile.value.music_time,
    profile.value.latest_car_time,
    profile.value.latest_tennis_time,
    profile.value.cinema_time,
    profile.value.helly_hansen_time
  ]
  return experienceTimes.filter((time) => time && Number(time) !== 0).length;
})

/**
 * 获取用户信息
 */
const getUserInfoData = async () => {
  // 未登录或没有城市信息
  if (!myStore.profile?.open_id || !systemStore.system_config.city) {
    uni.reLaunch({
      url: '/pages/index/index'
    })
    return
  }

  try {
    const res = await getUserInfoAPI({
      open_id: myStore.profile.open_id,
      city: systemStore.system_config.city,
      is_register: false
    })
    console.log('获取的用户信息：', res)

    if (res.errcode === 0) {
      // 更新 Pinia Store
      myStore.setProfile(res.data.user_info);
      // 更新当前页面
      profile.value = res.data.user_info;
      // 初始化昵称输入框
      nickNameInput.value = res.data.user_info.nick_name || '';
      // 生成二维码
      // 等 Canvas 渲染完成
      setTimeout(() => {
        generateQRCode()
      }, 100)
    } else {
      uni.showToast({
        icon: 'none',
        title: res.errmsg || (systemStore.system_config.language=="cn" ? "网络错误~" : "Network error"),
        duration: 2000
      })
    }
  } catch (error) {
    console.error('获取用户信息失败：', error)

    uni.showToast({
      icon: 'none',
      title: systemStore.system_config.language=="cn" ? "网络错误~" : "Network error",
      duration: 2000
    })
  }
}

// 有关弹窗
const isPopWindow = ref(false);

/**
 * 页面加载
 */
onLoad(() => {
  getUserInfoData();
  isPopWindow.value = systemStore.system_config!.pop_ruler;
})

/**
 * 点击昵称
 * 进入编辑状态
 */
const editNickName = () => {
  // 正在提交时不允许再次编辑
  if (isUpdatingName.value) {
    return
  }

  // 将当前昵称放入输入框
  nickNameInput.value = profile.value.nick_name || ''

  // 进入编辑状态
  isEditingName.value = true
}

/**
 * 计算昵称的视觉长度
 *
 * 汉字 = 2
 * 英文、数字 = 1
 */
const getNickNameLength = (name: string) => {
  let length = 0
  for (const char of name) {
    // 中文及全角字符
    if (/[\u4e00-\u9fa5]/.test(char)) {
      length += 2
    } else {
      // 英文、数字等
      length += 1
    }
  }
  return length
}

/**
 * 昵称输入框失焦
 * 自动保存
 */
const onNickNameBlur = async () => {
  // 防止重复提交
  if (isUpdatingName.value) {
    return
  }

  // 获取修改后的昵称
  const nick_name = nickNameInput.value.trim()
  // 保存旧昵称
  const oldNickName = profile.value.nick_name || ''
  // 先退出编辑状态
  isEditingName.value = false

  // 昵称不能为空
  if (!nick_name) {
    uni.showToast({ icon: 'none', title: systemStore.system_config!.language == "cn" ? "昵称不能为空" : "Nickname is required" });
    // 恢复旧昵称
    nickNameInput.value = oldNickName;
    return
  }
  // 昵称长度限制
  if(getNickNameLength(nick_name) > 18) {
    uni.showToast({ icon: 'none', title: systemStore.system_config!.language == "cn" ? "昵称过长" : "Nickname is too long" });
    // 恢复旧昵称
    nickNameInput.value = oldNickName;
    return
  }
  // 昵称没有变化，不请求服务器
  if (nick_name === oldNickName) {
    return
  }

  // 开始提交
  isUpdatingName.value = true

  try {
    const user_id = myStore.profile!.user_id
    const open_id = myStore.profile!.open_id

    const res = await updateMyProfileAPI({
      user_id,
      open_id,
      nick_name
    })

    console.log('修改昵称结果：', res)

    if (res.errcode === 0) {
      // 如果后端返回完整的 user_info
      if (res.data?.user_info) {
        // 更新当前页面
        profile.value = res.data.user_info

        // 更新 Pinia Store
        myStore.setProfile(res.data.user_info)

        // 同步输入框
        nickNameInput.value = res.data.user_info.nick_name || ''
      } else {
        // 如果后端没有返回完整 user_info
        // 则手动更新昵称

        profile.value.nick_name = nick_name

        if (myStore.profile) {
          myStore.profile.nick_name = nick_name
        }

        nickNameInput.value = nick_name
      }

      uni.showToast({
        icon: 'success',
        title: systemStore.system_config!.language=="cn" ? "更新成功" : "Updated successfully"
      })
    } else {
      uni.showToast({
        icon: 'none',
        title: res.errmsg || (systemStore.system_config!.language=="cn" ? "更新失败" : "Update failed")
      })

      // 保存失败，恢复旧昵称
      nickNameInput.value = oldNickName
    }
  } catch (error) {
    console.error('修改昵称失败：', error)

    uni.showToast({
      icon: 'none',
      title: systemStore.system_config!.language=="cn" ? "网络错误~" : "Network error",
    })

    // 网络错误，恢复旧昵称
    nickNameInput.value = oldNickName
  } finally {
    // 恢复提交状态
    isUpdatingName.value = false
  }
}

/**
 * 上传头像
 */
const uploadFile = (file: string) => {
  uni.uploadFile({
    url: '/update_avatar',
    name: 'file',
    filePath: file,
    formData: {
      open_id: myStore.profile?.open_id
    },
    success: (res) => {
      console.log('头像上传结果：', res)
      if (res.statusCode === 200) {
        const result = JSON.parse(res.data)
        console.log('解析后的返回信息：', result)
        if (result.errcode === 0) {
          // 更新当前页面头像
          profile.value.avatar = result.data.avatar_url

          // 更新 Pinia Store 头像
          if (myStore.profile) {
            myStore.profile.avatar = result.data.avatar_url
          }
          uni.showToast({
            icon: 'success',
            title: systemStore.system_config!.language=="cn" ? "更新成功" : "Updated successfully"
          })
        } else {
          uni.showToast({
            icon: 'none',
            title: result.errmsg || (systemStore.system_config!.language=="cn" ? "更新失败" : "Update failed")
          })
        }
      } else {
        uni.showToast({
          icon: 'none',
          title: systemStore.system_config!.language=="cn" ? "上传失败" : "Upload failed"
        })
      }
    },

    fail: (error) => {
      console.error('上传头像失败：', error)
      uni.showToast({
        icon: 'none',
        title: systemStore.system_config!.language=="cn" ? "网络错误~" : "Network error",
      })
    }
  })
}

/**
 * 修改头像
 */
const onAvatarChange = () => {
  // H5 / APP
  // #ifdef H5 || APP-PLUS
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const tempFilePaths = res.tempFilePaths
      uploadFile(tempFilePaths[0])
    }
  })
  // #endif

  // 微信小程序
  // #ifdef MP-WEIXIN
  uni.chooseMedia({
    // 选择数量
    count: 1,
    // 只选择图片
    mediaType: ['image'],
    success: (res) => {
      const { tempFilePath } = res.tempFiles[0]
      uploadFile(tempFilePath)
    }
  })

  // #endif
}

// 临时打开弹窗
function openPopWindow() {
  isPopWindow.value = true;
}
// 关闭规则体验弹窗
function closePopWindow(){
  console.log("关闭规则体验弹窗");
  isPopWindow.value = false;
  systemStore.upatePopRuler(false); // 更新进本地存储
}

// 注销相关
const isPopCancelWindow = ref(false);

// 注销函数
const userLogout = async () => {
  const res = await userLogoutAPI({open_id: myStore.profile?.open_id!})
  console.log("注销请求结果：", res);
  if (0 === res.errcode) {
    console.log("注销成功");
    // 清除本地存储
    myStore.clearProfile();
    systemStore.clearSystemConfig();
    // 跳转到首页
     uni.reLaunch({
      url: '/pages/index/index'
    });
    return;
  } else {
    uni.showToast({
      icon: 'none',
      title: res.errmsg || (systemStore.system_config!.language=="cn" ? "网络错误~" : "Network error"),
      duration: 2000
    })
  }
}

function switchLanguage() {
  console.log("切换语言");
  systemStore.switchLanguage();
}

</script>

<template>

  <!-- 顶部 -->
  <view class="top-container">
    <!-- 标题 -->
      <view class="language" @tap="switchLanguage"></view>
      <!-- <view class="prize-ruler"></view> -->
  </view>

  <!-- 顶部个人信息 -->
  <view class="profile-container">
    <!-- 用户头像 -->
    <view class="head-container" @tap="onAvatarChange">
      <image class="image" :src="profile.avatar" mode="aspectFill" />
      <view class="avatar-update"></view>
    </view>

    <view class="info-container">
      <!-- 用户 ID -->
      <view class="user-id"> {{systemStore.system_config!.language=="en" ? "User ID: " : "用户ID："}}{{ profile.user_id }} </view>

      <!-- 用户昵称 -->
      <view class="user-name">
        <!-- 正常显示昵称 -->
        <view v-if="!isEditingName" class="nickname-text" @tap="editNickName" >
          <text class="nickname-value">{{ systemStore.system_config!.language=="en" ?  "Name: " : "昵称："}} {{ profile.nick_name || '点击设置昵称' }} </text>
          <text class="edit-icon"></text>
        </view>
        <!-- 编辑昵称 -->
        <input v-else v-model="nickNameInput" class="nickname-input" type="text" :focus="true" :maxlength="20" confirm-type="done" @blur="onNickNameBlur" />
      </view>
    </view>
  </view>

  <!-- 用户完成的打卡数量 -->
  <view class="experience-container">
    <view v-if="systemStore.system_config!.language=='en'" class="experience-label"></view>
    <view v-else class="experience-label-cn"></view>
    <view class="experience-count">
      {{ experienceCount }} / 6
    </view>
  </view>

  <!-- 礼物领取 -->
  <view class="gift-container">
    <view v-if="systemStore.system_config!.language=='en'" class="gift-label"></view>
    <view v-else class="gift-label-cn"></view>
    <view class="gift-icon" @tap="openPopWindow"> </view>
  </view>

  <!-- 用户二维码 -->
  <view class="qrcode-container">
    <view v-if="systemStore.system_config!.language=='en'" class="qrcode-label"></view>
    <view v-else class="qrcode-label-cn"></view>
    <view class="qrcode-bg">
      <!-- 最终显示的二维码 -->
      <image
        v-if="qrCodeUrl"
        class="qrcode-image"
        :src="qrCodeUrl"
        mode="aspectFit"
      />
    </view>
    <!-- 专门用于生成二维码的Canvas -->
      <canvas
        id="qrcode"
        canvas-id="qrcode"
        class="qrcode-generator"
      ></canvas>
  </view>

  <view v-if="systemStore.system_config!.language=='en'" class="btn-cancel" @tap="isPopCancelWindow=true"></view>
  <view v-else class="btn-cancel-cn" @tap="isPopCancelWindow=true"></view>

  <!-- 礼品规则弹窗 -->
  <view class="ruler-container" v-if="isPopWindow">
    <view class="pop-window" @tap.stop>
      <view class="text-content">
        <scroll-view class="scroll" enhanced scroll-y>
          <view v-if="systemStore.system_config!.language=='en'" class="prize-content"></view>
          <view v-else class="prize-content-cn"></view>
        </scroll-view>
      </view>
      <view v-if="systemStore.system_config!.language=='en'" class="btn-close" @tap="closePopWindow"></view>
      <view v-else class="btn-close-cn" @tap="closePopWindow"></view>
    </view>


      <!-- <view v-if="systemStore.system_config.language=='en'" class="pop-window" @tap.stop >
        <view class="pop-content"></view>
        <view class="btn-close" @tap="closePopWindow"></view> 
      </view>
      <view v-else class="pop-window-cn" @tap.stop >
        <view class="pop-content-cn"></view>
        <view class="btn-close-cn" @tap="closePopWindow"></view> 
      </view> -->
  </view>

  <!-- 注销规则弹窗 -->
  <view class="cancel-container" v-if="isPopCancelWindow" @tap="isPopCancelWindow=false">
      <view v-if="systemStore.system_config!.language=='en'" class="pop-window" @tap.stop >
        <view class="pop-content"></view>
        <view class="btn-container">
          <view class="btn-close" @tap="isPopCancelWindow=false"> </view>
          <view class="btn-confirm" @tap="userLogout"> </view>
        </view>
      </view>

      <view v-else class="pop-window-cn" @tap.stop >
        <view class="pop-content-cn"></view>
        <view class="btn-container-cn">
          <view class="btn-close-cn" @tap="isPopCancelWindow=false"> </view>
          <view class="btn-confirm-cn" @tap="userLogout"> </view>
        </view>
      </view>
  </view>

</template>

<style lang="scss">
page {
  background-color: black;
  width: 100vw;
  height: 100vh;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/bg.jpg") top center no-repeat;
  background-size: cover;
  overflow: hidden;
  // padding-top: 100rpx;
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
    margin-left: 40rpx;
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/map/btn-language.png") top center no-repeat;
    background-size: 100% 100%;
    width: 60rpx;
    height: 60rpx;
  }
}

/* 顶部个人信息 */
.profile-container {
  margin-top: 170rpx;
  width: 750rpx;
  height: 360rpx;
  position: relative;
  box-sizing: border-box;

  /* 用户头像 */
  .head-container {
    position: relative;
    margin-left: 50%;
    transform: translateX(-50%);
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/avatar-border.png") top center no-repeat;
    background-size: 100% 100%;
    width: 164rpx;
    height: 164rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    // border: solid 2px white;
    // border-radius: 100rpx;
    // overflow: hidden;
    image {
      width: 90%;
      height: 90%;
      border-radius: 100rpx;
      overflow: hidden;
    }
    .avatar-update {
      position: absolute;
      right: 8rpx;
      bottom: 0rpx;
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/update-avatar.png") top center no-repeat;
      background-size: 100% 100%;
      width: 45rpx;
      height: 45rpx;
    }
  }

  // 用户信息
  .info-container {
    margin-top: 40rpx;
    margin-left: 50%;
    transform: translateX(-50%);
    width: 56%;
    height: 300rpx;
    // background-color: pink;
    /* 用户 ID */
    .user-id {
      margin-top: 15rpx;
      text-align: left;
      color: white;
      font-size: 28rpx;
    }
    /* 昵称区域 */
    .user-name {
      margin-top: 15rpx;
      width: 100%;
      min-height: 60rpx;
    }
    /* 普通显示昵称 */
    .nickname-text {
      display: flex;
      align-items: center;
      width: 100%;
      // padding: 10rpx 20rpx;
      color: white;
      font-size: 28rpx;
      font-weight: 400;
      white-space: nowrap;
      .nickname-value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        min-width: 0;
      }
      .edit-icon {
        flex-shrink: 0;
        margin-left: 15rpx;
        // font-size: 26rpx;
        // opacity: 0.8;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/update-nickname.png") top center no-repeat;
        background-size: 100% 100%;
        width: 24rpx;
        height: 24rpx;
      }
    }

    /* 编辑昵称输入框 */
    .nickname-input {
      width: 400rpx;
      height: 60rpx;
      text-align: center;
      color: white;
      font-size: 30rpx;
      border-bottom: 1px solid white;
    }
  }
}

// 用户完成的打卡数量
.experience-container {
  margin-left: 50%;
  transform: translateX(-50%);
  width: 84%;
  height: 130rpx;
  border-top: solid #D9D8DD 1rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .experience-label {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/label-experience.png") top center no-repeat;
    background-size: 100% 100%;
    width: 167rpx;
    height: 31rpx;
  }
  .experience-label-cn {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/profile/标签-已参与互动.png") top center no-repeat;
    background-size: 100% 100%;
    width: 167rpx;
    height: 30rpx;
  }
  .experience-count {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #9570FF;
  }
}

// 礼物按钮
.gift-container {
  margin-left: 50%;
  transform: translateX(-50%);
  width: 84%;
  height: 130rpx;
  border-top: solid #D9D8DD 1rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .gift-label {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/label-gift.png") top center no-repeat;
    background-size: 100% 100%;
    width: 328rpx;
    height: 32rpx;
  }
  .gift-label-cn {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/profile/标签-礼品兑换.png") top center no-repeat;
    background-size: 100% 100%;
    width: 137rpx;
    height: 30rpx;
  }
  .gift-icon {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/gift-icon.png") top center no-repeat;
    background-size: 100% 100%;
    width: 45rpx;
    height: 45rpx;
  }
}


/* 二维码 */
.qrcode-container {
  // position: relative;
  margin: auto;
  padding-top: 50rpx;
  // background-color: pink;
  border-top: solid #D9D8DD 1rpx;
  width: 84%;
  .qrcode-label {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/label-qrcode.png") top center no-repeat;
    background-size: 100% 100%;
    width: 128rpx;
    height: 29rpx;
  }
  .qrcode-label-cn {
    background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/profile/标签-二维码.png") top center no-repeat;
    background-size: 100% 100%;
    width: 105rpx;
    height: 30rpx;
  }
  .qrcode-bg {
    margin: 80rpx auto 0;
    width: 290rpx;
    height: 290rpx;
    display: flex;
    // flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 21rpx;
    // padding: 30rpx;
    box-sizing: border-box;
    .qrcode-image {
      width: 130px;
      height: 130px;
    }
  } 
  /*
   * 这个 Canvas 只用于生成二维码
   * 不让它参与正常页面布局
   */
  .qrcode-generator {
    position: fixed;
    left: -1000px;
    top: -1000px;

    width: 240px;
    height: 240px;

    opacity: 0;
    pointer-events: none;
  }
}

// 注销按钮
.btn-cancel {
  margin: 50rpx auto 0;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/btn-cancel.png") top center no-repeat;
  background-size: 100% 100%;
  width: 84rpx;
  height: 22rpx;
}
.btn-cancel-cn {
  margin: 50rpx auto 0;
  background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/profile/按钮注销.png") top center no-repeat;
  background-size: 100% 100%;
  width: 61rpx;
  height: 30rpx;
}

// 礼品规则弹窗
  .ruler-container {
    position: absolute;
    top: 0rpx;
    left: 0rpx;
    width: 100vw;
    height: 100vh;
    // z-index: 99999;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: black;
    // opacity: .5;
    background-color: rgba(0, 0, 0, .5);
    // 模糊后面的地图
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    .pop-window {
      transform: translateY(-3vh);
      position: relative;
      // background-color: pink;
      width: 610rpx;
      height: 1204rpx;
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/ruler-prize-bg.png") top center no-repeat;
      background-size: 100% 100%;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .text-content {
        margin: 10rpx auto 10rpx;
        width: 600rpx;
        height: 1000rpx;
        overflow: hidden;
        .scroll {
          width: 600rpx;
          height: 960rpx;
          .prize-content {
            margin: 0 auto 150rpx;
            width: 539rpx;
            height: 1613rpx;
            background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/ruler-prize.png") top center no-repeat;
            background-size: 100% 100%;
          }
          .prize-content-cn {
            margin: 0 auto 150rpx;
            width: 539rpx;
            height: 1232rpx;
            background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/profile/礼品兑换机制.png") top center no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      .btn-close {
        // background-color: pink;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/btn-close-prize.png") top center no-repeat;
        background-size: 100% 100%;
        width: 522rpx;
        height: 57rpx;
      }
      .btn-close-cn {
        // background-color: pink;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/profile/关闭礼品兑换弹窗.png") top center no-repeat;
        background-size: 100% 100%;
        width: 536rpx;
        height: 78rpx;
      }
    }
    // .pop-window-cn {
    //   width: 666rpx;
    //   height: 100%;
    //   // background-color: pink;
    //   z-index: 100000;
    //   display: flex;
    //   flex-direction: column;
    //   align-items: center;
    //   .pop-content-cn {
    //     margin: 60rpx auto;
    //     position: relative;
    //     width: 648rpx;
    //     height: 998rpx;
    //     background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/profile/礼品兑换机制.png") top center no-repeat;
    //     background-size: 100% 100%;
    //   }
    //   .btn-close-cn {
    //     // background-color: pink;
    //     background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/profile/关闭礼品兑换弹窗.png") top center no-repeat;
    //     background-size: 100% 100%;
    //     width: 648rpx;
    //     height: 60rpx;
    //   }
    // }
  }

  // 注销规则弹窗
  .cancel-container {
    position: fixed;
    top: 0rpx;
    left: 0rpx;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    // overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: black;
    // opacity: .5;
    background-color: rgba(0, 0, 0, .5);
    // 模糊后面的地图
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    .pop-window {
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/cancel-bg.png") top center no-repeat;
      background-size: 100% 100%;
      width: 643rpx;
      height: 561rpx;
      // background-color: pink;
      z-index: 100000;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      // align-items: center;
      .pop-content {
        margin: 80rpx auto 0;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/cancel-content.png") top center no-repeat;
        background-size: 100% 100%;
        width: 539rpx;
        height: 222rpx;
      }
      .btn-container {
        margin: 40rpx auto 0;
        width: 540rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn-close {
          margin-top: 50rpx;
          // background-color: pink;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/btn-close-cancel.png") top center no-repeat;
          background-size: 100% 100%;
          width: 258rpx;
          height: 63rpx;
        }
        .btn-confirm {
          margin-top: 50rpx;
          // background-color: pink;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/btn-confirm-cancel.png") top center no-repeat;
          background-size: 100% 100%;
          width: 258rpx;
          height: 63rpx;
        }
      }
      
    }
    .pop-window-cn {
      background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/profile/cancel-bg.png") top center no-repeat;
      background-size: 100% 100%;
      width: 643rpx;
      height: 561rpx;
      // background-color: pink;
      z-index: 100000;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      // align-items: center;
      .pop-content-cn {
        margin: 80rpx auto 0;
        background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/profile/注销账户说明.png") top center no-repeat;
        background-size: 100% 100%;
        width: 539rpx;
        height: 186rpx;
      }
      .btn-container-cn {
        margin: 40rpx auto 0;
        width: 540rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn-close-cn {
          margin-top: 50rpx;
          // background-color: pink;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/profile/关闭注销窗口.png") top center no-repeat;
          background-size: 100% 100%;
          width: 258rpx;
          height: 78rpx;
        }
        .btn-confirm-cn {
          margin-top: 50rpx;
          // background-color: pink;
          background: url("https://www.mbcstyle.cn/projects/static/audi2026nbe/cn/profile/确认注销.png") top center no-repeat;
          background-size: 100% 100%;
          width: 258rpx;
          height: 78rpx;
        }
      }
      
    }
  
  }

</style>
