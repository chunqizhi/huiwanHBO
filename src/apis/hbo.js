import {
    huiwanUsdtLoopAddr,
    huiwanTokenAddr,
    usdtTokenAddr,
    huiwanUsdtMdexAddr,
    huiwanHTAddr,
    huiwanHTMdexAddr,
    huiwanHTPoolAddr,
    HBOContractAddr
} from './token.js'

// huiwanUsdtLoopABI
import huiwanUsdtLoopABI from "@/apis/abi/huiwanUsdtLoop.abi";

// huiwanTokenABI
import huiwanTokenABI from "@/apis/abi/huiwanToken.abi";

// usdtTokenABI
import usdtTokenABI from "@/apis/abi/usdtToken.abi";

// usdtTokenMdexABI
import huiwanUsdtMdexABI from "@/apis/abi/huiwanUsdtMdex.abi";
// 
import huiwanHTABI from "@/apis/abi/huiwanHT.abi";

import Contract from './contract/hbo.js'

// HBO
import HBOTokenABI from "@/apis/abi/HBOToken.abi";

export default new Contract({
    huiwanUsdtLoopAddr,
    huiwanTokenAddr,
    usdtTokenAddr,
    huiwanUsdtMdexAddr,
    huiwanUsdtLoopABI,
    huiwanTokenABI,
    usdtTokenABI,
    huiwanUsdtMdexABI,

    huiwanHTAddr,
    huiwanHTMdexAddr,
    huiwanHTPoolAddr,
    huiwanHTABI,

    HBOContractAddr,
    HBOPoolAddr,
    HBOTokenABI
})