// 初步使用兔小鲜项目，后边要改成自己项目的类型

/** 通用的用户信息 */
// type BaseProfile = {
//     /** 用户ID */
//     user_id: string
//     /** 头像  */
//     avatar?: string
//     /** 账户名  */
//     account?: string
//     /** 昵称 */
//     nickname?: string
//     // 平时使用的手机号
//     tel?: string
// }

/** 小程序登录 登录用户信息 */
// export type LoginResult = BaseProfile & {
//     user_id: string
//     /** 小程序授权的手机号 */
//     mobile: string
//     /** 登录凭证 */
//     token: string
// }

/** 个人信息 用户详情信息 */
// export type ProfileDetail = BaseProfile & {
//     // 名字
//     name: string
//     // 手机号
//     tel: string
//     // 邮箱
//     email: string
//     /** 性别 */
//     gender?: Gender
//     /** 生日 */
//     birthday?: string
//     /** 省市区 */
//     fullLocation?: string
//     // 公司名称
//     company?: string
// }
/** 性别 */
// export type Gender = '女' | '男'

export type UserInfoType = {
    // 基础信息
    user_id: string;    // 用户id
    open_id: string;    // 微信openid
    city?: "beijing" | "shanghai" | "chengdu";
    create_time?: number;
    avatar?: string;
    nick_name?: string;
    // score?: number;

    // Audio Vision
    photo_url?: string;
    photo_time?: number;

    // Sonic Playground
    music_url?: string;
    music_time?: number;
    chip_id?: string;
    bind_time?: number;

    // Audi miniature City
    latest_car_score?: number;
    latest_car_time?: number;
    highest_car_score?: number;
    highest_car_time?: number;

    // Sport Barcade
    latest_tennis_score?: number;
    latest_tennis_time?: number;
    latest_highlight_url?: string;
    highest_tennis_score?: number;
    highest_tennis_time?: number;
    highest_highlight_url?: string;

    // 4D影院
    cinema_time?: number;

    // 划船区域
    helly_hansen_time?: number;

    // 咖啡兑换
    prize_time?: number;
    drinks_time?: number;
    capsule_time?: number;  //领取扭蛋的时间
}

export type CarRankType = {
    id: number;
    rank: number;
    user_id: string;
    open_id: string;
    nick_name: string;
    avatar: string;
    car_score: number;
}
export type CarDailyRankType = {
    daily_rank: CarRankType[];
}
export type CarCityRankType = {
    daily_rank: CarRankType[];
}

export type TennisRankType = {
    id: number;
    rank: number;
    user_id: string;
    open_id: string;
    nick_name: string;
    avatar: string;
    tennis_score: number;
}
export type TennisType = {
    daily_rank: TennisRankType[];
}

/** 个人信息 修改请求体参数 */
// TS的语法中Pick是用来选取某个类型中的一些属性
export type ProfileType = Pick<
    UserInfoType,
    'user_id' | 'open_id' | 'avatar' | 'nick_name'
> 
