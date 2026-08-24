// 暂时使用兔小鲜项目的http

/**
 * 添加拦截器:
 *   拦截 request 请求
 *   拦截 uploadFile 文件上传
 *
 * TODO:
 *   1. 非 http 开头需拼接地址
 *   2. 请求超时
 *   3. 添加小程序端请求头标识
 *   4. 添加 token 请求头标识
 */

import { useMyStore } from '@/stores' // 用于添加进token的

// const baseURL = 'http://127.0.0.1:8000/api/mbcstyle/user'
// const baseURL = 'http://192.168.0.105:8000/api/mbcstyle/user'
const baseURL = 'https://www.mbcstyle.cn/api/audi2026nbe/'
// const baseURL = 'https://www.1024.art/api/mbcstyle/user'

// 添加拦截器
const httpInterceptor = {
    // 拦截前触发，并对http请求进行加工处理
    invoke(options: UniApp.RequestOptions) {  // 这个形参就是获取到的http请求，冒号后是ts的格式限制
        // 1. 非 http 开头需拼接地址
        if (!options.url.startsWith('http')) {
            options.url = baseURL + options.url
        }
        // 2. 请求超时, 默认 60s
        options.timeout = 10000
        // 3. 添加小程序端请求头标识，因为有的服务器后端会要求表明自己的来源
        options.header = {
            ...options.header,  // 保留已有的请求头
            'source-client': 'miniapp',   // 添加新的请求头
            'Content-Type': 'application/json', // 确保设置 Content-Type 为 application/json
        }
        console.log(options.header)
        // 4. 添加 token 请求头标识
        const memberStore = useMyStore()
        const token = memberStore.profile?.token  // 使用可选链，从本地存储里取token
        if (token) {
            options.header.Authorization = token  // 如果本地存储里有token就添加到请求头里
        }
    },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象
 *  2. 获取数据成功
 *    2.1 提取核心数据 res.data
 *    2.2 添加类型，支持泛型
 *  3. 获取数据失败
 *    3.1 401错误  -> 清理用户信息，跳转到登录页
 *    3.2 其他错误 -> 根据后端错误信息轻提示
 *    3.3 网络错误 -> 提示用户换网络
 */
type Data<T> = {
    errcode: number
    errmsg: string
    data: T
}
// 2.2 添加类型，支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
    // 1. 返回 Promise 对象
    return new Promise<Data<T>>((resolve, reject) => {
        uni.request({
            ...options, // 展开运算符，http请求的参数
            // 响应成功
            success(res) {
                // 状态码 2xx， axios 就是这样设计的
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    // 2.1 提取核心数据 res.data
                    resolve(res.data as Data<T>)
                } else if (res.statusCode === 401) {  // 服务器把401的响应状态配置为无token或者token失效
                    // 401错误  -> 清理用户信息，跳转到登录页
                    const memberStore = useMyStore()
                    memberStore.clearProfile()
                    uni.navigateTo({ url: '/pages/login/login' })
                    reject(res)
                } else {
                    // 其他错误 -> 根据后端错误信息轻提示
                    uni.showToast({
                        icon: 'none',
                        title: (res.data as Data<T>).msg || '请求错误',
                    })
                    reject(res)
                }
            },
            // 响应失败
            fail(err) {
                uni.showToast({
                    icon: 'none',
                    title: '网络错误，换个网络试试',
                })
                reject(err)
            },
        })
    })
}
