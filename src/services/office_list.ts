// 会议室预约页面的相关API

import type { PageParams, PageResult } from "@/types/global"
import type { OfficeType } from "@/types/office"
import type { OfficeFilter } from "@/types/office"
import { http } from "@/utils/http"

// 请求会议室预订列表
export const getOfficeListAPI = (data?: OfficeFilter) => { // 参数先不是PageParams（分页的）
    return http<{ office_list: OfficeType[] }>({  // 返回值不是PageResult<MeetingRoomItem>
        method: "POST",
        url: "/get_office_list",
        data
    })
}