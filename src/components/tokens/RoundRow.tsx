import { useEthers, useContractFunction } from "@usedapp/core"
import { format, formatDuration, intervalToDuration } from "date-fns"
import { Contract, BigNumber, ethers } from "ethers"
import moment from "moment"
import { useState, useEffect } from "react"
import { tokenStakingAddress } from "../../constants"
import useAmountStakedForRound from "../../hooks/ERC20Staking/useAmountStakedForRound"
import useAmountStakedForRoundByAddress from "../../hooks/ERC20Staking/useAmountStakedForRoundByAddress"
import useETHAllocForRoundByAddress from "../../hooks/ERC721Staking/useETHAllocForRoundByAddress"
import useETHClaimedForRoundByAddress from "../../hooks/ERC721Staking/useETHClaimedForRoundByAddress"
import useETHUnclaimedForRoundByAddress from "../../hooks/ERC721Staking/useETHUnclaimedForRoundByAddress"
import useRound from "../../hooks/ERC721Staking/useRound"
import useWeightedAverageForRoundByAddress from "../../hooks/ERC721Staking/useWeightedAverageForRoundByAddress"
import { formatCountdown, formatCommify, formatSimplePercent } from "../../support/formatters"
import Spin from "../support/Spin"
import ERC20Staking from "../../abi/ERC20Staking.json"
import Loading from "../support/Loading"

interface IRoundRow {
    index: BigNumber
}

const tdClass = "px-3 py-4 text-right border-t border-slate-500 text-sm text-slate-50"

export default function RoundRow({ index }: IRoundRow) {

    const { account } = useEthers()
    const round = useRound(tokenStakingAddress, index)

    const amountStakedForRound = useAmountStakedForRound(tokenStakingAddress, index)
    const amountStakedForRoundByAddress = useAmountStakedForRoundByAddress(tokenStakingAddress, index, account)
    const weightedAverageForRoundByAddress = useWeightedAverageForRoundByAddress(tokenStakingAddress, index, account)

    const ethAllocForRoundByAddress = useETHAllocForRoundByAddress(tokenStakingAddress, index, account)
    const ethClaimedForRoundByAddress = useETHClaimedForRoundByAddress(tokenStakingAddress, index, account)
    const ethUnclaimedForRoundByAddress = useETHUnclaimedForRoundByAddress(tokenStakingAddress, index, account)

    const contract = new Contract(tokenStakingAddress, ERC20Staking.abi)
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
                <td className={tdClass}>{index.toString()}</td>
                <td className={tdClass} colSpan={2}>{startTime ? moment(round.startTime.toNumber() * 1000).format("MMM Do YYYY, HH:mm") : <Loading />}</td>
                <td className={tdClass} colSpan={2}>{endTime ? moment(round.endtime.toNumber() * 1000).format("MMM Do YYYY, HH:mm") : <Loading />}</td>
                <td className={tdClass} colSpan={2}>{startTime && endTime ? formatCountdown(round) : <Loading />}</td>
                <td className={tdClass}>
                    {amountStakedForRoundByAddress && amountStakedForRound ?
                        <>
                            <span>{formatCommify(amountStakedForRoundByAddress)}</span>
                            <span>/</span>
                            <span>{formatCommify(amountStakedForRound, 0)}</span>
                        </>
                        : <Loading />
                    }
                </td>
                <td className={tdClass}>{weightedAverageForRoundByAddress ? formatSimplePercent(weightedAverageForRoundByAddress) : <Loading />}</td>
                <td className={tdClass}>{round ? formatCommify(round.amountAllocated) : <Loading />}</td>
                <td className={tdClass}>{ethAllocForRoundByAddress ? formatCommify(ethAllocForRoundByAddress) : <Loading />}</td>
                <td className={tdClass}>{ethClaimedForRoundByAddress ? formatCommify(ethClaimedForRoundByAddress) : <Loading />}</td>
                <td className={tdClass}>{ethUnclaimedForRoundByAddress ? formatCommify(ethUnclaimedForRoundByAddress) : <Loading />}</td>
                <td className={`${tdClass} pr-0`} colSpan={2}>
                    <button className="px-2 py-1 uppercase rounded border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-emerald-800 disabled:border-slate-500 disabled:bg-slate-500/20  disabled:text-slate-500" onClick={() => claimRound()} disabled={claimDisabled()}>
                        <div className="flex justify-between items-center gap-2">
                            {state.status === "Mining" || state.status === "PendingSignature" ? <Spin /> : <Loading />}
                            <span>claim</span>
                        </div>
                    </button>
                </td>
            </tr>
            <tr className="lg:hidden border-b border-b-slate-500 text-sm text-slate-50">
                <td className="flex flex-col gap-2 text-">
                    <div className="flex justify-between items-center">
                        <span>Round</span>
                        <span>{index.toString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Start Time</span>
                        <span>{startTime ? format(startTime, "dd/MM/yyyy HH:mm:ss") : <Loading />}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>End Time</span>
                        <span>{endTime ? format(endTime, "dd/MM/yyyy HH:mm:ss") : <Loading />}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Duration</span>
                        <span>{startTime && endTime ? formatDuration(intervalToDuration({ start: new Date(startTime), end: new Date(endTime) })) : <Loading />}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Stake</span>
                        <div className="w-full text-right">
                            {amountStakedForRoundByAddress && amountStakedForRound ?
                                <>
                                    <span>{formatCommify(amountStakedForRoundByAddress)}</span>
                                    <span>/</span>
                                    <span>{formatCommify(amountStakedForRound, 0)}</span>
                                </>
                                : <Loading width="w-12" />}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Percentage</span>
                        <div className="w-full text-right">{weightedAverageForRoundByAddress ? formatSimplePercent(weightedAverageForRoundByAddress) : <Loading width="w-12" />}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Round</span>
                        <div className="w-full text-right">{round ? formatNb(round.amountAllocated || BigNumber.from(0)) : <Loading width="w-12" />}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Yours</span>
                        <div className="w-full text-right">{ethAllocForRoundByAddress ? formatNb(ethAllocForRoundByAddress) : <Loading width="w-12" />}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Claimed*</span>
                        <div className="w-full text-right">{ethClaimedForRoundByAddress ? formatNb(ethClaimedForRoundByAddress) : <Loading width="w-12" />}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Unclaimed*</span>
                        <div className="w-full text-right">{ethUnclaimedForRoundByAddress ? formatNb(ethUnclaimedForRoundByAddress) : <Loading width="w-12" />}</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <button className="w-full px-auto py-2 uppercase rounded border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-emerald-800 disabled:border-slate-500 disabled:bg-slate-500/20  disabled:text-slate-500" onClick={() => claimRound()} disabled={claimDisabled()}>
                            <div className="flex justify-center items-center gap-2">
                                {state.status === "Mining" || state.status === "PendingSignature" ? <Spin /> : <Loading />}
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
