import {
    huiwanUsdtLoopAddr,

    huiwanTokenAddr,
    // huiwanHTMdexAddr,
    // huiwanHTPoolAddr,
    usdtTokenAddr,
    MDXUsdtPoolAddr,
    HBOUSDTMdexAddr
} from './token.js'

// huiwanUsdtLoopABI
import huiwanUsdtLoopABI from "@/apis/abi/huiwanUsdtLoop.abi";

// huiwanTokenABI
import huiwanTokenABI from "@/apis/abi/huiwanToken.abi";

import huiwanHTABI from "@/apis/abi/HBOToken.abi";

import Contract from './contract/five.js'

import usdtTokenABI from '@/apis/abi/usdtToken.abi.js'

const huiwanHTMdexAddr = HBOUSDTMdexAddr
const huiwanHTPoolAddr = MDXUsdtPoolAddr
export default new Contract({
    huiwanUsdtLoopAddr,
    huiwanTokenAddr,
    huiwanHTMdexAddr,
    huiwanHTPoolAddr,
    huiwanUsdtLoopABI,
    huiwanTokenABI,
    huiwanHTABI,
    usdtTokenABI,
    usdtTokenAddr
})