// 会议室相关的API

import { http } from '@/utils/http'
import type { OfficeType } from '@/types/office'
import type { BuildingType } from '@/types/office'


// 获取会议室详情信息
export const getBuildingDetailAPI = (data: { building_id: String }) => {
    return http<{ building: BuildingType }>({
        method: 'POST',
        url: '/get_building_detail',
        data
    })
}

// 获取会议室详情信息
export const getOfficeDetailAPI = (data: { office_id: String }) => {
    return http<{ "office": OfficeType }>({
        method: 'POST',
        url: '/get_office_detail',
        data
    })
}

