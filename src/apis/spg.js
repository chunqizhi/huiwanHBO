import {
    huiwanUsdtLoopAddr,
    huiwanTokenAddr,
    usdtTokenAddr,
    huiwanUsdtMdexAddr,
    huiwanSinglePoolAddr
} from './addr/spg.js'

// huiwanUsdtLoopABI
import huiwanUsdtLoopABI from "@/apis/abi/huiwanUsdtLoop.abi";

// huiwanTokenABI
import huiwanTokenABI from "@/apis/abi/huiwanToken.abi";

// usdtTokenABI
import usdtTokenABI from "@/apis/abi/usdtToken.abi";

// usdtTokenMdexABI
import huiwanUsdtMdexABI from "@/apis/abi/huiwanUsdtMdex.abi";

// 单池子
import huiwanSinglePoolABI from "@/apis/abi/huiwanUsdtLoop.abi";
// 

import Contract from './_index.js'

export default new Contract({
    huiwanUsdtLoopAddr,
    huiwanTokenAddr,
    usdtTokenAddr,
    huiwanUsdtMdexAddr,
    huiwanSinglePoolAddr,
    huiwanUsdtLoopABI,
    huiwanTokenABI,
    usdtTokenABI,
    huiwanUsdtMdexABI,
    huiwanSinglePoolABI
})

