<!-- 场地合作页面 -->
<script setup lang="ts">
import { ref } from 'vue'
import type { VenueDetail } from '@/types/venue'
import { venueSubmitInfoAPI } from '@/services/venue'



const venueDetail = ref({} as VenueDetail)

// 1. 定义表单数据
// ts默认定义类型
const form = ref({
  name: '', // 联系人的姓名
  contact: '',  // 联系方式
  address: '', // 地址
  area: '', // 面积
})
// 2. 定义校验规则
// rules的每个对象的key对应着每个校验标签的name属性
const rules: UniHelper.UniFormsRules = {  // UniHelper中有正则类型
  name: {
    rules: [{ required: true, errorMessage: '请输入联系人姓名' }],
  },
  contact: {
    rules: [
      { required: true, errorMessage: '请输入联系方式' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' }, // 正则表达式验证格式
    ],
  },
  address: { 
    rules: [{ required: true, errorMessage: '请输入地址' }],
  },
  area: {
    rules: [{ required: true, errorMessage: '请输入场地面积' }],
  },
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
  const { name, contact, address, area } = form.value
  const res = await venueSubmitInfoAPI({
    name, contact, address, area
  })
  console.log("提交结果：", res)
  if (0 == res.errcode)
  {
    uni.showToast({icon: 'none', title: '提交完成，请等待工作人员联系~', duration: 2000})
    setTimeout(() => {
      uni.navigateBack()
    }, 2000)
  } else {
    uni.showToast({icon: 'none', title: '网络错误~', duration: 2000})
  }
  
}

// 下拉菜单
// const options = ref<string[]>(['100m2以下', '100m2-500m2', '500m2以上'])
// const selectedOption: string = "请选择"
// const onPickerChange: UniHelper.RegionPickerOnChange = (ev) => {
//   console.log(ev.detail.value)
//   // const index: Number = ev.detail.value;
//   // selectedOption = options[index];
// }



</script>

<template>

  <!-- 头部图片 -->
  <view class="head-bg"></view>

  <!-- slogan -->
  <view class="slogan-container">
  </view>

  <!-- 表单 -->
  <view class="venue-body">
    <!-- 1. uni-forms通过rules属性传入约定的校验规则 -->
    <!-- 2. uni-forms需要绑定model属性，值为表单的key/value组成的对象 -->
    <!-- 3. 需要把表单里的项的标签换成uni-forms-item，同时设置name属性为当前字段名，字段为String|array类型 -->
    <!-- 4. 通过ref给uni-form起个名字（绑定响应式变量） -->
     <view class="venue-form">
      <uni-forms ref="formRef" :rules="rules" :model="form">
        <!-- 表单内容 -->
        <!-- 负责人名称 -->
        <uni-forms-item name="name" class="form-item">
          <text class="label">姓名</text>
          <view class="name-input-container">
            <view class="name-icon"></view>
            <!-- 使用v-model进行双向绑定 -->
            <input class="name-input" type="text" placeholder="姓名" v-model="form.name">
          </view>
        </uni-forms-item>

        <!-- 手机号码 -->
        <uni-forms-item name="contact" class="form-item">
          <text class="label">联系电话</text>
          <view class="contact-input-container">
            <view class="contact-icon"></view>
            <!-- 使用v-model进行双向绑定 -->
            <input class="contact-input" type="text" :maxlength="11" placeholder="手机号码" v-model="form.contact">
          </view>
        </uni-forms-item>

        <!-- 地址 -->
        <uni-forms-item name="address" class="form-item">
          <text class="label">地址</text>
          <view class="address-input-container">
            <view class="address-icon"></view>
            <!-- 使用v-model进行双向绑定 -->
            <input class="address-input" type="text" placeholder="场地地址" v-model="form.address">
          </view>
        </uni-forms-item>

        <!-- 空间面积 -->
        <uni-forms-item name="area" class="form-item">
          <text class="label">场地面积</text>
          <view class="area-name-input-container">
            <view class="area-name-icon"></view>
            <!-- 使用v-model进行双向绑定 -->
            <input class="area-name-input" type="text" placeholder="场地面积" v-model="form.area">
          </view>
        </uni-forms-item>

      </uni-forms>
     </view>

     <!-- 提交按钮 -->
      <view class="venue-btn" @tap="onSubmit">提交</view>
    
    
  </view>
</template>

<style lang="scss" scoped>

// 头部图片
.head-bg {
  width: 750rpx;
  height: 410rpx;
  background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/venue/head-img.png") top center no-repeat;
  background-size: 100% 100%;
}

// 标语容器
.slogan-container {
  margin-top: -80rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 638rpx;
  height: 175rpx;
  // border-radius: 60rpx;
  background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/venue/slogan.png") top center no-repeat;
  background-size: 100% 100%;

}

// 合作体
.venue-body {
  margin-top: 30rpx;
  margin-left: 50%;
  transform: translateX(-50%);
  width: 650rpx;
  height: 900rpx;
  // background-color: pink;

  // 表单
  .venue-form {
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
    .contact-input-container {
      margin-top: 10rpx;
      width: 100%;
      height: 100rpx;
      border-radius: 20rpx;
      background-color: #fafafc;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .contact-icon {
        margin-left: 20rpx;
        width: 43rpx;
        height: 43rpx;
        background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/venue/icon-contact.png") top center no-repeat;
        background-size: 100% 100%;
      }

      .contact-input {
        margin-left: 20rpx;
        width: 500rpx;
        font-size: 30rpx;
        // background-color: skyblue;
      }
    }

    // 地址输入框
    .address-input-container {
      margin-top: 10rpx;
      width: 100%;
      height: 100rpx;
      border-radius: 20rpx;
      background-color: #fafafc;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .address-icon {
        margin-left: 20rpx;
        width: 43rpx;
        height: 43rpx;
        background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/venue/icon-address.png") top center no-repeat;
        background-size: 100% 100%;
      }

      .address-input {
        margin-left: 20rpx;
        width: 500rpx;
        font-size: 30rpx;
        // background-color: skyblue;
      }
    }

    // 面积输入框
    .area-name-input-container {
      margin-top: 10rpx;
      width: 100%;
      height: 100rpx;
      border-radius: 20rpx;
      background-color: #fafafc;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .area-name-icon {
        margin-left: 20rpx;
        width: 43rpx;
        height: 43rpx;
        background: url("https://www.mbcstyle.cn/projects/mbc-static/wmp/static/images/venue/icon-address.png") top center no-repeat;
        background-size: 100% 100%;
      }

      .area-name-input {
        margin-left: 20rpx;
        width: 500rpx;
        font-size: 30rpx;
        // background-color: skyblue;
      }
    }
  }

  // 提交按钮
  .venue-btn {
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