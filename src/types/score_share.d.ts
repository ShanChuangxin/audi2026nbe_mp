// 积分赠送相关的类型

import type { UserInfo } from '@/types/global'

// 积分赠送
export type ShareScore = UserInfo & {
    // 目标用户？或者直接分享给指定用户
    // dest_id: number
    // 分数
    share_score: number
}

// 积分赠送结果类型
export type ResultShareScore = UserInfo & {
    // 共享积分的编号
    share_id: number
    // 共享的分数
    share_score: number
    // 共享的状态，是否已经转到目标用户
    share_status: string
    // 时间戳
    timestamp: string
}

// 积分赠送信息列表
export type ShareRecordInfoList = {
    share_score_list: ResultShareScore[]
}