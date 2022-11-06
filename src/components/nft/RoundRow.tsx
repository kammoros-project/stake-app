import { useEthers, useContractFunction } from "@usedapp/core"
import { Contract, BigNumber, ethers } from "ethers"
import moment from "moment"
import { useState, useEffect } from "react"
import useCountDepositsForRound from "../../hooks/ERC721Staking/useCountDepositsForRound"
import useCountDepositsForRoundByAddress from "../../hooks/ERC721Staking/useCountDepositsForRoundByAddress"
import useETHAllocForRoundByAddress from "../../hooks/ERC721Staking/useETHAllocForRoundByAddress"
import useETHClaimedForRoundByAddress from "../../hooks/ERC721Staking/useETHClaimedForRoundByAddress"
import useETHUnclaimedForRoundByAddress from "../../hooks/ERC721Staking/useETHUnclaimedForRoundByAddress"
import useRound from "../../hooks/ERC721Staking/useRound"
import useWeightedAverageForRoundByAddress from "../../hooks/ERC721Staking/useWeightedAverageForRoundByAddress"
import { formatCountdown, formatSimplePercent, formatCommify } from "../../support/formatters"
import Spin from "../support/Spin"
import ERC721Staking from "../../abi/ERC721Staking.json"
import Loading from "../support/Loading"

interface IRoundRow {
    contractAddress: string
    index: number
}

const tdClass = "px-3 py-4 text-right border-t border-slate-500 text-sm text-slate-50"

export default function RoundRow({ contractAddress, index }: IRoundRow) {

    const { account } = useEthers()

    const round = useRound(contractAddress, index)

    const countDepositsForRound = useCountDepositsForRound(contractAddress, index)
    const countDepositsForRoundByAddress = useCountDepositsForRoundByAddress(contractAddress, index, account)
    const weightedAverageForRoundByAddress = useWeightedAverageForRoundByAddress(contractAddress, index, account)

    const ethAllocForRoundByAddress = useETHAllocForRoundByAddress(contractAddress, index, account)
    const ethClaimedForRoundByAddress = useETHClaimedForRoundByAddress(contractAddress, index, account)
    const ethUnclaimedForRoundByAddress = useETHUnclaimedForRoundByAddress(contractAddress, index, account)

    const contract = new Contract(contractAddress, ERC721Staking.abi)
    const { state, send } = useContractFunction(contract, 'claimForRound', { transactionName: 'Claim' })

    const [startTime, setStartTime] = useState<number>()
    const [endTime, setEndTime] = useState<number>()

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

    function formatNb(bn: BigNumber, dp: number = 2) {
        return (+ethers.utils.formatEther(bn)).toFixed(dp)
    }

    async function claimRound() {
        if (!account) return;
        await send(index)
    }

    function claimDisabled() {
        if (!account) return true
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
        <>
            <tr className="hidden lg:table-row">
                <td className={tdClass}>{index}</td>
                <td className={tdClass} colSpan={2}>{startTime ? moment(round.startTime.toNumber() * 1000).format("MMM Do YYYY, HH:mm") : <Loading />}</td>
                <td className={tdClass} colSpan={2}>{endTime ? moment(round.startTime.toNumber() * 1000).format("MMM Do YYYY, HH:mm") : <Loading />}</td>
                <td className={tdClass} colSpan={2}>{startTime && endTime ? formatCountdown(round) : <Loading />}</td>
                <td className={tdClass}>
                    {countDepositsForRoundByAddress && countDepositsForRound ?
                        <>
                            <span>{countDepositsForRoundByAddress.toString()}</span>
                            <span>/</span>
                            <span>{countDepositsForRound.toString()}</span>
                        </> : <Loading />}
                </td>
                <td className={tdClass}>{weightedAverageForRoundByAddress ? formatSimplePercent(weightedAverageForRoundByAddress) : <Loading />}</td>
                <td className={tdClass}>{round ? <>{formatNb(round.amountAllocated)}</> : <Loading />}</td>
                <td className={tdClass}>{ethAllocForRoundByAddress ? formatNb(ethAllocForRoundByAddress) : <Loading />}</td>
                <td className={tdClass}>{ethClaimedForRoundByAddress ? formatNb(ethClaimedForRoundByAddress) : <Loading />}</td>
                <td className={tdClass}>{ethUnclaimedForRoundByAddress ? formatNb(ethUnclaimedForRoundByAddress) : <Loading />}</td>
                <td className={`${tdClass} pr-0`} colSpan={2}>
                    <button className="px-2 py-1 uppercase rounded border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-emerald-800 disabled:border-slate-500 disabled:bg-slate-500/20  disabled:text-slate-500" onClick={() => claimRound()} disabled={claimDisabled()}>
                        <div className="flex justify-between items-center gap-2">
                            {(state.status === "Mining" || state.status === "PendingSignature") && <Spin />}
                            <span>claim</span>
                        </div>
                    </button>
                </td>
            </tr>
            <tr className="lg:hidden border-b border-b-slate-500 text-sm text-slate-50">
                <td className="flex flex-col gap-2 text-">
                    <div className="flex justify-between items-center">
                        <span>Round</span>
                        <span>{index}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Start Time</span>
                        <span>{startTime ? moment(round.startTime.toNumber() * 1000).format("MMM Do YYYY, HH:mm") : <Loading />}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>End Time</span>
                        <span>{endTime ? moment(round.endTime.toNumber() * 1000).format("MMM Do YYYY, HH:mm") : <Loading />}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Duration</span>
                        <span>{startTime && endTime ? formatCountdown(round) : <Loading />}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Stake</span>
                        <div className="w-full text-right">
                            {countDepositsForRoundByAddress && countDepositsForRound ?
                                <>
                                    <span>{countDepositsForRoundByAddress.toString()}</span>
                                    <span>/</span>
                                    <span>{countDepositsForRound.toString()}</span>
                                </> : <Loading width="w-12"/>}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Percentage</span>
                        <div className="w-full text-right">{weightedAverageForRoundByAddress ? formatSimplePercent(weightedAverageForRoundByAddress) : <Loading width="w-12"/>}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Round*</span>
                        <div className="w-full text-right">{round ? formatNb(round.amountAllocated) : <Loading width="w-12"/>}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Yours*</span>
                        <div className="w-full text-right">{ethAllocForRoundByAddress ? formatCommify(ethAllocForRoundByAddress) : <Loading width="w-12"/>}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Claimed*</span>
                        <div className="w-full text-right">{ethClaimedForRoundByAddress ? formatCommify(ethClaimedForRoundByAddress) : <Loading width="w-12"/>}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Unclaimed*</span>
                        <div className="w-full text-right">{ethUnclaimedForRoundByAddress ? formatCommify(ethUnclaimedForRoundByAddress) : <Loading width="w-12"/>}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <button className="w-full px-auto py-2 uppercase rounded border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-emerald-800 disabled:border-slate-500 disabled:bg-slate-500/20  disabled:text-slate-500" onClick={() => claimRound()} disabled={claimDisabled()}>
                            <div className="flex justify-center items-center gap-2">
                                {(state.status === "Mining" || state.status === "PendingSignature") && <Spin />}
                                <span>claim</span>
                            </div>
                        </button>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>*BNB</span>
                    </div>
                </td>
            </tr>
        </>
    )
}