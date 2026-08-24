// 联系客服相关API

import type { ContactStaffInfo } from '@/types/contact_staff'
import { http } from '@/utils/http'

// 向客服提交自己的信息
export const contactStaffInfoAPI = (data: ContactStaffInfo) => {
    return http({
        method: 'POST',
        url: '/contact_staff_info',
        data
    })
}