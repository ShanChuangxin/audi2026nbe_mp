// 会员卡积分相关的API
// 积分赠送和赠送记录相关的API

import { http } from '@/utils/http'
import type { MemberCard, RechargeScore, ResultRechargeScore } from '@/types/member'
import type { ShareScore, ResultShareScore, ShareRecordInfoList } from '@/types/score_share'
import type { WechatPaymentInfoType } from '@/types/order'
import type { UserInfo } from '@/types/global'


// 获取用户当前积分卡信息
export const getMemberInfoAPI = (data: UserInfo) => {
    return http<MemberCard>({
        method: 'POST',
        url: '/get_member_info',
        data
    })
}

// 余额充值
// 后端对接了微信付款
export const applyRechargeBalanceAPI = (data: { wechat_pre_order: { payer_id: string, amount: number, description: string, attach: string } }) => {
    return http<{ payment_info: WechatPaymentInfoType }>({
        method: 'POST',
        url: '/apply_recharge_balance',
        data
    })
}

// 升级为办飞会员
// 后端对接了微信付款
export const applyMemberAPI = (data: { wechat_pre_order: { payer_id: string, amount: number, description: string, member_type: number, attach: string } }) => {
    return http<{ payment_info: WechatPaymentInfoType }>({
        method: 'POST',
        url: '/apply_member',
        data
    })
}



// 以下可能暂时用不到

// 积分赠送
export const shareScoreAPI = (data: ShareScore) => {
    return http<ResultShareScore>({
        method: 'POST',
        url: '/score_share',
        data
    })
}

// 赠送记录查询
export const getShareListAPI = (data: UserInfo) => {
    return http<ShareRecordInfoList>({
        method: 'POST',
        url: '/get_share_list',
        data
    })
}