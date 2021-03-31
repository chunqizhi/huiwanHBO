import { huiwanTokenAddr, huiwanSinglePoolAddr } from './token.js'

import huiwanTokenABI from "@/apis/abi/huiwanToken.abi";
import huiwanSinglePoolABI from "@/apis/abi/huiwanUsdtLoop.abi";

import Contract from './contract/singleContract.js'

export default new Contract({
    huiwanTokenAddr,
    huiwanSinglePoolAddr,
    huiwanTokenABI,
    huiwanSinglePoolABI
})