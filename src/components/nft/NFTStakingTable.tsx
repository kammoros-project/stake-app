import { useAddress, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react"
import { format, formatDuration, intervalToDuration } from "date-fns"
import { BigNumber, ethers } from "ethers"
import { useEffect, useState } from "react"
import ERC721Staking from "../../abi/ERC721Staking.json"
import NFTViewerGroup from "./NFTViewerGroup"
import _ from "lodash"
import Spin from "../support/Spin"

interface INFTStakingTable {
    contractAddress: string
}

interface IRoundRow {
    stakingContract: any
    index: number
}

const tdClass = "px-4 py-4 text-right border-t border-slate-500 text-sm text-slate-50"
const headTdClass = "px-4 py-2 text-right text-xs uppercase font-semibold text-slate-400"

function RoundRow({ stakingContract, index }: IRoundRow) {

    const address = useAddress()

    const { data: round } = useContractRead(stakingContract, "rounds", index)
    const { mutateAsync: claimForRound } = useContractWrite(stakingContract, "claimForRound")

    const { data: countDepositsForRound } = useContractRead(stakingContract, "countDepositsForRound", index)
    const { data: countDepositsForRoundByAddress } = useContractRead(stakingContract, "countDepositsForRoundByAddress", index, address)
    const { data: weightedAverageForRoundByAddress } = useContractRead(stakingContract, "weightedAverageForRoundByAddress", index, address)

    const { data: ethAllocForRoundByAddress } = useContractRead(stakingContract, "ethAllocForRoundByAddress", index, address)
    const { data: ethClaimedForRoundByAddress } = useContractRead(stakingContract, "ethClaimedForRoundByAddress", index, address)
    const { data: ethUnclaimedForRoundByAddress } = useContractRead(stakingContract, "ethUnclaimedForRoundByAddress", index, address)

    const [startTime, setStartTime] = useState<number>()
    const [endTime, setEndTime] = useState<number>()

    const [claiming, setClaiming] = useState<boolean>(false)

    useEffect(() => {
        if (round) {
            let startTime = round.startTime as BigNumber
            startTime = startTime.mul(1000)
            setStartTime(startTime.toNumber())
            let endTime = round.endTime as BigNumber
            endTime = endTime.mul(1000)
            setEndTime(endTime.toNumber())
        }
    }, [round])

    function formatNb(bn: BigNumber, dp: number = 4) {
        return (+ethers.utils.formatEther(bn)).toFixed(dp)
    }

    async function claimRound() {
        if (!address) return;
        setClaiming(true)
        await claimForRound([index])
        setClaiming(false)
    }

    function claimDisabled() {
        if (!address) return true
        if (!endTime) return true
        if (!ethUnclaimedForRoundByAddress) return true

        if (endTime > Date.now()) {
            return true
        } else {
            if (ethUnclaimedForRoundByAddress.gt(0)) {
                return false
            } else {
                return true
            }
        }
    }

    return (
        <tr>
            <td className={tdClass}>{index}</td>
            <td className={tdClass}>{startTime ? <>{format(startTime, "dd/MM/yyyy HH:mm:ss")}</> : <></>}</td>
            <td className={tdClass}>{endTime ? <>{format(endTime, "dd/MM/yyyy HH:mm:ss")}</> : <></>}</td>
            <td className={tdClass}>{startTime && endTime ? <>{formatDuration(intervalToDuration({ start: new Date(startTime), end: new Date(endTime) }))}</> : <>Loading</>}</td>
            <td className={tdClass}>
                <span>{countDepositsForRound ? <>{countDepositsForRound.toString()}</> : <>-</>}</span>
                <span>/</span>
                <span>{countDepositsForRoundByAddress ? <>{countDepositsForRoundByAddress.toString()}</> : <>-</>}</span>
            </td>
            <td className={tdClass}>{weightedAverageForRoundByAddress ? <>{formatNb(weightedAverageForRoundByAddress.mul(100))}%</> : <>-</>}</td>
            <td className={tdClass}>{round ? <>{formatNb(round.amountAllocated)}</> : <>-</>}</td>
            <td className={tdClass}>{ethAllocForRoundByAddress ? <>{formatNb(ethAllocForRoundByAddress)}</> : <>-</>}</td>
            <td className={tdClass}>{ethClaimedForRoundByAddress ? <>{formatNb(ethClaimedForRoundByAddress)}</> : <>-</>}</td>
            <td className={tdClass}>{ethUnclaimedForRoundByAddress ? <>{formatNb(ethUnclaimedForRoundByAddress)}</> : <>-</>}</td>
            <td className={`${tdClass} pr-0`}>
                <button className="px-2 py-1 uppercase rounded border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-emerald-800 disabled:border-slate-100 disabled:bg-slate-200/20  disabled:text-slate-200" onClick={() => claimRound()} disabled={claimDisabled()}>
                    <div className="flex justify-between items-center gap-2">
                        {claiming ? <Spin /> : <></>}
                        <span>claim</span>
                    </div>
                </button>
            </td>
        </tr>
    )
}

function NFTStakingTable({ contractAddress }: INFTStakingTable) {
    const { contract: stakingContract, isLoading, error } = useContract(contractAddress, ERC721Staking.abi)

    const { data: nbRounds } = useContractRead(stakingContract, "nbRounds")

    return (
        <>
            {isLoading ? <div>Loading...</div> : error ? <div>{JSON.stringify(error)}</div> : <>
            <div className="flex flex-col gap-4">
                <div>
                    <NFTViewerGroup stakingContract={stakingContract} />
                </div>
                <div className="bg-slate-700 w-full p-4">
                    <table className="table-fixed w-full">
                        <thead>
                            <tr>
                                <td className={headTdClass}>Round</td>
                                <td className={headTdClass}>Start Time</td>
                                <td className={headTdClass}>End Time</td>
                                <td className={headTdClass}>Duration</td>
                                <td className={headTdClass}>Your Stake</td>
                                <td className={headTdClass}>Allocation</td>
                                <td className={headTdClass}>Round Amount</td>
                                <td className={headTdClass}>Allocation</td>
                                <td className={headTdClass}>Claimed</td>
                                <td className={headTdClass}>Unclaimed</td>
                                <td className={headTdClass}></td>
                            </tr>
                        </thead>
                        <tbody>
                            {nbRounds ? _.times(nbRounds, (index) => <RoundRow key={index} stakingContract={stakingContract} index={index} />) : <></>}
                        </tbody>
                    </table>
                </div>
            </div>
            </>}
        </>
    )
}

export default NFTStakingTable