import { useAddress, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react"
import { format, formatDuration, intervalToDuration } from "date-fns"
import { BigNumber, ethers } from "ethers"
import { useEffect, useState } from "react"
import ERC721Staking from "../../abi/ERC721Staking.json"
import NFTViewerGroup from "./NFTViewerGroup"
import _ from "lodash"
import Spin from "../support/Spin"
import useNotifications from "../../hooks/useNotifications"

interface INFTStakingTable {
    contractAddress: string
}

interface IRoundRow {
    stakingContract: any
    index: number
}

const tdClass = "px-3 py-4 text-right border-t border-slate-500 text-sm text-slate-50"
const headTdClass = "px-3 py-2 text-right text-xs uppercase font-semibold text-slate-400"

function RoundRow({ stakingContract, index }: IRoundRow) {

    const address = useAddress()
    const { addNotification, removeNotification } = useNotifications()

    const { data: round } = useContractRead(stakingContract, "rounds", index)
    const { mutateAsync: claimForRound, isLoading: isClaiming, status: claimStatus } = useContractWrite(stakingContract, "claimForRound")

    const { data: countDepositsForRound } = useContractRead(stakingContract, "countDepositsForRound", index)
    const { data: countDepositsForRoundByAddress } = useContractRead(stakingContract, "countDepositsForRoundByAddress", index, address)
    const { data: weightedAverageForRoundByAddress } = useContractRead(stakingContract, "weightedAverageForRoundByAddress", index, address)

    const { data: ethAllocForRoundByAddress } = useContractRead(stakingContract, "ethAllocForRoundByAddress", index, address)
    const { data: ethClaimedForRoundByAddress } = useContractRead(stakingContract, "ethClaimedForRoundByAddress", index, address)
    const { data: ethUnclaimedForRoundByAddress } = useContractRead(stakingContract, "ethUnclaimedForRoundByAddress", index, address)

    const [startTime, setStartTime] = useState<number>()
    const [endTime, setEndTime] = useState<number>()

    const [loadingNotificationId, setLoadingNotificationId] = useState<number>()

    useEffect(() => {
        if (round) {
            let startTime = round.startTime as BigNumber
            startTime = startTime.mul(1000)
            setStartTime(startTime.toNumber())
            let endTime = round.endTime as BigNumber
            endTime = endTime.mul(1000)
            setEndTime(endTime.toNumber())
        }

        function updateNotifications() {
            switch (claimStatus) {
                case "loading":
                    setLoadingNotificationId(addNotification({ status: claimStatus, heading: "Processing Transaction", message: `Your rewards are being claimed. Please wait while this transaction is processed.`, autoExpire: false }))
                    break;
                case "error":
                    if (loadingNotificationId !== undefined) removeNotification(loadingNotificationId)
                    addNotification({ status: claimStatus, heading: "Transaction Error", message: "Oops! Something went wrong! Please try again later.", autoExpire: true })
                    break;
                case "success":
                    if (loadingNotificationId !== undefined) removeNotification(loadingNotificationId)
                    addNotification({ status: claimStatus, heading: "Transaction Success", message: "Congratulations! Your rewards were successfully claimed.", autoExpire: true })
                    break;
                default:
                    break;
            }
        }

        updateNotifications()
    }, [round])

    function formatNb(bn: BigNumber, dp: number = 2) {
        return (+ethers.utils.formatEther(bn)).toFixed(dp)
    }

    async function claimRound() {
        if (!address) return;
        await claimForRound([index])
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
                <td className={tdClass} colSpan={2}>{startTime ? <>{format(startTime, "dd/MM/yyyy HH:mm:ss")}</> : <></>}</td>
                <td className={tdClass} colSpan={2}>{endTime ? <>{format(endTime, "dd/MM/yyyy HH:mm:ss")}</> : <></>}</td>
                <td className={tdClass} colSpan={2}>{startTime && endTime ? <>{formatDuration(intervalToDuration({ start: new Date(startTime), end: new Date(endTime) }))}</> : <>Loading</>}</td>
                <td className={tdClass}>
                    <span>{countDepositsForRoundByAddress ? <>{countDepositsForRoundByAddress.toString()}</> : <>-</>}</span>
                    <span>/</span>
                    <span>{countDepositsForRound ? <>{countDepositsForRound.toString()}</> : <>-</>}</span>
                </td>
                <td className={tdClass}>{weightedAverageForRoundByAddress ? <>{formatNb(weightedAverageForRoundByAddress.mul(100))}%</> : <>-</>}</td>
                <td className={tdClass}>{round ? <>{formatNb(round.amountAllocated)}</> : <>-</>}</td>
                <td className={tdClass}>{ethAllocForRoundByAddress ? <>{formatNb(ethAllocForRoundByAddress)}</> : <>-</>}</td>
                <td className={tdClass}>{ethClaimedForRoundByAddress ? <>{formatNb(ethClaimedForRoundByAddress)}</> : <>-</>}</td>
                <td className={tdClass}>{ethUnclaimedForRoundByAddress ? <>{formatNb(ethUnclaimedForRoundByAddress)}</> : <>-</>}</td>
                <td className={`${tdClass} pr-0`} colSpan={2}>
                    <button className="px-2 py-1 uppercase rounded border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-emerald-800 disabled:border-slate-500 disabled:bg-slate-500/20  disabled:text-slate-500" onClick={() => claimRound()} disabled={claimDisabled()}>
                        <div className="flex justify-between items-center gap-2">
                            {isClaiming && <Spin />}
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
                            <span>{countDepositsForRoundByAddress ? <>{countDepositsForRoundByAddress.toString()}</> : <>-</>}</span>
                            <span>/</span>
                            <span>{countDepositsForRound ? <>{countDepositsForRound.toString()}</> : <>-</>}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Percentage</span>
                        <span>{weightedAverageForRoundByAddress ? <>{formatNb(weightedAverageForRoundByAddress.mul(100))}%</> : <>-</>}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Round*</span>
                        <span>{round ? <>{formatNb(round.amountAllocated)}</> : <>-</>}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Yours*</span>
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
                                {isClaiming && <Spin />}
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

export default NFTStakingTable