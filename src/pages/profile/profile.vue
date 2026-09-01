<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { getUserInfoAPI } from '@/services/login'
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
const generateQRCode = () => {
  const openId = profile.value?.open_id
  if (!openId) {
    console.log('没有 open_id，无法生成二维码')
    return
  }
  console.log('开始生成二维码：', openId)
  // 创建二维码实例
  const qrCode = new UQRCode()
  // 设置二维码内容
  qrCode.data = String(openId)
  // 二维码尺寸
  qrCode.size = 120;
  // 生成二维码数据
  qrCode.make()
  // 获取 Canvas 上下文
  const canvasContext = uni.createCanvasContext('qrcode')
  // 设置 Canvas 上下文
  qrCode.canvasContext = canvasContext
  // 绘制二维码
  qrCode.drawCanvas()
  console.log('二维码绘制完成')
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
    profile.value.car_time,
    profile.value.tennis_time
  ]
  return experienceTimes.filter((time) => time && Number(time) !== 0).length;
})

/**
 * 获取用户信息
 */
const getUserInfoData = async () => {
  // 未登录或没有城市信息
  if (!myStore.profile?.open_id || !systemStore.system_config.city) {
    uni.navigateTo({
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
        title: res.errmsg || '网络错误~',
        duration: 2000
      })
    }
  } catch (error) {
    console.error('获取用户信息失败：', error)

    uni.showToast({
      icon: 'none',
      title: '网络错误~',
      duration: 2000
    })
  }
}

/**
 * 页面加载
 */
onLoad(() => {
  getUserInfoData()
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
    uni.showToast({ icon: 'none', title: '昵称不能为空' });

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
        title: '修改成功'
      })
    } else {
      uni.showToast({
        icon: 'none',
        title: res.errmsg || '修改失败'
      })

      // 保存失败，恢复旧昵称
      nickNameInput.value = oldNickName
    }
  } catch (error) {
    console.error('修改昵称失败：', error)

    uni.showToast({
      icon: 'none',
      title: '网络错误~'
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
      user_id: myStore.profile?.user_id
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
            title: '更新成功'
          })
        } else {
          uni.showToast({
            icon: 'none',
            title: result.errmsg || '更新失败'
          })
        }
      } else {
        uni.showToast({
          icon: 'none',
          title: '上传失败'
        })
      }
    },

    fail: (error) => {
      console.error('上传头像失败：', error)

      uni.showToast({
        icon: 'none',
        title: '网络错误~'
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
</script>

<template>
  <!-- 顶部个人信息 -->
  <view class="profile-container">
    <!-- 用户头像 -->
    <view class="head-container" @tap="onAvatarChange">
      <image class="image" :src="profile.avatar" mode="aspectFill" />
    </view>

    <!-- 用户 ID -->
    <view class="user-id"> ID：{{ profile.user_id }} </view>

    <!-- 用户昵称 -->
    <view class="user-name">
      <!-- 正常显示昵称 -->
      <view v-if="!isEditingName" class="nickname-text" @tap="editNickName" >
        <text> 昵称：{{ profile.nick_name || '点击设置昵称' }} </text>
        <text class="edit-icon"> ✎ </text>
      </view>
      <!-- 编辑昵称 -->
      <input v-else v-model="nickNameInput" class="nickname-input" type="text" :focus="true" :maxlength="20" confirm-type="done" @blur="onNickNameBlur" />
    </view>


  </view>

  <!-- 用户完成的打卡数量 -->
  <view class="experience-count">
    {{ experienceCount }} / 4
  </view>

  <!-- 用户二维码 -->
  <view class="qrcode-container">
    <canvas
      id="qrcode"
      canvas-id="qrcode"
      class="qrcode"
    ></canvas>
    <view class="qrcode-id">
      {{ profile.open_id }}
    </view>
  </view>

</template>

<style lang="scss">
page {
  background-color: #f5f5f5;
}

/* 顶部个人信息 */
.profile-container {
  width: 750rpx;
  height: 410rpx;

  background:
    url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/profile-bg.png")
    bottom center
    no-repeat;

  background-size: 100% 100%;

  position: relative;
  box-sizing: border-box;

  padding-top: 60rpx;

  /* 用户头像 */
  .head-container {
    margin-left: 50%;
    transform: translateX(-50%);

    width: 180rpx;
    height: 180rpx;

    border: solid 2px white;
    border-radius: 100rpx;

    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }
  }

  /* 用户 ID */
  .user-id {
    margin-top: 15rpx;

    text-align: center;

    color: white;
    font-size: 26rpx;
  }

  /* 昵称区域 */
  .user-name {
    margin-top: 15rpx;

    width: 100%;
    min-height: 60rpx;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 普通显示昵称 */
  .nickname-text {
    display: flex;
    align-items: center;

    padding: 10rpx 20rpx;

    color: white;
    font-size: 30rpx;

    .edit-icon {
      margin-left: 15rpx;

      font-size: 26rpx;

      opacity: 0.8;
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
/* 二维码 */
.qrcode-container {
  margin: 40rpx auto 0;
  width: 360rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 21rpx;
  padding: 30rpx;
  box-sizing: border-box;
}

.qrcode {
  width: 120px;
  height: 120px;
}

.qrcode-id {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #333;
  text-align: center;
  word-break: break-all;
}
</style>
