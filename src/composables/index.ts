// 这个文件用于封装组合式函数
// 函数名一般用use开头
// 每次在引用的位置调用这个函数时，就会创建这个函数相关信息的实例（比如在my.vue里有使用）

import type { BfMeetingRoomListInstance } from '@/types/components'
import { ref } from 'vue'

/**
 * 猜你喜欢组合式函数
 */
// 把组件的实例、方法以及调用页面的触底函数封装在一起了，使调用页面使用起来更加方便（不用再创建方法来绑定滚动触底事件）
export const useMeetingRoomList = () => {
    // 获取猜你喜欢组件实例
    const meetingRoomListRef = ref<BfMeetingRoomListInstance>()

    // 滚动触底事件
    const onScrolltolower = () => {
        meetingRoomListRef.value?.getMore()
    }

    // 返回 ref 和事件处理函数
    return {
        meetingRoomListRef, // 把变量名暴露出去，用于绑定实例
        onScrolltolower,
    }
}