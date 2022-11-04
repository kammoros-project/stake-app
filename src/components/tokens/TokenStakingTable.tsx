import { useAddress, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react"
import { format, formatDuration, intervalToDuration } from "date-fns"
import { BigNumber, ethers } from "ethers"
import { useEffect, useState } from "react"
import ERC20Staking from "../../abi/ERC20Staking.json"
import _ from "lodash"
import Spin from "../support/Spin"
import TokenForm from "./TokenForm"
import { tokenStakingAddress } from "../../contracts"

interface IRoundRow {
    stakingContract: any
    index: number
}

const tdClass = "px-3 py-4 text-right border-t border-slate-500 text-sm text-slate-50"
const headTdClass = "px-3 py-2 text-right text-xs uppercase font-semibold text-slate-400"

function RoundRow({ stakingContract, index }: IRoundRow) {

    const address = useAddress()

    const { data: round } = useContractRead(stakingContract, "rounds", index)
    const { mutateAsync: claimForRound } = useContractWrite(stakingContract, "claimForRound")

    const { data: amountStakedForRound } = useContractRead(stakingContract, "amountStakedForRound", index)
    const { data: amountStakedForRoundByAddress } = useContractRead(stakingContract, "amountStakedForRoundByAddress", index, address)
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

    function formatNb(bn: BigNumber, dp: number = 2) {
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
        <>
            <tr className="hidden lg:table-row">
                <td className={tdClass}>{index}</td>
                <td className={tdClass} colSpan={2}>{startTime ? <>{(new Date(startTime)).toUTCString()}</> : <></>}</td>
                <td className={tdClass} colSpan={2}>{endTime ? <>{(new Date(endTime)).toUTCString()}</> : <></>}</td>
                <td className={tdClass} colSpan={2}>{startTime && endTime ? <>{formatDuration(intervalToDuration({ start: new Date(startTime), end: new Date(endTime) }))}</> : <>Loading</>}</td>
                <td className={tdClass}>
                    <span>{amountStakedForRoundByAddress ? <>{formatNb(amountStakedForRoundByAddress, 0)}</> : <>-</>}</span>
                    <span>/</span>
                    <span>{amountStakedForRound ? <>{formatNb(amountStakedForRound, 0)}</> : <>-</>}</span>
                </td>
                <td className={tdClass}>{weightedAverageForRoundByAddress ? <>{formatNb(weightedAverageForRoundByAddress.mul(100))}%</> : <>-</>}</td>
                <td className={tdClass}>{round ? <>{formatNb(round.amountAllocated)}</> : <>-</>}</td>
                <td className={tdClass}>{ethAllocForRoundByAddress ? <>{formatNb(ethAllocForRoundByAddress)}</> : <>-</>}</td>
                <td className={tdClass}>{ethClaimedForRoundByAddress ? <>{formatNb(ethClaimedForRoundByAddress)}</> : <>-</>}</td>
                <td className={tdClass}>{ethUnclaimedForRoundByAddress ? <>{formatNb(ethUnclaimedForRoundByAddress)}</> : <>-</>}</td>
                <td className={`${tdClass} pr-0`} colSpan={2}>
                    <button className="px-2 py-1 uppercase rounded border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-emerald-800 disabled:border-slate-500 disabled:bg-slate-500/20  disabled:text-slate-500" onClick={() => claimRound()} disabled={claimDisabled()}>
                        <div className="flex justify-between items-center gap-2">
                            {claiming ? <Spin /> : <></>}
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
                        <span>{startTime ? <>{format(startTime, "dd/MM/yyyy HH:mm:ss")}</> : <></>}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>End Time</span>
                        <span>{endTime ? <>{format(endTime, "dd/MM/yyyy HH:mm:ss")}</> : <></>}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Duration</span>
                        <span>{startTime && endTime ? <>{formatDuration(intervalToDuration({ start: new Date(startTime), end: new Date(endTime) }))}</> : <>Loading</>}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Stake</span>
                        <div>
                            <span>{amountStakedForRoundByAddress ? <>{formatNb(amountStakedForRoundByAddress, 0)}</> : <>-</>}</span>
                            <span>/</span>
                            <span>{amountStakedForRound ? <>{formatNb(amountStakedForRound, 0)}</> : <>-</>}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Percentage</span>
                        <span>{weightedAverageForRoundByAddress ? <>{formatNb(weightedAverageForRoundByAddress.mul(100))}%</> : <>-</>}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Round</span>
                        <span>{round ? <>{formatNb(round.amountAllocated)}</> : <>-</>}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Yours</span>
                        <span>{ethAllocForRoundByAddress ? <>{formatNb(ethAllocForRoundByAddress)}</> : <>-</>}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Claimed*</span>
                        <span>{ethClaimedForRoundByAddress ? <>{formatNb(ethClaimedForRoundByAddress)}</> : <>-</>}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Unclaimed*</span>
                        <span>{ethUnclaimedForRoundByAddress ? <>{formatNb(ethUnclaimedForRoundByAddress)}</> : <>-</>}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <button className="w-full px-auto py-2 uppercase rounded border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-emerald-800 disabled:border-slate-500 disabled:bg-slate-500/20  disabled:text-slate-500" onClick={() => claimRound()} disabled={claimDisabled()}>
                            <div className="flex justify-center items-center gap-2">
                                {claiming ? <Spin /> : <></>}
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

interface ITokenInput {
    stakingContract: any
}

function TokenInput({ stakingContract }: ITokenInput) {

    return (
        <div>
            <div>
                <TokenForm stakingContract={stakingContract} />
            </div>
        </div>
    )

}

function TokenStakingTable() {
    const address = useAddress()
    const { contract: stakingContract, isLoading, error } = useContract(tokenStakingAddress, ERC20Staking.abi)
    const { data: balanceOf } = useContractRead(stakingContract, "balanceOf", address)
    const { mutateAsync: withdrawToken } = useContractWrite(stakingContract, "withdrawToken")

    const { data: nbRounds } = useContractRead(stakingContract, "nbRounds")

    const [withdrawing, setWithdrawing] = useState<boolean>(false)

    async function withdraw() {
        setWithdrawing(true)
        await withdrawToken([])
        setWithdrawing(false)
    }

    return (
        <>
            {isLoading ? <div>Loading...</div> : error ? <div>{JSON.stringify(error)}</div> : <>
                <div className="flex flex-col gap-4">
                    <div className="grid lg:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4 bg-slate-700 p-4">
                            <h3 className="font-semibold text-slate-50">Owned</h3>
                            <TokenInput stakingContract={stakingContract} />
                        </div>
                        <div className="flex justify-between bg-slate-700 p-4 text-slate-50">
                            <h3 className="font-semibold text-slate-50">Staked: {balanceOf ? <>{ethers.utils.formatEther(balanceOf)}</> : <>-</>}</h3>
                            {balanceOf && (balanceOf as BigNumber).gt(0) ?
                                <div>
                                    <button className="text-xs uppercase border border-orange-400 text-orange-400 rounded p-2 hover:bg-orange-400 hover:text-orange-800" onClick={() => withdraw()}>
                                        <div className="flex justify-between items-center gap-2">
                                            {withdrawing ? <Spin /> : <></>}
                                            <span>Withdraw Tokens</span>
                                        </div>
                                    </button>
                                </div> : <div>Buy $KMC on <a className="text-blue-300 hover:underline" href="https://pancakeswap.finance/swap?outputCurrency=0x0974e5F2772a998301D7D6e9aca3F74d80Eef709">PancakeSwap</a>.</div>}
                        </div>
                    </div>
                    <div className="bg-slate-700 w-full p-4">
                        <table className="table-auto w-full">
                            <thead>
                                <tr className="hidden lg:table-row">
                                    <td className={headTdClass}>#</td>
                                    <td className={headTdClass} colSpan={2}>Start Time</td>
                                    <td className={headTdClass} colSpan={2}>End Time</td>
                                    <td className={headTdClass} colSpan={2}>Duration</td>
                                    <td className={headTdClass}>Stake</td>
                                    <td className={headTdClass}>%</td>
                                    <td className={headTdClass}>Round*</td>
                                    <td className={headTdClass}>Yours*</td>
                                    <td className={headTdClass}>Claimed*</td>
                                    <td className={headTdClass}>Unclaimed*</td>
                                    <td className={`${headTdClass} pr-0`} colSpan={2}>*BNB</td>
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

export default TokenStakingTable