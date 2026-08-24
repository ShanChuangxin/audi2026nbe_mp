// 会员积分相关的数据类型

import type { UserInfo } from '@/types/global'

// 定义用户的积分卡
export type MemberCard = {
    user_id: string;
    score: number;
    member_level: number
}

// 积分充值的数据类型
// 交叉类型
export type RechargeScore = UserInfo & {
    // 充值的分数
    score: number
}

// 积分充值返回的数据类型
export type ResultRechargeScore = UserInfo & {
    // 充值订单ID
    recharege_id: number
    // 充值的分数
    score: number
    // 时间戳
    timestamp: string
}
