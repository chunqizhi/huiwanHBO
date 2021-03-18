// import {
//     huiwanUsdtLoopAddr,
//     huiwanTokenAddr,
//     usdtTokenAddr,
//     huiwanUsdtMdexAddr
// } from './addr/cfg.js'

// // huiwanUsdtLoopABI
// import huiwanUsdtLoopABI from "@/apis/abi/huiwanUsdtLoop.abi";

// // huiwanTokenABI
// import huiwanTokenABI from "@/apis/abi/huiwanToken.abi";

// // usdtTokenABI
// import usdtTokenABI from "@/apis/abi/usdtToken.abi";

// // usdtTokenMdexABI
// import huiwanUsdtMdexABI from "@/apis/abi/huiwanUsdtMdex.abi";

// import Contract from './index.js'

// // export default new Contract(
// //     {
// //         huiwanUsdtLoopAddr,
// //         huiwanTokenAddr,
// //         usdtTokenAddr,
// //         huiwanUsdtMdexAddr,

// //         huiwanUsdtLoopABI,
// //         huiwanTokenABI,
// //         usdtTokenABI,
// //         huiwanUsdtMdexABI
// //     }
// // )


// let test = new Contract(
//     [
//         {
//             huiwanUsdtLoopAddr,
//             huiwanUsdtLoopABI,
//             'huiwanUsdtLoopContract': null
//         },
//         {
//             huiwanTokenAddr,
//             huiwanUsdtLoopABI,
//             'huiwanTokenContract': null
//         },
//         {
//             usdtTokenAddr,
//             usdtTokenABI,
//             'usdtTokenContract': null
//         },
//         {
//             huiwanUsdtMdexAddr,
//             huiwanUsdtMdexABI,
//             'huiwanUsdtMdexContract': null
//         }
//     ],

// )
// // console.log(test)

import {
    huiwanUsdtLoopAddr,
    huiwanTokenAddr,
    usdtTokenAddr,
    huiwanUsdtMdexAddr
} from './token.js'

// huiwanUsdtLoopABI
import huiwanUsdtLoopABI from "@/apis/abi/huiwanUsdtLoop.abi";

// huiwanTokenABI
import huiwanTokenABI from "@/apis/abi/huiwanToken.abi";

// usdtTokenABI
import usdtTokenABI from "@/apis/abi/usdtToken.abi";

// usdtTokenMdexABI
import huiwanUsdtMdexABI from "@/apis/abi/huiwanUsdtMdex.abi";

import Contract from './index.js'

export default new Contract({
    huiwanUsdtLoopAddr,
    huiwanTokenAddr,
    usdtTokenAddr,
    huiwanUsdtMdexAddr,
    huiwanUsdtLoopABI,
    huiwanTokenABI,
    usdtTokenABI,
    huiwanUsdtMdexABI
})

