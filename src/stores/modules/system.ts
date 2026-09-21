// 系统参数设置，如语言

import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useSystemStore = defineStore(
    'system',
    () => {
        // 会员信息
        const system_config = ref<{ language: "cn" | "en", city: "beijing" | "shanghai" | "chengdu", pop_ruler: boolean, isPrivacy: boolean }>({ language: "en", city: "beijing", pop_ruler: true, isPrivacy: false })

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
            system_config.value!.city = val as "beijing" | "shanghai" | "chengdu";
        }

        // 设置是否弹窗体验规则
        const upatePopRuler = (isPop: boolean) => {
            console.log("更新体验弹窗设置");
            system_config.value!.pop_ruler = isPop;
        }

        // 设置是否同意隐私条款，同意后，就不可能再回主页了
        const agreePrivacy = () => {
            console.log("同意隐私条款，存储并记录不再返回");
            system_config.value!.isPrivacy = true;
        }

        // 清除系统设置
        const clearSystemConfig = () => {
            system_config.value = { language: "en", city: "beijing", pop_ruler: true, isPrivacy: false };
        }

        // 记得 return
        return {
            system_config,
            updateCity,
            switchLanguage,
            upatePopRuler,
            agreePrivacy,
            clearSystemConfig
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