// 推广相关的API

import { http } from '@/utils/http'
import type { UserInfo } from '@/types/global'
import type { PromoterInfo, PromotionDetailList } from '@/types/promotion'

// 获取用户推广信息
export const getPromoterInfoAPI = (data: UserInfo) => {
    return http<PromoterInfo>({
        method: 'POST',
        url: '/get_promoter_info',
        data
    })
}

// 获取推广权益列表
export const getPromotionDetailListAPI = (data: UserInfo) => {
    return http<PromotionDetailList>({
        method: 'POST',
        url: '/get_promotion_list',
        data
    })
}

