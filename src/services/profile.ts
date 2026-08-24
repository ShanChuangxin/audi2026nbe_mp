// 个人信息相关API

import type { UserInfoType } from '@/types/user_info'
import { http } from '@/utils/http'

/**
 * 获取个人信息
 */
export const getMyProfileAPI = (data: { user_id: string }) => {
    return http<{ user_info: UserInfoType }>({
        method: 'POST',
        url: '/get_user_profile',
        data
    })
}

// 更新个人头像
// 这个API是直接使用uni原生的上传的API

/**
 * 修改个人信息
 * @param data 请求体参数
 */
// 注意：整个架构思路是把修改头像和修改个人信息分成了两个部分，而不是放在了一起，因此后端就不存在了上传头像缓存的问题
export const updateMyProfileAPI = (data: UserInfoType) => {
    return http<{ user_info: UserInfoType }>({
        method: 'POST',
        url: '/update_profile',
        data,
    })
}