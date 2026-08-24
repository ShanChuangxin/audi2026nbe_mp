<script setup lang="ts">
import { ref } from 'vue';
import { useMyStore } from '@/stores/modules/my'
import { onLoad } from '@dcloudio/uni-app'
import type { UserInfoType } from '@/types/user_info'
import { getOpenIdAPI, postLoginWxMinAPI } from '@/services/login'




// 条件编译：以特殊注释开头，并且要有结尾包裹；符合条件了则会编译
// #ifdef MP-WEIXIN
// 获取 code 登录凭证
// 获取微信登录的凭证
let open_id = ''
const getOpenId = async () => {
  const res = await wx.login()  // 根据微信的官方文档需要调取用于获取code
  console.log("wx.login的结果：", res)
  const jscode = res.code
  const getOpenId = await getOpenIdAPI({jscode})
  console.log("获取的openid信息：", getOpenId)
  if (0 == getOpenId.errcode){
    open_id = getOpenId.data.open_id
  } else {
    uni.showToast({
      icon: 'none',
      title: "网络不佳，请稍后重试~"
    })
  }
}
onLoad(async () => {
  // 注意，这里可以同时进行，而不是一个完成后再处理另外一个；等所有都完成后，才会往下继续执行代码
  // await Promise.all([getSwiperData(), getOpenId()])
})

// 微信小程序获取用户手机号码
// 工作场景：完成认证的企业小程序；且微信号开发到开发者列表中
const onGetphonenumber: UniHelper.ButtonOnGetphonenumber = async (ev) => {  // ts通过UniHelper来指定亦是的类型；指定类型后，ev也自动有了类型
  await checkedAgreePrivacy()
  console.log(ev.detail)
  
  if (!isAgreePrivacy.value) return;

  const { code, encryptedData, iv } = ev.detail // 解析赋值。其实新版本，只需要code传上去就行
  
  const res = await postLoginWxMinAPI({ code: code!, encryptedData, iv, open_id})
  console.log("获取的登录信息：", res)
  if (0 == res.errcode){  // 登录成功
    loginSuccess(res.data.user_info)
  } else {
    uni.showToast({
      icon: 'none',
      title: '登录失败，请稍后重新登录~',
    })
  }
}
// #endif

// 登录成功处理函数
const loginSuccess = (profile: UserInfoType) => {
  // 1. 保存会员信息
  const myStore = useMyStore()
  myStore.setProfile(profile)
  // 2. 成功提示
  uni.showToast({ icon: 'success', title: '登录成功' })
  // 3. 页面跳转；加个定时器，这样可以显示完提示再跳转
  setTimeout(() => {
    // uni.switchTab({ url: '/pages/my/my' }) // 跳转到tabbar页面，并关闭其它所有非tabbar页面（页面的提示也会被瞬间关掉）
    uni.navigateBack()  // 跳转到之前的页面
  }, 500)
}

// 请先阅读并勾选协议
const isAgreePrivacy = ref(false)  // 默认同意许可
const isAgreePrivacyShakeY = ref(false)
const checkedAgreePrivacy = async () => {
  if (!isAgreePrivacy.value) {
    uni.showToast({
      icon: 'none',
      title: '请先阅读并勾选协议',
    })
    // 震动提示
    isAgreePrivacyShakeY.value = true
    setTimeout(() => {
      isAgreePrivacyShakeY.value = false
    }, 500)
    // 返回错误
    return Promise.reject(new Error('请先阅读并勾选协议'))
  }
}

const onOpenPrivacyContract = () => {
  // #ifdef MP-WEIXIN
  // 跳转至隐私协议页面
  // wx.openPrivacyContract({})
  // #endif
}

// 轮播图相关的内容
const activeIndex = ref(0)
// 当 swiper 下标发生变化时触发(轮播图滚动时，下标就会发生变化)
// const onChange: UniHelper.SwiperOnChange = (ev) => {
const onChange: UniHelper.SwiperOnChange = (ev) => {
  // !.为TS的非空断言，主观上排除掉空值的情况
  // activeIndex.value = ev.detail!.current
  activeIndex.value = ev.detail.current
}

