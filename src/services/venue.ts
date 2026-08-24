// 场地合作相关的API

import type { VenueDetail } from '@/types/venue'
import { http } from '@/utils/http'

// 场地方提交合作相关的资料
export const venueSubmitInfoAPI = (data: VenueDetail) => {
    return http({
        method: 'POST',
        url: '/venue_submit_info',
        data
    })
}