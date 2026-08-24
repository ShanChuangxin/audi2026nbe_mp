<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
  // 没有必要使用wx.login获取用户的openid作为用户的标识的，因为手机号就可以作为用户唯一标识，尤其是多平台的情况下，手机号更是方便（openid只能微信的平台）
  // wx.login({
  //   success(res) {
  //     console.log("wx.login成功：", res)
  //   }
  // })
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
