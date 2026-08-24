// 有关会议室相关的数据类型

// 大厦的数据类型
export type BuildingType = {

    // 大厦id
    building_id: string
    // 大厦名字
    building_name?: string
    // 地址
    address?: string
    // 城市
    city?: string;

    // 大厦介绍
    building_info?: string
    // 缩略图。暂时用不到
    building_thumbnail?: string
    // 封面图
    building_cover?: string
    // 轮播图地址
    building_swiper_list?: {
        id: number;
        imgUrl: string;
    }[]
    // 大厦图片。暂时用不到
    building_img?: string[]
    // 会议室数量
    office_sum?: number;
    // 大厦推荐人数最小值
    building_minimum?: number
    // 大厦推荐人数最大值
    building_maximum?: number
    // 配套设施的icon列表
    facility_list?: {
        id: number;
        icon: string;
        text: string;
    }[]
}


// 会议室相关的数据类型
export type OfficeType = BuildingType & {
    // 办公室id
    office_id: string
    // 会议室名字
    office_name?: string
    // 会议室详细地址，注意和大楼地址区别
    office_address?: string
    // 会议室楼层
    office_layer?: number   // 暂时没用到
    // 会议室门牌号，有些门牌号带字母，比如A03
    office_num?: string // 暂时没用到

    // 会议室介绍
    office_info?: string    // 暂时没用到
    // 会议室面积
    office_area?: number
    // 最多容纳人数
    maximum?: number
    // 会议室价格
    price?: number
    // 缩略图
    office_thumbnail?: string   // 暂时没用到
    // 封面图，统一用封面图
    office_cover?: string
    // 轮播图地址
    office_swiper_list?: { id: number, imgUrl: string }[]    // 暂时没用到
    // 会议室图片
    office_img_list?: string[]   // 暂时没用到
    // 配套设施，注意与大楼的配套设施区别
    office_facility_list?: { id: number, icon: string, text: string }[]   // 暂时没用到

    // 筛选相关
    // 桌型
    table_type_list?: string[]; // 桌型列表
    // 用途 
    purpose_type_list?: string[];   // 用途列表
    // 已被选的时间段
    selected_time_stage?: { start_time: number, end_time: number }[];  // 用于筛选并展示哪些时间段不可选
}

// 会议室筛选类型
export type OfficeFilter = {
    num_type?: string
    table_type?: string
    city_type?: string
    purpose_type?: string
    building_id?: string    // 在大楼中进行筛选
}
