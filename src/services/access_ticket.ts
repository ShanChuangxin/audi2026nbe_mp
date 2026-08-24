// 门禁相关的API

import { http } from '@/utils/http'
import type { UserInfo } from '@/types/global'
import type { AccessTicketType } from '@/types/access_ticket'

// 获取用户参与的列表
export const getInvolveListAPI = (data: { user_id: string }) => {
    return http<{ "involve_list": AccessTicketType[] }>({
        method: 'POST',
        url: '/get_involve_list',
        data
    })
}

// 获取门禁详情
export const getAccessTicketAPI = (data: { user_id: string, ticket_id: string }) => {
    return http<AccessTicketType>({
        method: 'POST',
        url: '/get_access_ticket',
        data
    })
}