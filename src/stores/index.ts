// 注意这里注册状态管理和持久化存储是在store下，然后再导出，最后由main.ts导入后去use 
// 注意这个index.ts可以直接导出所在路径下所有的模块（模块必须还是要export出去）


import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 创建 pinia 实例
const pinia = createPinia()
// 使用持久化存储插件
pinia.use(persist)

// 默认导出，给 main.ts 使用
export default pinia

// 模块统一导出
export * from './modules/my'
export * from './modules/system'