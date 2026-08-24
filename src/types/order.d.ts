// 和订单相关的数据类型
import type { OrderState } from '@/services/constants'
import type { UserInfoType } from '@/types/user_info'

import type { BuildingType, OfficeType } from '@/types/office'
import type { AccessTicketType } from '@/types/access_ticket'



export type OrderInfoType = {
    // buyer_id: string;   // 下单用户的user_id
    buyer_info: UserInfoType;   // 下单的用户信息
    order_id?: string;   // 订单id
    create_time?: number;    // 创建时间，时间戳
    pay_time?: number;   // 支付时间
    cancel_time?: number;   // 取消时间
    del_time?: number;  // 订单删除时间


    order_status: OrderState;   // 订单状态：1为待支付，2为待使用（使用中），3为已完成（已结束），4为已取消
    /** 倒计时--剩余的秒数 -1 表示已经超时，正数表示倒计时未结束 */
    countdown?: number; // 未用到

    pay_channel?: 1 | 2 | 3; // 支付方式：1为微信支付，2为余额支付，3为线下支付
    origin_price?: number;   // 原单价
    submit_price?: number; // 需要支付的总价
    pay_price?: number;  // 实际支付价格


    office_info?: OfficeType;    // 会议室信息，包含了大楼和会议室信息

    pic_name: string;   // 负责人姓名
    pic_tel: string;    // 负责人电话
    date: string;   // 日期
    start_time: number; // 开始时间，时间戳
    end_time: number; // 结束时间，时间戳
    meeting_title: string;  // 会议名称
    buyer_note?: string;    // 备注，暂时没用到

    // ticket_info?: AccessTicketType; // 门禁信息
    ticket_id: string;  // 门禁id

}

// 微信支付方式下向服务器请求支付信息时构建的预支付信息类型
export type WechatPayPreOrderInfoType = {
    payer_id: string; // 支付者的id。注意是open_id，不是user_id
    order_id: string;   // 【商户订单号】 商户系统内部订单号，只能是数字、大小写字母_-*且在同一个商户号下唯一。
    amount: number; // 【总金额】 订单总金额，单位为分。
    description: string;    // 必填 string(127)【商品描述】 商品描述
    attach: string; // 用于标注订单类型
}
// 从服务器获取到的预支付类型
export type WechatPaymentInfoType = {
    prepay_id: string;
    random_str: string;
    signature: string;
    timestamp: string;
}

// 余额支付的请求类型
export type ApplyBalancePayOrderType = {
    user_id: string;    // 用户id
    order_id: string;   // 订单id
    pay_price: number;  // 支付金额
}



// 以下可能都用不到了

// 本人查询订单信息
export type GetOrderInfo = BaseProfile & {
    order_id: string
}

// 订单内容选择
// 这个类型得修改一下，如果是用户提交信息，没有必要把会议室的所有信息都提交，只用提交关键的内容
export type OrderSelection = BuildingType & OfficeType & {
    // 订房用户的信息
    buyer_info: BaseProfile

    // 选择的日期
    date_selection: Date
    // 起始时间点
    time_node_start: number
    // 结束时间点
    time_node_end: number
    // 联系电话
    order_tel: string
    // 订单备注
    buyerMessage?: string
    // 支付方式：1为积分购买，2为微信支付
    pay_channel: 1 | 2
    // 支付价格
    pay_price: number
}

// 本人订单
export type OwenerOrder = OrderSelection & {
    // 订单编号
    order_id: string
    // 订单状态：1为待支付，2为待使用（使用中），3为已完成（已结束），4为已取消
    order_status: OrderState
    // 预订时间
    create_time: string
    /** 倒计时--剩余的秒数 -1 表示已经超时，正数表示倒计时未结束 */
    countdown?: number
    // 取消时间
    cancel_time?: string
    // 门禁id
    ticket_id: string
}


// 订单列表中的订单项
export type OrderItem = {
    // 订单编号
    order_id: string;
    // 订单状态：1为待支付，2为待使用（使用中），3为已完成（已结束），4为已取消
    order_status: OrderState;
    // 预订时间
    create_time: string;
    // 使用时间 
    use_time: string;
    // 会议室名称
    office_name: string;
    // 缩略图
    office_thumbnail: string;
    // 地址
    office_address: string;
}

