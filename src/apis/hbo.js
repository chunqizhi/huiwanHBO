import { HBOPoolAddr, HBOContractAddr } from './token.js'


import huiwanSinglePoolABI from "@/apis/abi/huiwanUsdtLoop.abi";

import HBOTokenABI from "@/apis/abi/HBOToken.abi";

import Contract from './contract/singleContract.js'



const huiwanSinglePoolAddr = HBOPoolAddr
    // const huiwanSinglePoolABI = HBOToken
const huiwanTokenABI = HBOTokenABI
const huiwanTokenAddr = HBOContractAddr

export default new Contract({
    huiwanTokenAddr,
    huiwanSinglePoolAddr,
    huiwanTokenABI,
    huiwanSinglePoolABI
})