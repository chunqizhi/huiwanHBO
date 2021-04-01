import {
    huiwanUsdtLoopAddr,

    huiwanTokenAddr,
    // huiwanHTMdexAddr,
    // huiwanHTPoolAddr,

    MDXUsdtPoolAddr,
    HBOUSDTMdexAddr
} from './token.js'

// huiwanUsdtLoopABI
import huiwanUsdtLoopABI from "@/apis/abi/huiwanUsdtLoop.abi";

// huiwanTokenABI
import huiwanTokenABI from "@/apis/abi/huiwanToken.abi";

import huiwanHTABI from "@/apis/abi/HBOToken.abi";

import Contract from './contract/bsv.js'


const huiwanHTMdexAddr = HBOUSDTMdexAddr
const huiwanHTPoolAddr = MDXUsdtPoolAddr
export default new Contract({
    huiwanUsdtLoopAddr,
    huiwanTokenAddr,
    huiwanHTMdexAddr,
    huiwanHTPoolAddr,
    huiwanUsdtLoopABI,
    huiwanTokenABI,
    huiwanHTABI
})