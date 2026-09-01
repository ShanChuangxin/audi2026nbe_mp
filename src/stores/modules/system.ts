// 系统参数设置，如语言

import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useSystemStore = defineStore(
    'system',
    () => {
        // 会员信息
        const system_config = ref<{ language: "cn" | "en", city: "beijing" | "shanghai" | "chengdu" }>({ language: "cn", city: "beijing" })

        // 保存会员信息，登录时使用
        const switchLanguage = () => {
            if (system_config.value?.language == "cn") {
                system_config.value.language = "en";
            } else {
                system_config.value!.language = "cn";
            }
        }

        // 设置城市
        const updateCity = (val: string) => {
            system_config.value!.city = val;
        }

        // 记得 return
        return {
            system_config,
            updateCity,
            switchLanguage,
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