<script setup lang="ts">
import { ref } from 'vue';
import { getMyProfileAPI, updateMyProfileAPI } from '@/services/profile'
import { useMyStore } from '@/stores'
import type { UserInfoType } from '@/types/user_info'
import { onLoad } from '@dcloudio/uni-app'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 定义状态管理
const myStore = useMyStore()
// 获取个人信息，修改个人信息需提供初始值；修改后的个人信息也放进这个里面，在提交表单时解构赋值值给后端
// 如果不赋初值，在等API返回数据前是undefine，会导致v-bind双向绑定报错；如果赋值空对象，就没有结构，无法赋值数据，也会报错，因此加断言，这个空对象未来一定是指定的这个对象
const profile = ref({} as UserInfoType)  // 注意：这里的用法参考上边的注释
const getMemberProfileData = async () => {
  if (!myStore.profile){  // 防止未登录，跳转到登录界面
    uni.navigateTo({ url: "/pages/login/login" })
  }
  // console.log("存储中获取到的user_id为：", myStore.profile?.user_id)
  const res = await getMyProfileAPI({user_id: myStore.profile!.user_id})
  console.log("获取的用户信息：", res)
  if (0 == res.errcode){
    profile.value = res.data.user_info
    form.value.nick_name = res.data.user_info.nick_name!
    form.value.mobile = res.data.user_info.mobile!
    form.value.email = res.data.user_info.email!
    form.value.company = res.data.user_info.company!
    // 同步 Store 的头像和昵称，用于我的页面展示
    // myStore.profile!.avatar = res.data.avatar
    // myStore.profile!.nickname = res.data.nickname
  } else {
    uni.showToast({icon: 'none', title: '网络错误~', duration: 2000})
  }
  
}

// 初始从服务器加载信息并展示
onLoad(() => {
  getMemberProfileData()
})

// 注意这里是把API封进使用的文件里了，是对uniapp官方的上传文件（内部封装了wx上传方法）方法的封装
// 并且这个请求也会被拦截器处理，因为本质是post请求，因此会自动加上token
// 文件上传-兼容小程序端、H5端、App端
const uploadFile = (file: string) => {
  // 文件上传
  uni.uploadFile({
    url: '/update_avatar',
    name: 'file',
    filePath: file,
    formData: {
      user_id: myStore.profile?.user_id
    },
    success: (res) => {
      console.log(res)
      if (res.statusCode === 200) {
        const result = JSON.parse(res.data) // 这里是把data中的json字符串转换为json格式
        console.log("解析后的返回信息为：", result)
        if (0 == result.errcode){
          // 个人信息页数据更新
          profile.value.avatar = result.data.avatar_url
          // Store头像更新，这样返回个人信息页面后也会同步更新
          myStore.profile!.avatar = result.data.avatar_url
          uni.showToast({ icon: 'success', title: '更新成功' })
        }
        
      } else {
        uni.showToast({ icon: 'error', title: '出现错误' })
      }
    },
  })
}

// 修改头像
const onAvatarChange = () => {
  // 调用拍照/选择图片
  // 选择图片条件编译
  // #ifdef H5 || APP-PLUS
  // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替
  uni.chooseImage({
    count: 1, // 设置上传个数，注意有最大数量限制，这里默认为一个
    success: (res) => {
      // 文件路径
      const tempFilePaths = res.tempFilePaths
      // 上传
      uploadFile(tempFilePaths[0])
    },
  })
  // #endif

  // #ifdef MP-WEIXIN
  // uni.chooseMedia 仅支持微信小程序端
  uni.chooseMedia({
    // 文件个数
    count: 1, // 设置上传个数，注意有最大数量限制，这里默认为一个
    // 文件类型
    mediaType: ['image'], // 这个可以上传图片或者视频，因此要限制下类型
    success: (res) => {
      // 本地路径
      const { tempFilePath } = res.tempFiles[0] // 因为只有1个，所以数组坐标为0；然后再解构赋值
      // 上传
      uploadFile(tempFilePath)
    },
  })
  // #endif
}