</script>

<template>
  <!-- <view class="logo">
      <image src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/logo_icon.png"></image>
    </view> -->


  <!-- 广告语 -->
  <view class="slogan-img"></view>

  <view class="login">

    <!-- 小程序端授权登录 -->
    <!-- 条件编译：以特殊注释开头，并且要有结尾包裹；符合条件了则会编译 -->
    <!-- #ifdef MP-WEIXIN -->
    <view class="button-privacy-wrap">
      <button :hidden="isAgreePrivacy" class="button-opacity button phone" @tap="checkedAgreePrivacy">
        请先阅读并勾选协议
      </button>
      <!-- open-type为小程序获取手机号授权，必填项且值固定；绑定的事件也是必填且固定 -->
      <button class="button phone" open-type="getPhoneNumber" @getphonenumber="onGetphonenumber">
        <text class="icon"></text>
        手机号一键登入
      </button>
    </view>
    <!-- #endif -->

    <view class="tips" :class="{ animate__shakeY: isAgreePrivacyShakeY }">
      <label class="label" @tap="isAgreePrivacy = !isAgreePrivacy">
        <radio class="radio" color="#28bb9c" :checked="isAgreePrivacy" />
        <text>登录/注册即视为你同意办飞小程序</text>
      </label>
      <navigator class="link" hover-class="none" url="/pages/agreement/login_agreement" @tap="isAgreePrivacy=true">《隐私条款》</navigator>
      <!-- 和
      <text class="link" @tap="onOpenPrivacyContract">《隐私协议》</text> -->
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
}




// 宣传语
.slogan-img {
  margin: 20rpx 0;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 375rpx;
  height: 215rpx;
  background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/login/slogan-img.png") top center no-repeat;
  background-size: 100% 100%;
}

.login {
  // position: absolute;
  bottom: 0rpx;
  display: flex;
  flex-direction: column;
  height: 100rpx;
  padding: 40rpx 20rpx 20rpx;
  // background-color: pink;

  .input {
    width: 380rpx;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    border: 1px solid #ddd;
    padding-left: 30rpx;
    margin-bottom: 20rpx;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 400rpx;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 20rpx;
    background-color: #c74f66;
    color: #fff;

    .icon {
      font-size: 40rpx;
      margin-right: 6rpx;
    }
  }

  // .phone {
  //   background-color: #28bb9c;
  // }

  .wechat {
    background-color: #06c05f;
  }

  .extra {
    flex: 1;
    padding: 70rpx 70rpx 0;

    .caption {
      width: 440rpx;
      line-height: 1;
      border-top: 1rpx solid #ddd;
      font-size: 26rpx;
      color: #999;
      position: relative;

      text {
        transform: translate(-40%);
        background-color: #fff;
        position: absolute;
        top: -12rpx;
        left: 50%;
      }
    }

    .options {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 70rpx;

      button {
        padding: 0;
        background-color: transparent;

        &::after {
          border: none;
        }
      }
    }

    .icon {
      font-size: 24rpx;
      color: #444;
      display: flex;
      flex-direction: column;
      align-items: center;

      &::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 6rpx;
        font-size: 40rpx;
        border: 1rpx solid #444;
        border-radius: 50%;
      }
    }

    .icon-weixin::before {
      border-color: #06c05f;
      color: #06c05f;
    }
  }
}

@keyframes animate__shakeY {
  0% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(0, -5rpx);
  }

  100% {
    transform: translate(0, 0);
  }
}

.animate__shakeY {
  animation: animate__shakeY 0.2s ease-in-out 3;
}

.button-privacy-wrap {
  position: relative;

  .button-opacity {
    opacity: 0;
    position: absolute;
    z-index: 1;
  }
}

.tips {
  position: absolute;
  bottom: 80rpx;
  left: 20rpx;
  right: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;

  .radio {
    transform: scale(0.6);
    margin-right: -4rpx;
    margin-top: -4rpx;
    vertical-align: middle;
  }

  .link {
    display: inline;
    color: #5e63ce;
  }
}
</style>