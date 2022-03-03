// 这个只是理解，不能这样写
// import {default as trademark} from './trademark'
// import {default as attr} from './attr'
// export trademark
// export attr
// 
// {
//   trademark,
//   attr
// }

export {default as trademark} from './product/trademark'
export {default as attrs} from "@/api/product/attrs"
export {default as categorylist} from "@/api/product/categorylist"
export {default as sku} from "@/api/product/sku"
export {default as permission} from "@/api/acl/permission"
export {default as role} from "@/api/acl/role"
// export {default as user} from "@/api/acl/user"
export * as user from "@/api/acl/user"



