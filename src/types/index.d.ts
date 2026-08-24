// 暂时使用兔小鲜的home类型

import type { MeetingRoomItem } from './global'

/** 首页-轮播图数据类型 */
export type BannerItem = {
    /** 跳转链接 */
    hrefUrl?: string
    /** id */
    id: string
    /** 图片链接 */
    imgUrl: string
    /** 跳转类型 */
    type?: number
}

/** 猜你喜欢-商品类型 */
export type NearByMeetingRoomItem = MeetingRoomItem // ts的type关键字可以理解为起别名
