// 会议室收藏类型


import type { OfficeType } from '@/types/office'

// 会议室收藏信息
export type CollectInfoType = OfficeType & {
    // 创建收藏的时间
    collect_time: string;
    // 是否被收藏
    is_collected: boolean;
}
