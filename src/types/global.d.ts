// 很多地方都会用到的通用类型

// 管理员信息
export type AdminInfo = {
    // 管理员id
    admin_id: string
    // 管理员名字
    admin_name: string
    // 管理员级别
    admin_level: number
    // 管理员联系方式
    admin_tel: string
}

// 通用状态类型查询
export type UserInfo = {
    // 用户id
    user_id: string
    // 请求来源：0为开发者测试，1为管理系统，2为小程序 ...
    source_type?: number
}

// 请求分页的结果类型
export type PageResult<t> = {
    // 列表数据
    items: T[]  // 泛型，传什么就是什么
    // ** 总条数 */
    counts: number
    /** 当前页数 */
    page: number
    /** 总页数 */
    pages: number
    /** 每页条数 */
    pageSize: number
}

// 通用分页类型
export type PageParams = {
    // 请求的类型：类型由后端决定
    type?: int
    /** 页码：默认值为 1 */
    page?: number
    /** 页大小：默认值为 10 */
    pageSize?: number
}