// 1. 定义表单数据
// ts默认定义类型
const form = ref({
  nick_name: '' , // 姓名
  mobile: '',  // 手机号
  email: '', // 邮件
  company: '', // 公司
})
// 2. 定义校验规则
// rules的每个对象的key对应着每个校验标签的name属性
const rules: UniHelper.UniFormsRules = {  // UniHelper中有正则类型
  nick_name: {
    rules: [{ required: true, errorMessage: '请输入姓名' }],
  },
  mobile: {
    rules: [
      { required: true, errorMessage: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' }, // 正则表达式验证格式
    ],
  },
  email: {
    rules: [
      { required: true, errorMessage: '请输入邮箱' },
      { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, errorMessage: '邮箱格式不正确' }, // 正则表达式验证格式
    ],
  },
  // 公司名字可以不填
}
// 3. 表单组件实例
const formRef = ref<UniHelper.UniFormsInstance>()
// 4. 提交表单
// 点击保存提交表单
const onSubmit = async () => {
  console.log("点击了提交按钮")
  
  // try catch 包裹是为了获取校验表单异常抛出的错误，然后用于提示用户
  // 其实try catch只包裹校验就好，不然API中的异常也会被捕获显示成校验异常的提示
  try {
    // 表单校验
    await formRef.value?.validate?.() // 这里写上await的意思是校验结束了，代码才会往下走；如果校验不通过的话，校验会抛出异常，因此用try..catch来包裹
    // 
  } catch (error) {
    uni.showToast({ icon: 'error', title: '请填写完整信息' })
    // 直接返回跳出函数
    return
  }
  // 点击提交时，把响应式数据里的关键字段通过解析赋值都取出来；这些赋值在表单修改时已经实已经对这些数据进行了修改
  const { nick_name, mobile, email, company} = form.value
  const user_id = myStore.profile!.user_id
  const res = await updateMyProfileAPI({
    user_id, nick_name, mobile, email, company
  })
  console.log("提交结果：", res)
  if (0 == res.errcode){
    // 更新进本地
    const profile = res.data.user_info
    console.log(profile)
    myStore.setProfile(profile)

    uni.showToast({icon: 'none', title: '保存成功~', duration: 2000})
    setTimeout(() => {
      uni.navigateBack()
    }, 2000)
  } else {
    uni.showToast({icon: 'none', title: '网络错误~', duration: 2000})
  }
  
}

</script>

<template>

  <!-- 顶部部分 -->
  <view class="profile-container">
      <!-- 用户头像 -->
      <view class="head-container" @tap="onAvatarChange">
        <image class="image" :src="profile?.avatar" mode="aspectFill" />
      </view>
      <!-- 办飞中心的logo -->
      <view class="mbc-center"></view>
  </view>

  <!-- 账户信息 -->
  <view class="account-container">
    <view class="balance-container">
      <view class="balance">{{ myStore.profile ? Math.floor(myStore.profile.account_balance!) : 0 }}</view>
      <view class="title">账户余额</view>
    </view>
    <view class="ticket-container">
      <view class="ticket">{{ myStore.profile ? myStore.profile.discount_tickt : 0 }}</view>
      <view class="title">优惠券</view>
    </view>
    <view class="score-container">
      <view class="score">{{ myStore.profile ? myStore.profile.score : 0 }}</view>
      <view class="title">积分</view>
    </view>
  </view>
    
  <!-- 表单 -->
  <view class="profile-body">
    <!-- 1. uni-forms通过rules属性传入约定的校验规则 -->
    <!-- 2. uni-forms需要绑定model属性，值为表单的key/value组成的对象 -->
    <!-- 3. 需要把表单里的项的标签换成uni-forms-item，同时设置name属性为当前字段名，字段为String|array类型 -->
    <!-- 4. 通过ref给uni-form起个名字（绑定响应式变量） -->
     <view class="profile-form">
      <uni-forms ref="formRef" :rules="rules" :model="form">
        <!-- 表单内容 -->
        <!-- 负责人名称 -->
        <uni-forms-item name="nick_name" class="form-item">
          <text class="label">姓名</text>
          <view class="name-input-container">
            <view class="name-icon"></view>
            <!-- 使用v-model进行双向绑定 -->
            <input class="name-input" type="text" placeholder="姓名" v-model="form.nick_name">
          </view>
        </uni-forms-item>

        <!-- 手机号码 -->
        <uni-forms-item name="mobile" class="form-item">
          <text class="label">联系电话</text>
          <view class="tel-input-container">
            <view class="tel-icon"></view>
            <!-- 使用v-model进行双向绑定 -->
            <input class="tel-input" type="text" :maxlength="11" placeholder="手机号码" v-model="form.mobile">
          </view>
        </uni-forms-item>

        <!-- 邮箱 -->
        <uni-forms-item name="email" class="form-item">
          <text class="label">邮件</text>
          <view class="email-input-container">
            <view class="email-icon"></view>
            <!-- 使用v-model进行双向绑定 -->
            <input class="email-input" type="text" placeholder="邮件" v-model="form.email">
          </view>
        </uni-forms-item>

        <!-- 公司名 -->
        <uni-forms-item name="company" class="form-item">
          <text class="label">公司名字</text>
          <view class="company-input-container">
            <view class="company-icon"></view>
            <!-- 使用v-model进行双向绑定 -->
            <input class="company-input" type="text" placeholder="公司名字" v-model="form.company">
          </view>
        </uni-forms-item>

      </uni-forms>
     </view>

     <!-- 提交按钮 -->
      <view class="profile-btn" @tap="onSubmit">保存</view>
        
  </view>

</template>

<style lang="scss">
page {
  background-color: #f5f5f5;
}

// 顶部信息
.profile-container {
  width: 750rpx;
  height: 410rpx;
  background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/profile-bg.png") bottom center no-repeat;
  background-size: 100% 100%;
  position: relative;
  box-sizing: border-box;
  padding-top: 100rpx;



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

  // 办飞的logo
  .mbc-center {
    position: absolute;
    right: 40rpx;
    bottom: 110rpx;
    width: 180rpx;
    height: 75rpx;
    background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/my/mbc-center-logo.png") bottom center no-repeat;
    background-size: 100% 100%;
  }
}

// 账户信息
.account-container {
  margin-top: -95rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 660rpx;
  height: 200rpx;
  border-radius: 40rpx;
  background-color: white;

  display: flex;
  justify-content: space-between;
  align-items: center;

  // 余额容器
  .balance-container {
    width: 220rpx;
    height: 150rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .balance {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 30rpx;
      color: red;
    }

    .title {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 25rpx;
      color: black;
    }
  }

  // 优惠券容器
  .ticket-container {
    width: 220rpx;
    height: 150rpx;
    border: solid 1rpx #f5f5f5;
    border-top: none;
    border-bottom: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .ticket {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 30rpx;
      color: red;
    }

    .title {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 25rpx;
      color: black;
    }
  }

  // 积分容器
  .score-container {
    width: 220rpx;
    height: 150rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .score {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 30rpx;
      color: red;
    }

    .title {
      width: 100rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 25rpx;
      color: black;
    }
  }
}

// 个人信息体
.profile-body {
  margin-top: 30rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 650rpx;
  height: 700rpx;
  // background-color: pink;

  // 表单
  .profile-form {
    margin-top: 20rpx;

    .label {
      margin: 0 0 10rpx 10rpx;
      color: black;
    }

    // 姓名输入框
    .name-input-container {
      margin-top: 10rpx;
      width: 100%;
      height: 100rpx;
      border-radius: 20rpx;
      background-color: #fafafc;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .name-icon {
        margin-left: 20rpx;
        width: 43rpx;
        height: 43rpx;
        background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/venue/icon-people.png") top center no-repeat;
        background-size: 100% 100%;
      }

      .name-input {
        margin-left: 20rpx;
        width: 500rpx;
        font-size: 30rpx;
        // background-color: skyblue;
      }
    }

    // 手机输入框
    .tel-input-container {
      margin-top: 10rpx;
      width: 100%;
      height: 100rpx;
      border-radius: 20rpx;
      background-color: #fafafc;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .tel-icon {
        margin-left: 20rpx;
        width: 43rpx;
        height: 43rpx;
        background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/venue/icon-contact.png") top center no-repeat;
        background-size: 100% 100%;
      }

      .tel-input {
        margin-left: 20rpx;
        width: 500rpx;
        font-size: 30rpx;
        // background-color: skyblue;
      }
    }

    // 邮箱输入框
    .email-input-container {
      margin-top: 10rpx;
      width: 100%;
      height: 100rpx;
      border-radius: 20rpx;
      background-color: #fafafc;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .email-icon {
        margin-left: 20rpx;
        width: 43rpx;
        height: 43rpx;
        background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/venue/icon-address.png") top center no-repeat;
        background-size: 100% 100%;
      }

      .email-input {
        margin-left: 20rpx;
        width: 500rpx;
        font-size: 30rpx;
        // background-color: skyblue;
      }
    }

    // 公司输入框
    .company-input-container {
      margin-top: 10rpx;
      width: 100%;
      height: 100rpx;
      border-radius: 20rpx;
      background-color: #fafafc;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .company-icon {
        margin-left: 20rpx;
        width: 43rpx;
        height: 43rpx;
        background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/venue/icon-address.png") top center no-repeat;
        background-size: 100% 100%;
      }

      .company-input {
        margin-left: 20rpx;
        width: 500rpx;
        font-size: 30rpx;
        // background-color: skyblue;
      }
    }

  }

  // 提交按钮
  .profile-btn {
    margin-top: 20rpx;
    margin-left: 50%;
    transform: translateX(-50%);
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

</style>