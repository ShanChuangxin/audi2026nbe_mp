// 微信授权登录相关的API

import type { LoginWxMinParams } from '@/types/login'
import type { UserInfoType, TennisRankType, CarDailyRankType, CarCityRankType } from '@/types/user_info'
import { http } from '@/utils/http'

/**
 * 小程序登录
 * @param data 请求参数
 */

// 基于wx.login获取的code来获取用户的open_id
export const getOpenIdAPI = (data: { jscode: string }) => {
    return http<{ session_key: string, open_id: string }>({
        method: 'POST',
        url: '/get_openid',
        data,
    })
}

// 注册&获取用户信息
export const getUserInfoAPI = (data: { open_id: string, city: "beijing" | "shanghai" | "chengdu", is_register: boolean }) => {
    return http<{ user_info: UserInfoType }>({
        method: 'POST',
        url: '/get_user_info',
        data,
    })
}

// 划船区域和4D影院打卡
export const getAreaCheckAPI = (data: { open_id: string, area: "helly_hansen" | "cinema" }) => {
    return http<{ user_info: UserInfoType }>({
        method: 'POST',
        url: '/area_check',
        data,
    })
}

// 获取网球当日排行榜
export const getTennisRankAPI = () => {
    return http<{ daily_rank: TennisRankType }>({
        method: 'POST',
        url: '/get_tennis_rank',
        // data,
    })
}

// 获取赛车排行榜
export const getCarRankAPI = () => {
    return http<{ rank_info: { daily_rank: CarDailyRankType, city_rank: CarCityRankType } }>({
        method: 'POST',
        url: '/get_car_rank',
        // data,
    })
}

// 注意：这个API是调用自己的服务器，然后由自己的服务器向微信的服务器解析内容来获取用户的手机号
export const postLoginWxMinAPI = (data: LoginWxMinParams) => {
    return http<{ user_info: UserInfoType }>({
        method: 'POST',
        url: '/wxlogin',
        data,
    })
}

/**
 * 小程序登录_内测版
 * @param phoneNumber 模拟手机号码
 */
export const postLoginWxMinSimpleAPI = (phoneNumber: string) => {
    return http<UserInfoType>({
        method: 'POST',
        url: '/login/wxMin/simple',
        data: {
            phoneNumber,
        },
    })
}

type LoginParams = {
    account: string
    password: string
}
/**
 * 传统登录-用户名+密码
 * @param data 请求参数
 */
export const postLoginAPI = (data: LoginParams) => {
    return http<UserInfoType>({
        method: 'POST',
        url: '/login',
        data,
    })
}
