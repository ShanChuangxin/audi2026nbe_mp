// 存储没有直接导出，是封装成模块的形式由index.ts统一导出了
// 用户状态存储
import type { UserInfoType } from '@/types/user_info'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useMyStore = defineStore(
    'my',
    () => {
        // 会员信息
        const profile = ref<UserInfoType>()

        // 保存会员信息，登录时使用
        const setProfile = (val: UserInfoType) => {
            profile.value = val
        }

        // 清理会员信息，退出时使用
        const clearProfile = () => {
            profile.value = undefined
        }

        // 记得 return
        return {
            profile,
            setProfile,
            clearProfile,
        }
    },
    {
        // 网页端配置
        // persist: true,
        // 小程序端配置
        persist: {
            storage: {
                getItem(key) {
                    return uni.getStorageSync(key)
                },
                setItem(key, value) {
                    uni.setStorageSync(key, value)
                },
            },
        },
    },
)