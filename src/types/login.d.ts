
// ts定义的微信登录要传的类型参数
export type LoginWxMinParams = {
    code: string
    encryptedData?: string
    iv?: string
    open_id?: string;   // 直接把open_id发送，方便绑定
}
