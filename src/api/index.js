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

export {default as trademark} from './trademark'
export {default as attrs} from "@/api/attrs"
export {default as categorylist} from "@/api/categorylist"
export {default as sku} from "@/api/sku"
export {default as spu} from "@/api/spu"