// ts对自动导入的通用组件配置类型

import BfSwiper from '@/components/BfSwiper.vue'
import BfMeetingRoomList from '@/components/BfMeetingRoomList.vue'

declare module 'vue' {
    export interface GlobalComponents {
        BfSwiper: typeof BfSwiper
        BfMeetingRoomList: typeof BfMeetingRoomList
    }
}

// 组件实例类型
// ts的语法
export type BfMeetingRoomListInstance = InstanceType<typeof BfMeetingRoomList>  // 可以在页面的组件属性中用ref在页面里绑定组件
export type BfSwiperInstance = InstanceType<typeof BfSwiper>
