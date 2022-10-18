import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { format, formatDuration, intervalToDuration } from "date-fns"
import { BaseContract, BigNumber, BigNumberish, ethers } from "ethers"
import { useEffect, useState } from "react"
import ERC721Staking from "../../abi/ERC721Staking.json"
import NFTViewerGroup from "./NFTViewerGroup"

interface INFTStakingTable {
    contractAddress: string
}

interface IRoundRow {
    contract: any
    index: number
}

function RoundRow({ contract, index }: IRoundRow) {

    const address = useAddress()

    const { data: round, isLoading } = useContractRead(contract, "rounds", index)
    const { data: tokensForRound } = useContractRead(contract, "tokensForRound", index)
    const { data: tokensByAddress } = useContractRead(contract, "getTokensByAddress", address)
    const { data: getTokens } = useContractRead(contract, "getTokens")
    const { data: weightedAverageForRound } = useContractRead(contract, "weightedAverageForRound", index)

    const [startTime, setStartTime] = useState<number>()
    const [endTime, setEndTime] = useState<number>()

    const [includedTokenIds, setIncludedTokenIds] = useState<BigNumber[]>()
    const [weightedAverage, setWeightedAverage] = useState<BigNumber>()

    useEffect(() => {
        if (round) {
            console.log(round)
            let startTime = round.startTime as BigNumber
            startTime = startTime.mul(1000)
            setStartTime(startTime.toNumber())
            let endTime = round.endTime as BigNumber
            endTime = endTime.mul(1000)
            setEndTime(endTime.toNumber())
            console.log(new Date(startTime.toNumber()))
            console.log(new Date(endTime.toNumber()))
        }
        if (tokensForRound) {
            const [tokenIds, included] = tokensForRound
            const includedTokenIds = []
            for (let index = 0; index < included.length; index++) {
                const value = included[index];
                if (value) { 
                    includedTokenIds.push(tokenIds[index])
                }
            }
            setIncludedTokenIds(includedTokenIds)
        }
        if (tokensByAddress && getTokens && weightedAverageForRound) {
            console.log("tokensByAddress", tokensByAddress)
            console.log("getTokens", getTokens)
            console.log("weightedAverageForRound", weightedAverageForRound)
            let weightedAverage = BigNumber.from(0);
            for (let i = 0; i < getTokens.length; i++) {
                const tokenId = getTokens[i] as BigNumber;
                for (let j = 0; j < tokensByAddress.length; j++) {
                    const tokenIdAlt = tokensByAddress[j] as BigNumber
                    if (tokenId.eq(tokenIdAlt)) {
                        const wA = weightedAverageForRound[i]
                        console.log("wA", wA.toString())
                        weightedAverage = weightedAverage.add(wA)
                    }
                }
            }
            console.log(weightedAverage)
            setWeightedAverage(weightedAverage)
        }
    }, [round, tokensForRound, tokensByAddress, getTokens, weightedAverageForRound])

    function formatNb(bn: BigNumber, dp: number = 2) {
        return (+ethers.utils.formatEther(bn)).toFixed(dp)
    }

    return (
        <tr>
            <td>{index}</td>
            <td>{ startTime ?  <>{format(startTime, "dd/MM/yyyy HH:mm:ss")} UTC</> : <></>}</td>
            <td>{ startTime && endTime ?  <>{formatDuration(intervalToDuration({ start: new Date(startTime), end: new Date(endTime) }))}</> : <>Loading</>}</td>
            <td>{ includedTokenIds ? <>{includedTokenIds.length}</> : <></> }</td>
            <td>{ tokensByAddress ? <>{tokensByAddress.length}</> : <></> }</td>
            <td>{ weightedAverage ? <>{formatNb(weightedAverage.mul(100))}%</> : <></> }</td>
            <td>{ round ? <>{formatNb(round.amount)}</> : <></> }</td>
            <td>{ round && weightedAverage ? <>{formatNb(weightedAverage?.mul(round.amount))}</> : <></> }</td>
            <td></td>
            <td></td>
            <td>
                <button>claim</button>
            </td>
        </tr>
    )
}

function NFTStakingTable({ contractAddress }: INFTStakingTable) {
    const address = useAddress()
    const { contract, isLoading, error } = useContract(contractAddress, ERC721Staking.abi)

    const { data: nbRounds, isLoading: isLoadingNbRounds } = useContractRead(contract, "nbRounds")

    return (
        <>
            <code>{contractAddress}</code>
            {isLoading ? <div>Loading...</div> : error ? <div>{JSON.stringify(error)}</div> : <>
                <NFTViewerGroup stakingContract={contract} />
                <div>Rounds: { isLoadingNbRounds ? <></> : <>{nbRounds.toString()}</>}</div>
                <table>
                    <thead>
                        <tr>
                            <td>Round #</td>
                            <td>Start Time</td>
                            <td>Duration</td>
                            <td>Total Staked</td>
                            <td>Your Stake</td>
                            <td>Weighted Average</td>
                            <td>Round Amount</td>
                            <td>Your Allocation</td>
                            <td>Claimed</td>
                            <td>Unclaimed</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        { nbRounds && nbRounds > 0 ? [...Array(nbRounds.sub(1).toString())].map((index) => <RoundRow key={index} contract={contract} index={index} />) : <></> }
                    </tbody>
                </table>
            </>}
        </>
    )
}

export default NFTStakingTable