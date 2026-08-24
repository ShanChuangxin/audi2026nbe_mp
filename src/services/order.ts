// 和支付、以及订单相关的API
import { http } from '@/utils/http'
import type { ticket_user, AccessTicketDetail } from '@/types/access_ticket'
// import type { GetOrderInfo, OrderSelection, OwenerOrder } from '@/types/order'
import type { OrderInfoType, WechatPayPreOrderInfoType, WechatPaymentInfoType, ApplyBalancePayOrderType } from '@/types/order'
import type { UserInfoType } from '@/types/user_info'

// 提交订单信息
export const submitOrderAPI = (data: OrderInfoType) => {
    return http<{ "order_info": OrderInfoType }>({
        method: 'POST',
        url: '/submit_order',
        data
    })
}

// 获取订单列表
export const getOrderListAPI = (data: { user_id: string, order_status?: number }) => {
    return http<{ "order_list": OrderInfoType[] }>({
        method: 'POST',
        url: '/get_order_list',
        data
    })
}



// 获取订单详情
export const getOrderDetailAPI = (data: { user_id: string, order_id: string }) => {
    return http<{ "order": OrderInfoType }>({
        method: 'POST',
        url: '/get_order_detail',
        data
    })
}

// 删除订单
export const delOrderAPI = (data: { user_id: string, order_id: string }) => {
    return http({
        method: 'POST',
        url: '/del_order',
        data
    })
}


// 获取使用统计(数组类型)
export const getCheckInListAPI = (data: AccessTicketDetail) => {
    return http<ticket_user[]>({
        method: 'POST',
        url: '/get_checkin_list',
        data
    })
}

// 微信支付相关
// 获取微信支付签名
export const applyWechatPayAPI = (data: { wechat_pre_order: WechatPayPreOrderInfoType }) => {
    return http<{ payment_info: WechatPaymentInfoType }>({
        method: 'POST',
        url: '/wmp_apply_wechat_pay',
        data
    })
}

// 使用余额支付
export const applyBalancePayAPI = (data: ApplyBalancePayOrderType) => {
    return http<{ user_info: UserInfoType }>({  // 返回用户信息用于更新
        method: 'POST',
        url: '/wmp_apply_balance_pay',
        data
    })
}

// 加入我参与的列表（非本人订单）
export const addInvolveListAPI = (data: { user_id: string, order_id: string }) => {
    return http<{ user_info: UserInfoType }>({  // 返回用户信息用于更新
        method: 'POST',
        url: '/add_involve_list',
        data
    })
}
