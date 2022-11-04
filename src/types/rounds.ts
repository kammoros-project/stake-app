import { BigNumber } from "ethers"

export interface IRound {
    index: BigNumber
    startTime: BigNumber
    duration: BigNumber
    endTime: BigNumber
    amountAllocated: BigNumber
    amountClaimed: BigNumber
}