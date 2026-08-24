// 推广相关类型
// 目前内容为空，等待客户沟通确认

import type { BaseProfile } from '@/services/my'

// 推广人信息
export type PromoterInfo = {
    // 权益信息
    promotion_info: string
    // 特殊权益信息？
    exclusive_info?: string
}

// 推广收益详情
export type PromotionDetail = {
    // 被推广人信息
    introduced_user: BaseProfile
    // 获取的积分（暂时为积分）
    score: number
}
// 推广收益列表
export type PromotionDetailList = PromotionDetail[]



