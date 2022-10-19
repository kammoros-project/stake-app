import { useAddress, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react"
import { format, formatDuration, intervalToDuration } from "date-fns"
import { BaseContract, BigNumber, BigNumberish, ethers } from "ethers"
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

const tdClass = "px-4 py-2 text-right border-t-2 text-sm"
const headTdClass = "px-4 py-2 text-right text-xs uppercase font-semibold text-slate-600"

function RoundRow({ stakingContract, index }: IRoundRow) {

    const address = useAddress()

    const { data: round } = useContractRead(stakingContract, "rounds", index)
    // const { data: tokensForRound } = useContractRead(stakingContract, "tokensForRound", index)
    // const { data: tokensByAddress } = useContractRead(stakingContract, "getTokensByAddress", address)
    // const { data: getTokens } = useContractRead(stakingContract, "getTokens")
    // const { data: weightedAverageForRound } = useContractRead(stakingContract, "weightedAverageForRound", index)
    const { mutateAsync: claimForRound } = useContractWrite(stakingContract, "claimForRound")

    const { data: getNbTokensForRound } = useContractRead(stakingContract, "getNbTokensForRound", index)
    const { data: getNbTokensForRoundByAddress } = useContractRead(stakingContract, "getNbTokensForRoundByAddress", index, address)
    const { data: getWeightedAverageByAddress } = useContractRead(stakingContract, "getWeightedAverageByAddress", index, address)

    const { data: getAllocatedByAddress } = useContractRead(stakingContract, "getAllocatedByAddress", index, address)
    const { data: getClaimedByAddress } = useContractRead(stakingContract, "getClaimedByAddress", index, address)
    const { data: getUnclaimedByAddress } = useContractRead(stakingContract, "getUnclaimedByAddress", index, address)

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
        if (!endTime) { return true }
        if (endTime > Date.now()) {
            return true
        } else {
            if (getUnclaimedByAddress.gt(0)) {
                return false
            } else {
                return true
            }
        }
    }

    return (
        <tr>
            <td className={tdClass}>{index}</td>
            <td className={tdClass}>{ startTime ?  <>{format(startTime, "dd/MM/yyyy HH:mm:ss")}</> : <></>}</td>
            <td className={tdClass}>{ endTime ?  <>{format(endTime, "dd/MM/yyyy HH:mm:ss")}</> : <></>}</td>
            <td className={tdClass}>{ startTime && endTime ?  <>{formatDuration(intervalToDuration({ start: new Date(startTime), end: new Date(endTime) }))}</> : <>Loading</>}</td>
            <td className={tdClass}>{ getNbTokensForRound ? <>{getNbTokensForRound.toString()}</> : <>-</> }</td>
            <td className={tdClass}>{ getNbTokensForRoundByAddress ? <>{getNbTokensForRoundByAddress.toString()}</> : <>-</> }</td>
            <td className={tdClass}>{ getWeightedAverageByAddress ? <>{formatNb(getWeightedAverageByAddress.mul(100))}%</> : <>-</> }</td>
            <td className={tdClass}>{ round ? <>{formatNb(round.amount)}</> : <>-</> }</td>
            <td className={tdClass}>{ getAllocatedByAddress ? <>{formatNb(getAllocatedByAddress)}</> : <>-</>}</td>
            <td className={tdClass}>{ getClaimedByAddress ? <>{formatNb(getClaimedByAddress)}</> : <>-</>}</td>
            <td className={tdClass}>{ getUnclaimedByAddress ? <>{formatNb(getUnclaimedByAddress)}</> : <>-</>}</td>
            <td className={tdClass}>
                <button className="px-2 py-1 uppercase rounded bg-emerald-400 text-white fon-semibold hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-300" onClick={() => claimRound()} disabled={claimDisabled()}>
                    <div className="flex justify-between items-center gap-2">
                        { claiming ? <Spin /> : <></>}
                        <span>claim</span>
                    </div>
                </button>
            </td>
        </tr>
    )
}

function NFTStakingTable({ contractAddress }: INFTStakingTable) {
    const address = useAddress()
    const { contract: stakingContract, isLoading, error } = useContract(contractAddress, ERC721Staking.abi)

    const { data: nbRounds, isLoading: isLoadingNbRounds } = useContractRead(stakingContract, "nbRounds")

    return (
        <>
            {isLoading ? <div>Loading...</div> : error ? <div>{JSON.stringify(error)}</div> : <>
                <div className="py-16">
                    <NFTViewerGroup stakingContract={stakingContract} />
                </div>
                {/* <div>Rounds: { isLoadingNbRounds ? <></> : <>{nbRounds.toString()}</>}</div> */}
                <table className="table-auto">
                    <thead>
                        <tr>
                            <td className={headTdClass}>Round</td>
                            <td className={headTdClass}>Start Time</td>
                            <td className={headTdClass}>End Time</td>
                            <td className={headTdClass}>Duration</td>
                            <td className={headTdClass}>Total Staked</td>
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
                        { nbRounds ? _.times(nbRounds, (index) => <RoundRow key={index} stakingContract={stakingContract} index={index} />) : <></> }
                    </tbody>
                </table>
            </>}
        </>
    )
}

export default NFTStakingTable