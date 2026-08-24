// 和收藏相关的API

import { http } from '@/utils/http'
import type { UserInfo } from '@/types/global'
import type { CollectInfoType } from '@/types/collect'
import type { UserInfoType } from '@/types/user_info'

// 获取用户的收藏列表
export const getMyCollectAPI = (data: UserInfo) => {
    return http<{ collect_list: CollectInfoType[] }>({
        method: 'POST',
        url: '/get_collect_list',
        data
    })
}

// 把会议室添加进收藏
// 返回的是用户信息，需要保存在本地里
export const addCollectAPI = (data: { user_id: string, office_id: string }) => {
    return http<{ user_info: UserInfoType }>({
        method: 'POST',
        url: '/add_collect',
        data
    })
}
// 从收藏列表中删除会议室
// 返回的是用户信息，需要保存在本地里
export const delCollectAPI = (data: { user_id: string, office_id: string }) => {
    return http<{ user_info: UserInfoType }>({
        method: 'POST',
        url: '/del_collect',
        data
    })
}