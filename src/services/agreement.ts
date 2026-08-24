// 隐私条款相关的API
import { http } from '@/utils/http'
import type { ResultAgreement } from '@/types/agreement'

// 获取隐私条款
// 参数为不同类型的隐私条款，需要和后端对应上
export const getAgreementAPI = (data: string) => {
    return http<ResultAgreement>({
        method: 'POST',
        url: '/get_agreement',
        data
    })
}