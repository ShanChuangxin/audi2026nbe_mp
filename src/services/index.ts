// 主页相关的API

import type { BannerItem } from "@/types/index"
import type { BuildingType, OfficeType, OfficeFilter } from "@/types/office"
import { http } from "@/utils/http"



// 获取轮播图
export const getBannerAPI = () => {
    return http<{ swiperList: BannerItem[] }>({
        method: 'POST',
        url: '/get_banner'
    })
}

// 获取大楼列表。不需要传参数
export const getBuildingListAPI = () => {
    return http<{ building_list: BuildingType[] }>({
        method: 'POST',
        url: '/get_building_list',
    })
}

// 获取办公室列表
export const getOfficeListAPI = (data?: OfficeFilter) => {
    return http<{ officeList: OfficeType[] }>({
        method: 'POST',
        url: '/get_office_list',
        data
    })
}

// 获取推广权益
export const bindPromotionAPI = (data: { user_id: string, promotion_id: string }) => {
    return http<{ result?: any, bind_result?: any }>({
        method: 'POST',
        url: '/bind_promotion_info',
        data
    })
}