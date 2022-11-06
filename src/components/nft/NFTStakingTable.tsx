import { BigNumber } from "ethers"
import _ from "lodash"
import useNbRounds from "../../hooks/ERC721Staking/useNbRounds"
import RoundRow from "./RoundRow"

interface INFTStakingTable {
    contractAddress: string
}

const headTdClass = "px-3 py-2 text-right text-xs uppercase font-semibold text-slate-400"

function NFTStakingTable({ contractAddress }: INFTStakingTable) {

    const nbRounds = useNbRounds(contractAddress)

    return (
        <div className="bg-slate-700 w-full p-4 rounded-lg flex flex-col gap-4">
            <div className="text-white text-xs font-semibold uppercase">Rounds ({nbRounds && nbRounds.toString()})</div>
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
                    {nbRounds ? _.times(nbRounds, (index) => <RoundRow key={index} contractAddress={contractAddress} index={BigNumber.from(index)} />) : <></>}
                </tbody>
            </table>
        </div>
    )
}

export default NFTStakingTable