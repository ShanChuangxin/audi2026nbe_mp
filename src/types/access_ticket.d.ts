// 门禁使用有关的数据类型

import type { BaseProfile } from '@/services/my'
import type { OrderSelection } from '@/types/order'
// 门禁类型/非定会议室的使用者的类型
export type AccessTicketType = OrderSelection & {
    // 此次会议室预订后使用门禁的id
    ticket_id: string
    // 订房用户的信息
    buyer_info: BaseProfile
    // 使用者的信息
    user_info?: BaseProfile
    // 是否为订房者
    isOwener: Boolean
    // 分享给其它用户的信息
    share_list?: ticket_user[]
    // 订单编号
    order_id: string
    // 二维码信息
    qr_code: string
    // 起始时间点
    time_node_start: number
    // 结束时间点
    time_node_end: number
}

// 使用统计类型
export type ticket_user = {
    // 使用该门禁的用户信息（不含本人）
    ticket_user: BaseProfile
    // 使用计数
    user_counter: number

}


// 请求我参与的信息详情
// export type AccessTicketDetail = pick<AccessTicket, 'ticket_id' | 'user_info.user_id'>
// export type AccessTicketDetail = {
//     // 用户id
//     user_id: string
//     // 门禁id
//     ticket_id: string
// }

// 定房者的门禁类型
// 其实不需要单独做一个，可以为通用类型
// export type OwenerAccessTicket = AccessTicket & {
//     // 分享给其它用户的信息
//     share_list: ticket_user[]
// }